#!/usr/bin/env python3
"""
Minimal HTTP server that runs on the HOST machine and triggers software updates.
The backend container cannot run host-level commands (git pull, docker compose)
directly, so it delegates to this agent via HTTP.

Usage:
    python3 update_agent.py

The agent listens on port 8099. Keep it running as a background process
(e.g. in a tmux session or via systemd).
"""
from http.server import HTTPServer, BaseHTTPRequestHandler
import subprocess
import threading
import os

SCRIPT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'update.sh')


class UpdateHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/update':
            threading.Thread(target=self._run_update, daemon=True).start()
            self._respond(200, b'{"status": "started"}')
        else:
            self._respond(404, b'{"error": "not found"}')

    def _respond(self, code, body):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(body)

    def _run_update(self):
        print(f'Running update: {SCRIPT}')
        subprocess.run(['bash', SCRIPT])

    def log_message(self, format, *args):
        pass  # suppress per-request logging


if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', 8099), UpdateHandler)
    print(f'Update agent listening on port 8099 (script: {SCRIPT})')
    server.serve_forever()
