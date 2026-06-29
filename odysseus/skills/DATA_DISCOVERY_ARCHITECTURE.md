# Data Discovery Architecture

## Current Direction

Scanner-centric architecture.

Scanner remains visible at all times.

Permanent UI:

- Signal Circle
- Signal Image Area
- Status Text
- Discovery Input
- Discover Button
- Random Button

Everything else is a module.

Modules:

- Battle
- Capture
- Party
- Dex
- Results
- Settings

## Refactor Rule

Do not hide scanner.
Do not replace scanner.
Do not stack full pages.
Mount modules inside scanner shell.