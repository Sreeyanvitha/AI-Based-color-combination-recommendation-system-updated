#!/bin/bash
echo "🎨 Starting Outfit Color Studio Frontend..."
cd "$(dirname "$0")"

if [ ! -d "node_modules" ]; then
  echo "📦 Installing npm dependencies..."
  npm install
fi

echo "🚀 Frontend running at http://localhost:3000"
npm run dev
