---
name: pr-review-fix
description: Guide for fixing PR review comments by creating a stacked branch and stacked PR targeting the original PR's head branch. Use this when applying reviewer feedback to a PR on the current branch.
---

## Skill: Fix PR Review Comments via Stacked Branch + Stacked PR

This skill operationalizes `.opencode/rules/github-pr-workflow.md` for the local "apply reviewer comment" workflow. The agent loading this skill (e.g., `pr-review-fixer`) MUST follow these steps in order.

### Safety Rules (apply at every step)

- NEVER commit or push directly to the original PR's branch.
- NEVER force push.
- NEVER skip git hooks (no `--no-verify`).
- Abort with a clear message if the working tree is dirty — ask the user to stash or commit first.
- Abort if no PR is found for the current branch.

### Confirmation Gates

The procedure has **two mandatory user confirmation gates**:

- **Gate A — Before branch creation and edits.** Show:
    - The matched reviewer comment(s) (author, file:line, body)
    - The proposed new branch name
    - The files expected to be touched
    - The chosen complexity tier and coder subagent (`coder-nano` / `coder-medium` / `coder-large`)
- **Gate B — Before push, PR creation, and reply.** Show:
    - The new branch name and the target base (= original PR's head branch)
    - The proposed PR title
    - The proposed PR body (preview)
    - The planned reply text on the original reviewer comment

Do not proceed past a gate without explicit user confirmation.

---

### Step 1 — Detect the current PR

1. `git rev-parse --abbrev-ref HEAD` → record as `currentBranch`.
2. Refuse to proceed if `currentBranch` matches `opencode/fix-*` (this would mean we are already on a stacked fix branch).
3. `gh pr view --json number,headRefName,baseRefName,url,title,state` → record as `originalPR`.
    - If the command fails or returns no PR, abort with: `No open PR found for branch <currentBranch>. Push the branch and open a PR before using this workflow.`
4. Confirm `originalPR.state == "OPEN"`; otherwise abort.
5. Confirm `originalPR.headRefName == currentBranch`; otherwise abort with a message instructing the user to check out the PR head branch first.

### Step 2 — Fetch reviewer comments

Use `gh api` and the repo from `gh repo view --json nameWithOwner -q .nameWithOwner`.

1. **Line-level review comments**:
   `gh api repos/{owner}/{repo}/pulls/{number}/comments --paginate`
2. **General issue/PR comments**:
   `gh api repos/{owner}/{repo}/issues/{number}/comments --paginate`
3. **Review summaries** (for context only):
   `gh api repos/{owner}/{repo}/pulls/{number}/reviews --paginate`

For each comment, retain: `id`, `user.login`, `path`, `line` (or `original_line`), `body`, `diff_hunk`, `in_reply_to_id`, `created_at`, and a synthetic `kind` field (`"review"` for line comments, `"issue"` for general comments).

### Step 3 — Match the user prompt to comment(s)

Perform a fuzzy match between the user's prompt (e.g., "fix the null check Alice mentioned") and each comment's `body`, `path`, and author.

- If exactly one strong match: proceed with it.
- If multiple plausible matches OR no strong match: present a compact candidate list to the user and ask them to pick:

    ```
    #  Author      File:Line             Snippet
    1  @alice      src/x.ts:88           "Missing null check before .map"
    2  @bob        src/y.ts:142          "Extract this into a helper"
    ```

    Wait for the user's pick before continuing.

### Step 4 — Read affected files

For each matched comment with a `path`, use the `read` tool on that file with enough surrounding context (typically ±40 lines around `line`). Capture the actual current code at those locations — do not rely solely on `diff_hunk`.

### Step 5 — Plan the branch and edits

1. Derive `short-desc`:
    - Summarize the change in kebab-case.
    - Max 30 characters.
    - Only `[a-z0-9-]`.
2. Compute timestamp: `date -u +%Y%m%d-%H%M%S`.
3. Branch name: `opencode/fix-{originalPR.number}-{short-desc}-{timestamp}`.
4. Assess complexity (mirrors `orchestrator.md`):
    - **coder-nano**: 1–2 line fix in one file, rename, typo, config tweak.
    - **coder-medium**: single-file multi-line change, small refactor, straightforward bug fix.
    - **coder-large**: multi-file changes, architectural work, complex fixes, design decisions.
    - When in doubt, prefer coder-medium.
5. **Gate A** — present the plan to the user and wait for confirmation.

### Step 6 — Create the branch and delegate the code change

Only after Gate A passes:

1. Verify clean working tree: `git status --porcelain` → must be empty.
2. `git checkout -b <new-branch>` from the current PR head.
3. Delegate the actual code edits via the `task` tool to the chosen coder agent. The delegation prompt MUST include:
    - **User request** (the exact prompt the user gave).
    - **Matched comment(s)** in full (author, file:line, body, diff_hunk).
    - **Files to modify** with absolute paths.
    - **Current code context** read in Step 4.
    - **Scope**: explicit in-scope and out-of-scope statement.
    - **Conventions reminder**: follow `AGENTS.md` (named exports, import aliases, DDD layering, domain errors extend `DomainError`, etc.).

### Step 7 — Validate

Load the `validation` skill and run all checks:

- `npm run type:check`
- `npm run lint:check`
- `npm run format:check`
- `npm run test`

If any check fails, surface the failures and either fix them directly (small) or re-delegate to the same coder agent (larger). Re-run validation until clean. Do not advance to Step 8 with failing checks.

### Step 8 — Commit, push, open the new PR

1. Learn commit style: `git log -10 --format='%s'` on the original PR branch's history.
2. Stage and commit:
    - `git add -A`
    - Commit message follows the repo's style, references the original PR (e.g., `fix: add null check in X (PR #142 review)`).
3. **Gate B** — present push + PR plan to the user with:
    - New branch name
    - Target base (= `originalPR.headRefName`)
    - PR title
    - PR body preview (see template below)
    - Planned reply on the original review comment
      Wait for confirmation.
4. `git push -u origin <new-branch>`.
5. Create the stacked PR:

    ```
    gh pr create \
      --base <originalPR.headRefName> \
      --head <new-branch> \
      --title "<title>" \
      --body "<body>"
    ```

    **CRITICAL**: `--base` is the original PR's **head** branch, NOT its base.

#### PR body template

```
## Summary
- <1–3 bullets describing the fix>

## Comment addressed
> <quoted reviewer comment body>
>
> — @<reviewer> on `<file>:<line>` (PR #<original>)

This PR addresses a review comment on PR #<original>
```

The literal line `This PR addresses a review comment on PR #<original>` is required by `.opencode/rules/github-pr-workflow.md`.

### Step 9 — Reply on the original review comment (always)

After the new PR is created, post a reply on the original reviewer comment with the new PR URL.

- **For a line-level review comment** (`kind == "review"`):

    ```
    gh api repos/{owner}/{repo}/pulls/{originalPR.number}/comments/{comment.id}/replies \
      -X POST \
      -f body="Addressed in #<newPR.number> — <newPR.url>"
    ```

- **For a general issue comment** (`kind == "issue"`):

    ```
    gh api repos/{owner}/{repo}/issues/{originalPR.number}/comments \
      -X POST \
      -f body="Addressed in #<newPR.number> — <newPR.url> (re: @<reviewer>'s comment)"
    ```

If the reply call fails (e.g., cannot reply to this comment type), post a general comment on the original PR's issue thread as a fallback instead:

```
gh api repos/{owner}/{repo}/issues/{originalPR.number}/comments \
  -X POST \
  -f body="Addressed in #<newPR.number> — <newPR.url> (fixes @<reviewer>'s finding: <short description of the issue the comment exposed>)"
```

`<short description>` should be a concise summary of the problem the comment identified (e.g., "missing null check before `.map()`", "unhandled error in `connectToServer`", "race condition on lobby leave"). Derive it from the comment body and diff_hunk context.

If this fallback also fails, report the failure but do not roll back the PR — the PR is already created.

### Step 10 — Report back to the user

Print a concise summary:

- New branch name
- New PR URL
- Files changed
- Validation status
- Reply status (success / fallback posted / failure)

---

### Notes

- Always use the `gh` CLI; never construct GitHub URLs manually beyond what `gh` returns.
- Do not modify `.opencode/rules/github-pr-workflow.md` — it is the canonical rule source; this skill operationalizes it.
- If multiple reviewer comments are matched and the user wants them addressed together, the same branch + PR can cover all of them; reply on each one in Step 9.
