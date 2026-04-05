#!/usr/bin/env python3
"""
ONETEN QUANT 智能构建日志 — 每日自动生成脚本
每天 6:00 AM 运行，读取昨天的对话，生成日志章节并推送部署。

用法：python3 daily_log_gen.py
      python3 daily_log_gen.py --date 2026-04-04   # 手动指定日期
      python3 daily_log_gen.py --dry-run            # 预览，不部署
"""

import json
import os
import glob
import subprocess
import sys
import re
import argparse
from datetime import datetime, timezone, timedelta

# ── Config ────────────────────────────────────────────────────────────────────
PROJECT_DIR  = os.path.expanduser('~/构建日志')
DATA_FILE    = os.path.join(PROJECT_DIR, 'src/data.js')
SESSIONS_DIR = os.path.expanduser('~/.claude/projects/-Users-t')

# 颜色按天循环
COLORS = [
    '#00f0ff',  # cyan
    '#a855f7',  # purple
    '#00ff88',  # green
    '#f97316',  # orange
    '#ec4899',  # pink
    '#3b82f6',  # blue
    '#ef4444',  # red
    '#eab308',  # yellow
]

# ── Step 1: 收集昨天的对话 ────────────────────────────────────────────────────
def get_day_range(date_str):
    """返回指定日期 UTC 起止时间（基于本地时区）。"""
    local_tz = datetime.now().astimezone().tzinfo
    day = datetime.strptime(date_str, '%Y-%m-%d').replace(tzinfo=local_tz)
    start = day.replace(hour=0,  minute=0,  second=0,  microsecond=0)
    end   = day.replace(hour=23, minute=59, second=59, microsecond=999999)
    return start.astimezone(timezone.utc), end.astimezone(timezone.utc)


def extract_text(content):
    """从 content 字段提取纯文本（跳过 tool_use / tool_result 块）。"""
    if isinstance(content, str):
        return content.strip()
    if isinstance(content, list):
        parts = []
        for block in content:
            if isinstance(block, dict) and block.get('type') == 'text':
                parts.append(block.get('text', '').strip())
        return '\n'.join(p for p in parts if p)
    return ''


def collect_conversations(date_str):
    """返回指定日期的 [{role, text, ts}] 列表，按时间排序。"""
    start, end = get_day_range(date_str)
    messages = []

    files = glob.glob(os.path.join(SESSIONS_DIR, '*.jsonl'))
    for fpath in files:
        try:
            with open(fpath, encoding='utf-8') as f:
                lines = f.readlines()
        except Exception:
            continue

        for line in lines:
            try:
                e = json.loads(line)
            except Exception:
                continue

            role = e.get('type')
            if role not in ('user', 'assistant'):
                continue

            ts_str = e.get('timestamp', '')
            try:
                ts = datetime.fromisoformat(ts_str.replace('Z', '+00:00'))
            except Exception:
                continue

            if not (start <= ts <= end):
                continue

            msg = e.get('message', {})
            text = extract_text(msg.get('content', ''))

            if not text or len(text) < 10:
                continue

            # 过滤噪音
            if '<channel source=' in text:   continue
            if '[Request interrupted' in text: continue
            if text.strip().startswith('/'):   continue

            messages.append({'role': role, 'text': text[:600], 'ts': ts_str})

    messages.sort(key=lambda m: m['ts'])
    return messages


# ── Step 2: 调用 Claude 生成日志条目 ─────────────────────────────────────────
def generate_log_entry(messages, date_str, chapter_num, color):
    import urllib.request

    convo_text = '\n\n'.join(
        f"[{'用户' if m['role'] == 'user' else 'DALI'}]: {m['text']}"
        for m in messages[:50]
    )

    prompt = f"""以下是 {date_str} 这一天用户（文天）与 AI 助手 DALI 的对话记录，内容关于搭建量化交易/AI 自动化系统。

请从中提炼 4-5 个最重要的对话片段，作为当日"智能构建日志"的章节内容。

输出要求：
1. 直接输出 JSON，不要 Markdown 代码块
2. 消息内容简洁有力，保留技术细节
3. role 只能是 "user" 或 "ai"
4. header 可选，适合标题感强的 AI 消息
5. type 可选，成功用 "success"，危险/警告用 "danger"

JSON 格式：
{{
  "title": "章节标题（10字以内）",
  "subtitle": "副标题（补充说明）",
  "messages": [
    {{"role": "user", "content": "..."}},
    {{"role": "ai", "header": "标题", "content": "...", "type": "success"}}
  ]
}}

对话记录：
{convo_text}"""

    payload = json.dumps({
        'model': 'gemma4:latest',
        'stream': False,
        'messages': [{'role': 'user', 'content': prompt}],
    }).encode('utf-8')

    req = urllib.request.Request(
        'http://localhost:11434/api/chat',
        data=payload,
        headers={'Content-Type': 'application/json'},
        method='POST',
    )
    with urllib.request.urlopen(req, timeout=120) as resp_obj:
        result = json.loads(resp_obj.read().decode('utf-8'))

    raw = result['message']['content'].strip()

    # Strip markdown code fences if present
    raw = re.sub(r'^```(?:json)?\s*', '', raw)
    raw = re.sub(r'\s*```$', '', raw).strip()

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        # Try to find the first complete JSON object using a decoder
        decoder = json.JSONDecoder()
        idx = raw.find('{')
        if idx >= 0:
            try:
                data, _ = decoder.raw_decode(raw, idx)
            except json.JSONDecodeError:
                raise ValueError(f'无法解析 JSON：{raw[:300]}')
        else:
            raise ValueError(f'无法找到 JSON：{raw[:300]}')

    # Normalize role: "assistant" → "ai"
    for msg in data.get('messages', []):
        if msg.get('role') == 'assistant':
            msg['role'] = 'ai'

    return {
        'date':     date_str,
        'chapter':  str(chapter_num),
        'color':    color,
        'title':    data.get('title', '日常构建'),
        'subtitle': data.get('subtitle', ''),
        'messages': data.get('messages', []),
    }


