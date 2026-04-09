#!/bin/bash
set -e

echo "Building Frontend..."
cd Frontend
npm install
npm run build
cd ..

echo "Copying Frontend build to Backend public folder..."
rm -rf Backend/public/frontend-dist 2>/dev/null || true
mkdir -p Backend/public/frontend-dist
cp -r Frontend/dist/* Backend/public/frontend-dist/

echo "Building Backend..."
cd Backend
npm install
npm run build
cd ..

echo "✅ Build complete!"
