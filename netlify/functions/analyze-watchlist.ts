import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  try {
    // Import the Next.js API route logic
    // We use the deployed URL or fallback to localhost for testing
    // Note: process.env.URL works in Netlify production
    const baseUrl = process.env.URL || 'http://localhost:3000';
    
    // We need to pass the shared secret to authorize the request
    const secret = process.env.CRON_SECRET;
    
    if (!secret) {
      console.error('CRON_SECRET is not defined');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Configuration error' })
      };
    }

    console.log(`Triggering analysis job at ${baseUrl}/api/analyze-watchlist`);

    const response = await fetch(`${baseUrl}/api/analyze-watchlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secret}`
      }
    });

    const data = await response.json();
    console.log('Analysis job result:', data);

    return {
      statusCode: response.status,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Netlify function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
