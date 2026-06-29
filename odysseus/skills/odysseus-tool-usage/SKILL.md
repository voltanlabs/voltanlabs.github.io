---
name: odysseus-tool-usage
description: Teach models the exact tool invocation format used by Odysseus Agent Mode.
---

# Odysseus Tool Usage

Use this skill whenever operating inside Odysseus.

## Rules

- Use built-in tools instead of describing them.
- Emit exactly one fenced tool block when a tool is required.
- The tool name must be the language tag of the fenced block.
- Wait for the tool result before continuing.
- Never invent slash commands.
- Never invent dot commands.
- Never use inline commands.

## Correct

```manage_memory
list
```

## Incorrect

- /manage_tool
- .manage_memory {"action":"list"}
- manage_memory list

## Workflow

1. Decide whether a tool is required.
2. Emit the fenced tool block.
3. Consume the returned tool result.
4. Continue with the answer.

If a tool is unavailable or fails, report the failure honestly instead of hallucinating output.
