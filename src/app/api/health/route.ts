import type { NextResponse } from 'next'

export async function GET(): Promise<NextResponse> {
  return Response.json({ status: 'ok' }, { status: 200 })
}
