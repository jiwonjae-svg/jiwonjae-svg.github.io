# AGENTS.md

## Repository Goal

This project is part of a Japan-focused software engineering portfolio. Treat it as a practical hiring signal, not as a hobby demo.

## Working Rules

- Keep changes small, reviewable, and scoped to the request.
- Preserve existing app behavior unless a task explicitly asks for a behavior change.
- Do not add unnecessary features, UI redesigns, or server-side processing.
- Do not invent users, metrics, certifications, production usage, or business claims.
- Prioritize reliability, README quality, tests, privacy explanation, performance notes, and clear technical reasoning.
- For image-to-SVG work, keep browser APIs at the edge and put core conversion logic in testable pure functions where practical.
- Add tests for core logic when changes touch sampling, filtering, clustering, SVG generation, security helpers, or state transitions.

## Documentation Expectations

Keep `README.md` useful for technical reviewers and recruiters. It should cover:

- Product summary
- Key features
- Tech stack
- Architecture or data flow
- Image-to-SVG pipeline details
- Privacy model
- Technical challenges
- What changed or improved
- Local run instructions
- Tests and benchmark commands
- Japanese summary for recruiters

## Quality Gate

Before considering a code change complete, run:

```bash
npm run lint
npm test
npm run build
```

When conversion performance changes, also run:

```bash
npm run benchmark
```

## Commit/Push Automation

- After implementing user-requested changes in this repository and passing verification, automatically commit and push unless the user explicitly asks not to.
- Use `scripts/codex-commit-push.ps1` for automated commits. Provide an explicit commit message and explicit file list whenever possible.
- Do not stage unrelated files. Never stage `.env`, `.env*.local`, `.vercel`, `.next`, `node_modules`, `repomix-output.xml`, build outputs, or ignored/generated output.
- Prefer a `codex/` branch for new work. If the user is already working on `main` and explicitly wants direct deployment or push, use `-AllowMain`.
- Use `-AllowAssets` only when the requested change intentionally adds or updates binary assets such as screenshots.
- If lint, test, or build checks fail, fix the failure before committing. If the failure is unrelated and cannot be fixed safely, report it and do not hide it.
- GitHub CLI is available as `gh`; if `gh auth status` reports logged out, run `gh auth login` before GitHub API, issue, PR, or release operations.
