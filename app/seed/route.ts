import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Seed route working',
    status: 'Database not configured yet'
  });
}

export async function POST() {
  return NextResponse.json({ 
    message: 'Seed POST working',
    status: 'Database not configured yet'
  });
}