export async function GET() {
  const adsContent = `google.com, pub-6031925946912275, DIRECT, f08c47fec0942fa0`;
  
  return new Response(adsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}