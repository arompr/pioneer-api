---
name: code-review
description: Procedure for performing a structured code review on a set of code changes. Use when reviewing code for quality, security, and best practices.
---

## Skill: Code Review

This skill defines the canonical review procedure. The agent loading this skill MUST execute these steps after obtaining the code changes (via task prompt, git diff, or any other means).

### Prerequisites

Before starting the review, ensure you have:

- The full diff of the changes being reviewed
- The list of files changed
- Access to the project conventions (AGENTS.md) if available
- The actual file contents for changed files (read them with the Read tool)

### Review Procedure

1. **Gather Context**
    - Identify all modified files
    - Read the relevant file contents for context
    - Note any project-specific conventions from AGENTS.md

2. **Analyze Quality**
    - Check for code duplication (DRY principle)
    - Assess complexity and readability
    - Verify error handling completeness
    - Look for type safety issues

3. **Security Analysis**
    - Scan for injection vulnerabilities (SQL, command, XSS)
    - Check authentication and authorization logic
    - Verify input validation and sanitization
    - Look for hardcoded secrets or credentials

4. **Best Practices**
    - Follow project-specific standards from AGENTS.md
    - Check naming conventions
    - Verify test coverage implications
    - Assess documentation completeness

5. **Categorize Issues**
   Group findings by severity:
    - **Critical**: Security vulnerabilities, data loss risks, broken core functionality
    - **Major**: Maintainability issues, significant complexity, missing error handling
    - **Minor**: Style inconsistencies, minor improvements, optional suggestions

6. **Generate Report**
   Format the output according to the template below.

### Output Format Template

```
## Code Review Summary

[2-3 sentence overview of changes and overall quality]

## Critical Issues (Must Fix)

- `src/file.ts:42` - [Issue description] - [Why critical] - [How to fix]

## Major Issues (Should Fix)

- `src/file.ts:15` - [Issue description] - [Impact] - [Recommendation]

## Minor Issues (Consider Fixing)

- `src/file.ts:88` - [Issue description] - [Suggestion]

## Positive Observations

- [Good practice 1]
- [Good practice 2]

## Overall Assessment

[Final verdict and recommendations]
```

### Quality Standards

- Every issue MUST include file path and line number (e.g., `src/auth.ts:42`)
- Issues MUST be categorized by severity with clear criteria
- Recommendations MUST be specific and actionable (not vague)
- Include code examples in recommendations when helpful
- Balance criticism with recognition of good practices

### Edge Cases

- **No issues found**: Provide positive validation, mention what was checked
- **Too many issues (>20)**: Group by type, prioritize top 10 critical/major
- **Unclear code intent**: Note ambiguity and request clarification
- **Missing context (no AGENTS.md)**: Apply general best practices
- **Large changeset**: Focus on most impactful files first
