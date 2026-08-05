#!/bin/bash
# 一键部署：Obsidian Public 库 → Quartz 构建 → GitHub Pages
# 用法：bash ~/Data/quartz-site/deploy.sh
set -e

SITE=~/Data/quartz-site
PUBLIC_DIR=~/Data/obsidian-vaults/Public
GH_PAGES=~/Data/quartz-gh-pages
URL=https://kingselyly.github.io/quartz-site/

echo "① 构建网站（从 Public 库）..."
cd "$SITE"
npx quartz build -d "$PUBLIC_DIR" 2>&1 | grep -E "Found|Parsed|Emitted|Error" || true

echo "② 同步到 gh-pages 分支..."
cd "$GH_PAGES"
git rm -rf . -q 2>/dev/null || true
cp -r "$SITE"/public/* .
git add -A
git commit -m "deploy: $(date +%Y-%m-%d_%H:%M)" -q
git push -q

echo "✅ 部署完成：$URL（约 1-2 分钟生效）"
