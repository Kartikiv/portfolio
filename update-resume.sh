#!/bin/bash
# update-resume.sh — Update only the sections you include in resume-update.json
#
# USAGE:
#   ./update-resume.sh                      # reads resume-update.json
#   ./update-resume.sh my-changes.json      # reads a specific file
#
# FORMAT (resume-update.json):
#   Include ONLY the sections you want to change. Everything else stays untouched.
#   The JSON keys must match section names: hero, skills, experience, projects,
#   certifications, education, contact
#
# EXAMPLE — update only experience and contact:
#   {
#     "experience": { "items": [ ... ] },
#     "contact": { "email": "new@email.com", ... }
#   }
#
# CREDENTIALS:
#   Read from .env (ADMIN_USERNAME, ADMIN_PASSWORD).
#   Optionally override the API URL with API_URL in .env (default: http://localhost:3001).

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
INPUT="${1:-resume-update.json}"

node "$ROOT/scripts/update-resume.js" "$INPUT"
