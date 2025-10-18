import { useState, useEffect } from 'react';

export function useURLParams() {
  const [params, setParams] = useState({
    wishingCode: null
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    // Support both 'code' and 'wishing_code' for backward compatibility
    const wishingCode = urlParams.get('code') || urlParams.get('wishing_code');
    
    setParams({
      wishingCode
    });
  }, []);

  return params;
}
