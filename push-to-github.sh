#!/bin/bash
# BunyanHome B2B - GitHub 推送脚本
# 使用方法: 在 bunyanhome-b2b 目录下运行 bash push-to-github.sh

set -e

REPO_URL="https://github.com/lizhiyong52999/bunyanhome.git"

cd "$(dirname "$0")"

# Initialize git if needed
if [ ! -d .git ]; then
    git init
    git config user.email "531514342@qq.com"
    git config user.name "lizhiyong"
fi

# Set remote
git remote get-url origin 2>/dev/null || git remote add origin "$REPO_URL"
git remote set-url origin "$REPO_URL"

# Commit all changes
git add -A
git commit -m "feat: B2B多语言Hugo独立站" 2>/dev/null || echo "No changes to commit"

# Push
git branch -M main
git push -u origin main --force

echo "✓ 推送完成！请访问 https://github.com/lizhiyong52999/bunyanhome 查看"
