#!/bin/bash

# DSL Studio - Shutdown Script
# This script stops all running services

echo "🛑 Stopping DSL Studio..."
echo ""

# Kill frontend
echo "Stopping frontend..."
lsof -ti :3000 | xargs kill -9 2>/dev/null || true
sleep 1
echo "✓ Frontend stopped"

# Kill backend
echo "Stopping backend..."
pkill -f "python server.py" 2>/dev/null || true
sleep 1
echo "✓ Backend stopped"

# Stop MongoDB
echo "Stopping MongoDB..."
docker stop mongodb 2>/dev/null || true
echo "✓ MongoDB stopped"

echo ""
echo "✓ All services stopped"
echo ""
