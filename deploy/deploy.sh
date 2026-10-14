#!/usr/bin/env bash
# Deploy farvees.xyz: pull, patch nginx, install nginx config, build, (re)start pm2.
# Run from anywhere on the server: ./deploy/deploy.sh
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE="farvees.xyz"
PM2_NAME="farvees"

cd "$APP_DIR"

echo "==> git pull"
git pull --ff-only

echo "==> upgrade nginx to the latest packaged (patched) release"
sudo apt-get update -qq
sudo apt-get install -y --only-upgrade nginx

echo "==> nginx config"
sudo cp "deploy/$SITE" "/etc/nginx/sites-available/$SITE"
sudo ln -sf "/etc/nginx/sites-available/$SITE" "/etc/nginx/sites-enabled/$SITE"
sudo nginx -t
sudo systemctl reload nginx

echo "==> install + build"
npm ci
npm run build

echo "==> pm2 ($PM2_NAME)"
if pm2 describe "$PM2_NAME" >/dev/null 2>&1; then
  pm2 restart "$PM2_NAME" --update-env
else
  pm2 start npm --name "$PM2_NAME" -- start
fi
pm2 save

echo "==> deployed"
