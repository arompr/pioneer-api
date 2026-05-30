---
name: validation
description: Guide for validating the project by running type checks, lint, format, and tests. Use this when asked to run all checks, validate the project, or verify code quality.
---

## Skill: Validate Project (Tests, Types, Lint, Format)

When asked to "run all checks", "validate the project", or similar, perform the following steps and produce a structured, human‑readable summary.

### Steps to Execute

1. **Run TypeScript type checking**
    - Command: `npm run type:check`

2. **Run ESLint static analysis**
    - Command: `npm run lint:check`

3. **Run Prettier formatting check**
    - Command: `npm run format:check`

4. **Run Vitest test suite**
    - Command: `npm run test`

### Output Format

Produce a Markdown summary with the following sections:

---

### **🟢 Summary**

- **Successes:**
  - Bullet list of all checks that passed (e.g., "✅ TypeScript type check passed", "✅ 185 tests passed")
- **Failures:**
  - Bullet list of all checks that failed (e.g., "❌ Lint check failed (3 errors)")
- Include counts for each check (e.g., “142 tests passed”, “0 formatting issues”)

---

### **🔴 Errors**

For each failing category (types, lint, format, tests):

- Show the **error group name** (e.g., “Type Errors”, “Lint Violations”, “Test Failures”)
- Group errors by file (use import-alias paths when possible)
- For each error:
  - Bullet the error message
  - Directly below, provide a concise explanation of why this error likely occurred
- Keep output readable — avoid dumping raw stack traces unless necessary

---

### **🛠️ Explanations & Likely Fixes**

For each error group, provide:

- A short explanation of **why this error likely occurred**
- Bullet list of potential fixes
- Suggest the most likely fix based on project patterns
- Provide a bullet with a **precise proposed fix** (e.g., "💡 Add `: void` as the return type to the function at line 33, based on its implementation")
- If possible, infer and state the exact type to use from the function body or project conventions

---

### **📁 File‑by‑File Breakdown**

For each file with issues:

- Show the file path using import‑alias form when possible
- Provide a short description of what’s wrong
- Suggest the most likely fix based on project patterns

---

### Notes

- Keep output concise and readable
- Never modify files automatically unless explicitly asked
- Always follow project conventions:
  - Named exports only
  - Import aliases (`#common/*`, `#matchmaking/*`, `#game/*`, `#test/*`)
  - DDD layering rules
  - Value‑object immutability
  - Domain errors extend `DomainError`
