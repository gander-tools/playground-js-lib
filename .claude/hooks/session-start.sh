#!/bin/bash

# SessionStart Hook for @gander-tools/playground
# Runs when Claude Code session starts
# Output to stdout is automatically added to context

PROJECT_DIR="$CLAUDE_PROJECT_DIR"

echo "==================================================================="
echo "  @gander-tools/playground - Claude Code Session Start"
echo "==================================================================="
echo ""

# Navigate to project directory
cd "$PROJECT_DIR" || exit 1

# Check if dependencies are installed
if [ ! -d "$PROJECT_DIR/node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
else
    echo "✓ Dependencies already installed"
    echo ""
fi

# Ensure Lefthook git hooks are installed
if command -v npx &> /dev/null; then
    if ! npx lefthook version &> /dev/null 2>&1; then
        echo "⚙️  Installing Lefthook git hooks..."
        npx lefthook install
        echo ""
    else
        echo "✓ Lefthook git hooks installed"
        echo ""
    fi
fi

# Display project status
echo "📊 Project Status:"
echo "   - Node version: $(node --version 2>/dev/null || echo 'N/A')"
echo "   - npm version: $(npm --version 2>/dev/null || echo 'N/A')"

# Get package version
if [ -f "$PROJECT_DIR/package.json" ]; then
    PACKAGE_VERSION=$(node -p "require('./package.json').version" 2>/dev/null)
    echo "   - Package version: $PACKAGE_VERSION"
fi
echo ""

# Show git status
echo "🔧 Git Status:"
GIT_STATUS=$(git status --short 2>/dev/null)
if [ -z "$GIT_STATUS" ]; then
    echo "   Working tree clean"
else
    echo "$GIT_STATUS" | head -n 10
    TOTAL_CHANGES=$(echo "$GIT_STATUS" | wc -l)
    if [ "$TOTAL_CHANGES" -gt 10 ]; then
        echo "   ... and $((TOTAL_CHANGES - 10)) more files"
    fi
fi
echo ""

# Show current branch
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)
echo "   Current branch: $CURRENT_BRANCH"
echo ""

# Important reminders
echo "⚠️  Important Reminders:"
echo "   - Use 'npm' instead of 'bun' for all commands in Claude Code"
echo "   - Conventional Commits are ENFORCED (e.g., 'feat:', 'fix:', 'chore:')"
echo "   - Run 'npm run check:fix' before committing"
echo "   - Run 'npm run typecheck' to verify TypeScript"
echo ""

echo "==================================================================="
echo "  Development environment ready!"
echo "==================================================================="
