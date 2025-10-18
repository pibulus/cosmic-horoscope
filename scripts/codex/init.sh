#!/bin/bash
# Global Codex session initializer
set -euo pipefail

LAUNCH=0
if [[ "${1:-}" == "--launch" ]]; then
  LAUNCH=1
  shift
fi
CODEX_ARGS=("$@")

REPO_ROOT=$(pwd)

if [ ! -x "$REPO_ROOT/scripts/codex/init.sh" ]; then
  if [ -x "$HOME/.codex/codex_scripts/sync_repo.sh" ]; then
    "$HOME/.codex/codex_scripts/sync_repo.sh" "$REPO_ROOT"
  fi
fi

printf "\n🎛️  Codex init → repo: %s\n" "$REPO_ROOT"

BOOT_MESSAGE=""
if [ -f "$REPO_ROOT/bootup.sh" ]; then
  echo "⚙️   Running bootup script (network hiccups are fine)..."
  if BOOT_MESSAGE=$("$REPO_ROOT/bootup.sh" 2>&1); then
    echo "✅ Bootup sequence complete."
  else
    echo "⚠️ Bootup script exited with a non-zero status (likely network limits)."
    echo "   You can rerun it later with: ./bootup.sh"
  fi
  printf "%s\n" "$BOOT_MESSAGE"
  echo
else
  echo "ℹ️  No bootup.sh detected in repo. Skipping additional context."
fi

cat <<TIP
🧠 Codex tips:
  • MCP servers are pre-configured in ~/.codex/config.toml.
    If they timeout, enable network access and rerun: codex mcp list
  • Launch tooling lives in ~/Projects/active/apps/launch-arsenal
    (see README there for full commands).
  • Update the diary at ~/.codex/codex_diary.md when you wrap a session.
TIP

if [ "$LAUNCH" -eq 1 ]; then
  if ! command -v codex >/dev/null 2>&1; then
    echo "❌ 'codex' CLI not found in PATH. Install codex before using --launch."
    exit 1
  fi
  echo "🎙  Launching Codex CLI with boot context..."
  PROMPT=$(cat <<EOF2
Repo: $REPO_ROOT

$BOOT_MESSAGE

MCP roster lives in ~/.codex/config.toml.
Remember: juicy · sticky · fresh.
EOF2
)
  exec codex --cd "$REPO_ROOT" "${CODEX_ARGS[@]}" "$PROMPT"
fi
