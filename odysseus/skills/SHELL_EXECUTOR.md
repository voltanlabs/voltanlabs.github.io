# Shell Executor

## When To Use

Use when the user requests filesystem inspection, repository inspection, command execution, path verification, or environment discovery.

## Procedure

1. Execute pwd.
2. Verify current workspace.
3. Execute ls or dir.
4. Display exact command output.
5. Do not summarize command output.
6. Do not invent files.
7. If a path does not exist, report the error exactly.

## Success Criteria

Evidence comes from command output, not assumptions.