# ── Step 3: 写入 src/data.js ──────────────────────────────────────────────────
def append_to_data_js(entry):
    with open(DATA_FILE, encoding='utf-8') as f:
        content = f.read()

    if f"date: '{entry['date']}'" in content:
        print(f"  ⏭  {entry['date']} 已存在，跳过写入。")
        return False

    def js(s):
        return json.dumps(s, ensure_ascii=False)

    lines = []
    for msg in entry['messages']:
        parts = [f"      role: {js(msg['role'])}"]
        if msg.get('header'):  parts.append(f"      header: {js(msg['header'])}")
        if msg.get('content'): parts.append(f"      content: {js(msg['content'])}")
        if msg.get('type'):    parts.append(f"      type: {js(msg['type'])}")
        lines.append('    {\n' + ',\n'.join(parts) + ',\n    }')

    new_entry = (
        f"  {{\n"
        f"    date: {js(entry['date'])},\n"
        f"    chapter: {js(entry['chapter'])},\n"
        f"    color: {js(entry['color'])},\n"
        f"    title: {js(entry['title'])},\n"
        f"    subtitle: {js(entry['subtitle'])},\n"
        f"    messages: [\n"
        + '\n'.join(lines) + '\n'
        f"    ],\n"
        f"  }},"
    )

    new_content = content.replace('\n];', f'\n{new_entry}\n];')
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return True


# ── Step 4: git push → Netlify ────────────────────────────────────────────────
def deploy(date_str):
    os.chdir(PROJECT_DIR)
    subprocess.run(['git', 'add', 'src/data.js'], check=True)
    subprocess.run(
        ['git', 'commit', '-m', f'日志 {date_str} — 自动生成'],
        check=True,
    )
    subprocess.run(['git', 'push'], check=True)
    print(f'  🚀 已推送，Netlify 将自动部署。')


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--date',    help='手动指定日期 YYYY-MM-DD（默认昨天）')
    parser.add_argument('--dry-run', action='store_true', help='预览结果，不写文件不部署')
    args = parser.parse_args()

    local_tz = datetime.now().astimezone().tzinfo
    target_date = args.date or (datetime.now(tz=local_tz) - timedelta(days=1)).strftime('%Y-%m-%d')

    print(f'\n📅 处理 {target_date} 的对话...')

    # 读现有 data.js 确定下一章节号和颜色
    with open(DATA_FILE, encoding='utf-8') as f:
        existing = f.read()
    chapter_nums = [int(c) for c in re.findall(r"chapter: '(\d+)'", existing) if c.isdigit()]
    last_chapter = max(chapter_nums, default=32)
    next_chapter = last_chapter + 1
    color = COLORS[next_chapter % len(COLORS)]

    # 收集对话
    messages = collect_conversations(target_date)
    if not messages:
        print('⚠️  当天没有找到对话，退出。')
        sys.exit(0)
    print(f'  📝 找到 {len(messages)} 条消息，调用 Claude 提炼...')

    # 生成日志条目
    entry = generate_log_entry(messages, target_date, next_chapter, color)
    print(f'  ✅ 章节生成：{entry["title"]}')
    print(f'     副标题：{entry["subtitle"]}')
    print(f'     消息数：{len(entry["messages"])} 条')

    if args.dry_run:
        print('\n[dry-run] 生成的条目：')
        print(json.dumps(entry, ensure_ascii=False, indent=2))
        return

    # 写入 data.js 并部署
    if append_to_data_js(entry):
        print('  📄 已写入 src/data.js')
        deploy(target_date)

    print('\n✅ 完成！')


if __name__ == '__main__':
    main()
