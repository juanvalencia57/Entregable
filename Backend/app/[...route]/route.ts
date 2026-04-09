import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(request: NextRequest) {
  const { pathname } = request.nextUrl

  try {
    // Determine file path
    let filePath = join(process.cwd(), 'public/app', pathname === '/' ? 'index.html' : pathname)

    // Try exact file first
    try {
      const file = readFileSync(filePath)
      const contentType = getContentType(filePath)
      return new NextResponse(file, {
        headers: { 'Content-Type': contentType },
      })
    } catch {
      // If file not found and it's not a dot file, try index.html (for SPA routing)
      if (!pathname.includes('.')) {
        filePath = join(process.cwd(), 'public/app/index.html')
        const file = readFileSync(filePath)
        return new NextResponse(file, {
          headers: { 'Content-Type': 'text/html' },
        })
      }
      throw new Error('File not found')
    }
  } catch (error) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}

function getContentType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase()
  const mimeTypes: Record<string, string> = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    json: 'application/json',
    svg: 'image/svg+xml',
    png: 'image/png',
    jpg: 'image/jpeg',
    gif: 'image/gif',
    woff: 'font/woff',
    woff2: 'font/woff2',
  }
  return mimeTypes[ext || ''] || 'application/octet-stream'
}
