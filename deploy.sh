#!/bin/bash
set -e

REPO_DIR="/home/ubuntu/portfolio"
BRANCH="main"
SERVICE_NAME="react-app"

echo "==> Deploy started at $(date)"
echo "==> Repo: $REPO_DIR (branch: $BRANCH)"
echo "==> Service: $SERVICE_NAME"

cd "$REPO_DIR"

echo "==> Updating code..."
git fetch origin
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"

echo "==> Installing frontend dependencies..."
npm ci

echo "==> Building frontend..."
npm run build

echo "==> Installing backend dependencies..."
cd server
npm ci
cd ..

echo "==> Running migrations (safe, never overwrites existing content)..."
npm run migrate

echo "==> Restarting service..."
sudo systemctl restart "$SERVICE_NAME"
sudo systemctl status "$SERVICE_NAME" --no-pager

echo "==> Deploy finished at $(date)"
