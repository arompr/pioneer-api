# GitHub PR Comment Workflow

When responding to `/oc` or `/opencode` commands on pull requests (including PR review comments on specific code lines):

1. DO NOT commit directly to the current PR branch
2. Create a new branch named: `opencode/fix-{PR#}-{short-desc}-{YYYYMMDD-HHMMSS}`
    - `{PR#}` = original PR number
    - `{short-desc}` = kebab-case summary of the change (max 30 chars, alphanumeric + hyphens only)
    - `{YYYYMMDD-HHMMSS}` = current UTC timestamp
3. Make the requested changes on the new branch
4. Commit and push the new branch
5. Open a new PR targeting the **original PR's head branch** (not the base branch)
6. In the new PR description, include:
    ```
    This PR addresses a review comment on PR #{original}
    ```

When responding to `/oc` or `/opencode` on **issues** (not PRs), use the default behavior (create branch → open PR targeting the repo's default branch).
