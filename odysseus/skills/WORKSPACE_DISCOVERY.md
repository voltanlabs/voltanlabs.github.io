# Workspace Discovery

## When To Use

Use whenever starting a new Odysseus agent session, attaching files, choosing a workspace, or preparing to inspect a repository.

## Procedure

1. Use Shell Access.
2. Run `pwd`.
3. Run `ls`.
4. Run `ls workspace` if a workspace folder exists.
5. Determine the real workspace root from actual command output.
6. Do not assume Windows paths are mounted.
7. Do not assume the selected browser folder is the same as the shell workspace.
8. Report the discovered workspace path.

## Output

Return:

- Current shell path
- Top-level folders
- Detected workspace path
- Any missing expected repository folders