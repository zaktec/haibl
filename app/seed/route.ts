export async function GET() {
  return Response.json({ message: 'Seed route working' });
}

export async function POST() {
  return Response.json({ message: 'Seed POST working' });
}