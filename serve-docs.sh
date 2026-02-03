#!/bin/bash

# Script to serve/re-serve mkdocs documentation
# Kills any existing mkdocs server and starts a fresh one

echo "Stopping any existing mkdocs server on port 8000..."
lsof -ti:8000 | xargs kill -9 2>/dev/null

echo "Starting mkdocs server..."
cd documentation && ../.venv/bin/mkdocs serve

# Note: Server will run in foreground. Press Ctrl+C to stop.
# Documentation available at http://127.0.0.1:8000/
