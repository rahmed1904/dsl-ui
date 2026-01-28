#!/bin/bash

# Restart script for DSL Studio
# Runs the project's `stop.sh` then `startup.sh` to perform a restart.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🔁 Restarting DSL Studio..."

# Run stop script (don't fail restart if stop reports non-zero)
if [ -f "$SCRIPT_DIR/stop.sh" ]; then
  echo "🛑 Running stop.sh..."
  if [ -x "$SCRIPT_DIR/stop.sh" ]; then
    "$SCRIPT_DIR/stop.sh" || echo "stop.sh exited non-zero, continuing..."
  else
    bash "$SCRIPT_DIR/stop.sh" || echo "stop.sh exited non-zero, continuing..."
  fi
else
  echo "⚠ stop.sh not found in $SCRIPT_DIR — skipping stop step"
fi

sleep 2

# Run startup script (allow errors to propagate)
if [ -f "$SCRIPT_DIR/startup.sh" ]; then
  echo "🚀 Running startup.sh..."
  if [ -x "$SCRIPT_DIR/startup.sh" ]; then
    "$SCRIPT_DIR/startup.sh"
  else
    bash "$SCRIPT_DIR/startup.sh"
  fi
else
  echo "❌ startup.sh not found in $SCRIPT_DIR — cannot start services"
  exit 2
fi

echo "✅ Restart complete"
