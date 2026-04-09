#!/bin/bash
set -e

# Build and start the Next.js application
npm install
npm run build
npm run start
