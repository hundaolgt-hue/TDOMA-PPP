# Smart Mall Proposal — Claude Code Kit

## Install

```
your-repo/
├── CLAUDE_CODE_MASTER_PROMPT.md
├── .claude/
│   ├── skills/
│   │   ├── cgi-loop-asset-prompting/SKILL.md
│   │   ├── award-web-experience/SKILL.md
│   │   └── project-orchestration/SKILL.md
│   └── commands/
│       ├── goal.md  plan.md  loop.md
│       ├── parallel.md  audit.md  asset.md
├── assets-raw/     ← your animation assets
└── docs-source/    ← your financial model, BOQ, company profile
```

## Run order

1. `/goal award-winning Smart Mall proposal site, 7 chapters` → GOAL.md
2. `/plan` → risk-ordered phases, approve it
3. `/asset chapter 1 exploded assembly` (repeat per animation) → prompts + render specs
4. Paste `CLAUDE_CODE_MASTER_PROMPT.md`, build the greybox end-to-end
5. `/parallel data parsing, financial dashboard, BOQ table, company profile`
6. `/loop chapter 1` … `/loop chapter 7` — in-session, not delegated
7. `/audit` before you show anyone

## The one thing that decides this project

Step 4. Get the scroll rhythm right on placeholder boxes before a single real render goes in. Everything after that is execution; that step is the design.
