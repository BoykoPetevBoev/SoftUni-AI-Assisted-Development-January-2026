# Prompt: QA Validation, Testing, and Auto-Fix

## Context
After implementing any new feature, endpoint, component, or making code changes in the Budget Tracker application, 
we need to ensure **quality, correctness, and reliability** through automated validation and testing.

This prompt delegates to the **QA Agent** to perform comprehensive quality assurance.

## Task
Hand off to the QA Agent to validate, test, refactor, and auto-fix the recent implementation.

## Instructions

**Step 1: Delegate to QA Agent**

Call the QA Agent with this instruction:
```
@qa Please validate the recent implementation:

1. **Code Quality Review**:
   - Check code follows project standards (see .github/instructions/core.instructions.md)
   - Verify proper TypeScript types (frontend) or Django patterns (backend)
   - Identify any anti-patterns, code smells, or violations
   - Auto-fix simple issues (formatting, imports, type annotations)

2. **Testing Coverage**:
   - Verify tests exist for the new implementation
   - Run existing tests and ensure they pass
   - Identify missing test cases
   - Create missing tests if needed

3. **Integration Validation**:
   - Check API contracts match between frontend and backend
   - Verify authentication/authorization logic is correct
   - Test error handling and validation logic
   - Confirm data flow from API → service → component

4. **Refactoring Improvements**:
   - Suggest and implement safe refactorings for better readability
   - Extract repetitive code into reusable utilities
   - Improve naming conventions if unclear
   - Optimize performance bottlenecks if found

5. **Final Report**:
   - Provide a summary of issues found and fixed
   - List any remaining issues that need manual review
   - Confirm all tests pass
   - Rate code quality (1-10) with justification
```

**Step 2: Review QA Agent Output**

The QA Agent will:
- Auto-fix simple issues automatically
- Ask for clarification on ambiguous cases
- Run tests and report results
- Provide a detailed quality report

**Step 3: Take Action**

Based on QA Agent's findings:
- ✅ If all checks pass → proceed with commit
- ⚠️ If minor issues found → review and approve auto-fixes
- ❌ If critical issues found → address before proceeding

## When to Use This Prompt

✅ **After implementing**:
- New API endpoints
- New React components
- New database models
- New forms with validation
- Authentication/authorization logic
- Business logic changes

✅ **Before**:
- Committing code
- Creating pull requests
- Deploying to production
- Marking a feature as "done"

## Quality Standards Reference

The QA Agent will validate against:
- **Frontend**: `.github/skills/` (React, TypeScript, testing, Storybook patterns)
- **Backend**: `.github/skills/` (Django, DRF, serializers, ORM patterns)
- **General**: `.github/instructions/core.instructions.md`

## Output

The QA Agent will provide:
1. **Issues Found**: List of quality problems, missing tests, violations
2. **Auto-Fixes Applied**: Changes made automatically
3. **Test Results**: Pass/fail status for all affected tests
4. **Quality Score**: Overall rating with improvement suggestions
5. **Next Steps**: Recommended actions before proceeding

---

**Note**: This prompt is a lightweight delegation mechanism. For complex quality audits or full codebase reviews, 
call the QA Agent directly with specific instructions.
