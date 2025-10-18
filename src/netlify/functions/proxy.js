import fetch from 'node-fetch';

export const handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { httpMethod, body, queryStringParameters } = event;
    const targetUrl = `https://script.google.com/macros/s/AKfycbzoPppn3AMcg4JqQ01_HCCarFS9swPUKWIHKWW6U_fh-2SuWHaW7RVvUidhlAe2PMia0g/exec`;
    
    // Thêm query parameters nếu có
    const urlWithParams = queryStringParameters 
      ? `${targetUrl}?${new URLSearchParams(queryStringParameters).toString()}`
      : targetUrl;
    
    const response = await fetch(urlWithParams, {
      method: httpMethod,
      body: httpMethod === 'POST' ? body : undefined,
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow'
    });

    const data = await response.text();
    
    return {
      statusCode: 200,
      headers,
      body: data
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};