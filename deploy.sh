#!/bin/bash
set -e

echo "🚀 Deploying LawGuide AI Production Stack..."

# 1. Pull the latest code (Assuming Git is configured)
echo "📦 Pulling latest code..."
git pull origin main

# 2. Rebuild the frontend and API routes inside Docker
echo "🔨 Building Docker containers..."
docker-compose -f docker-compose.prod.yml build --no-cache

# 3. Spin down old containers and boot the new ones
echo "🔄 Rebooting infrastructure (Zero downtime if using replicas, otherwise minor interruption)..."
docker-compose -f docker-compose.prod.yml up -d

# 4. Prune old dangling images to save disk space
echo "🧹 Cleaning up old Docker images..."
docker image prune -f

echo "✅ LawGuide AI is now LIVE and deployed!"
