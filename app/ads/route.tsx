export async function GET() {
  return new Response(
    'google.com, ca-pub-6031925946912275, DIRECT, f08c47fec0942fa0',
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    }
  );
}