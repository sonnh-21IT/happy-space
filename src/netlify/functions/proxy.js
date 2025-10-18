// Netlify Function không cần import fetch - đã có sẵn global fetch
exports.handler = async (event, context) => {
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
    
    // Thêm query parameters nếu có (bao gồm cả key parameter)
    const urlWithParams = queryStringParameters 
      ? `${targetUrl}?${new URLSearchParams(queryStringParameters).toString()}`
      : targetUrl;
    
    console.log('Proxy request:', httpMethod, urlWithParams);
    
    const response = await fetch(urlWithParams, {
      method: httpMethod,
      body: httpMethod === 'POST' ? body : undefined,
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow'
    });

    const data = await response.text();
    console.log('Proxy response status:', response.status);
    
    return {
      statusCode: response.status,
      headers,
      body: data
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false,
        error: error.message,
        stack: error.stack 
      })
    };
  }
};