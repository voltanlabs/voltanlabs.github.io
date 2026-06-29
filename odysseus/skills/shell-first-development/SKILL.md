---
name: shell-first-development
description: Use when working in Odysseus on local code, files, installs, build checks, repo state, or terminal-driven debugging.
---

# Shell-First Development

Use this skill when the user asks for hands-on local development work.

## Principle

Inspect the real environment before making claims. Use shell and file tools for evidence, then edit intentionally.

## Procedure

1. Confirm workspace with `get_workspace`.
2. Inspect files with `ls`, `glob`, `grep`, and `read_file`.
3. Check repository state with `bash` only for commands that do not mutate files.
4. Use `edit_file` for targeted edits and `write_file` for new files.
5. Run a focused verification command.
6. Report what changed and what still needs testing.

## Tool Preferences

Prefer:

```get_workspace
```

```ls
.
```

```glob
**/*.html
```

```grep
{"pattern":"scanner","path":".","include":"*.js"}
```

```read_file
path/to/file.js
```

Use `bash` for read-only diagnostics, installs, git status, and build/test commands.

## Editing Rules

- Never use shell redirection, heredocs, `sed -i`, or `tee` to edit files when `edit_file` or `write_file` exists.
- Never claim a command succeeded unless the tool returned success.
- Never fabricate terminal output.
- After failed commands, read the error and retry with a concrete fix.

## Completion Rule

The task is not done until the requested change exists and a reasonable check has been attempted or an honest blocker is reported.
