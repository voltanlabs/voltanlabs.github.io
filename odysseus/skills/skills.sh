#!/usr/bin/env bash
set -euo pipefail

# VoltanLabs Odysseus Tool Usage Skill
# Purpose: create a compact Odysseus skill that teaches local models the exact
# fenced-code-block tool format Odysseus Agent Mode expects.
#
# Run from this folder or from the repository root:
#   bash odysseus/skills/skills.sh
#
# Output:
#   odysseus/skills/odysseus-tool-usage/SKILL.md

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$SCRIPT_DIR/odysseus-tool-usage"
SKILL_FILE="$SKILL_DIR/SKILL.md"

mkdir -p "$SKILL_DIR"

cat > "$SKILL_FILE" <<'SKILL_MD'
---
name: odysseus-tool-usage
description: Use when a local model in Odysseus Agent Mode needs to call built-in tools reliably without inventing slash commands, dot commands, or fake tool syntax.
---

# Odysseus Tool Usage

## Core Rule

You are running inside Odysseus Agent Mode. Odysseus tools execute only when you emit a fenced code block with the tool name as the language tag.

Correct format:

```manage_memory
list
```

Never use slash commands such as `/manage_tool`.
Never use dot commands such as `.manage_memory {"action":"list"}`.
Never write plain inline commands such as `manage_memory list`.
Never describe using a tool when a tool call is required.

## How To Use Tools

When a tool is needed, output the fenced tool block directly. After Odysseus returns the tool result, answer from that result.

Use this pattern:

1. Decide whether a tool is needed.
2. Emit one valid fenced tool block.
3. Wait for the tool result.
4. Continue with a short answer based on the result.

## Examples

List memories:

```manage_memory
list
```

Search memories:

```manage_memory
search
Odysseus
```

Add a persistent user fact:

```manage_memory
add
User prefers Odysseus tools to be called with fenced code blocks.
```

List notes:

```manage_notes
{"action":"list"}
```

Open the Brain panel:

```ui_control
open_panel brain
```

Show MCP server status:

```manage_mcp
{"action":"list"}
```

## Failure Rule

If a tool is missing or fails, say what failed briefly and suggest the next concrete step. Do not hallucinate tool output.

## Important Distinction

Odysseus slash commands are for the human UI command palette. They are not the agent tool-call format.

The agent tool-call format is always a fenced code block with the tool name as the language tag.
SKILL_MD

echo "Created $SKILL_FILE"
