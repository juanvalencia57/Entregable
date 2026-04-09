import { readFileSync } from 'fs'
import { join } from 'path'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ route: string[] }> }) {
  const { route } = await params
  const routePath = route.join('/')

  try {
    // Try exact file path first
    let filePath = join(process.cwd(), 'public/app', routePath === '' ? 'index.html' : routePath)

    try {
      const file = readFileSync(filePath)
      const contentType = getContentType(filePath)
      return new NextResponse(file, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600',
        },
      })
    } catch {
      // If not found and no extension, try index.html (SPA routing)
      if (!routePath.includes('.')) {
        filePath = join(process.cwd(), 'public/app/index.html')
        const file = readFileSync(filePath)
        return new NextResponse(file, {
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'public, max-age=0',
          },
        })
      }
      throw new Error('File not found')
    }
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}

function getContentType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase() || ''
  const mimeTypes: Record<string, string> = {
    html: 'text/html; charset=utf-8',
    css: 'text/css',
    js: 'application/javascript',
    mjs: 'application/javascript',
    json: 'application/json',
    svg: 'image/svg+xml',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    ico: 'image/x-icon',
    woff: 'font/woff',
    woff2: 'font/woff2',
    ttf: 'font/ttf',
    eot: 'application/vnd.ms-fontobject',
  }
  return mimeTypes[ext] || 'application/octet-stream'
}
