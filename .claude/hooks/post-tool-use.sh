#!/bin/bash

# PostToolUse Hook for @gander-tools/playground
# Runs after Write/Edit/MultiEdit operations
# Validates code quality with Biome and TypeScript

PROJECT_DIR="$CLAUDE_PROJECT_DIR"

# Navigate to project directory
cd "$PROJECT_DIR" || exit 1

# Only run checks if node_modules exists
if [ ! -d "$PROJECT_DIR/node_modules" ]; then
    echo "⚠️  Skipping checks - dependencies not installed. Run 'npm install' first."
    exit 0
fi

echo ""
echo "🔍 Running code quality checks..."
echo ""

# Track overall status
ALL_CHECKS_PASSED=true

# Run Biome checks (linting + formatting)
echo "1️⃣  Checking code style with Biome..."
if npm run check 2>&1 | grep -E "(error|✖|fail)" > /dev/null; then
    echo "   ❌ Code style issues detected"
    echo "   💡 Fix with: npm run check:fix"
    ALL_CHECKS_PASSED=false
else
    echo "   ✅ Code style checks passed"
fi
echo ""

# Run TypeScript type checking
echo "2️⃣  Running TypeScript type check..."
if npm run typecheck 2>&1 | grep -E "(error|TS[0-9]+)" > /dev/null; then
    echo "   ❌ Type errors found"
    echo "   💡 Review errors above and fix before committing"
    ALL_CHECKS_PASSED=false
else
    echo "   ✅ Type checks passed"
fi
echo ""

# Summary
if [ "$ALL_CHECKS_PASSED" = true ]; then
    echo "✨ All quality checks passed! Ready to commit."
else
    echo "⚠️  Some checks failed. Please review and fix issues before committing."
fi
echo ""

# Always exit 0 to not block the operation
exit 0
