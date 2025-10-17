import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Seed route working' });
}

export async function POST() {
  return NextResponse.json({ message: 'Seed POST working' });
}