// API service for communicating with Google Apps Script
const API_BASE = '/api';

export const apiService = {
  // Save card data
  async saveCard(cardData) {
    try {      
      // Wrap data in the format GAS expects: {data: {...}}
      const requestPayload = {
        data: cardData
      };
      
      const response = await fetch(`${API_BASE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.log('Error saving card:', error);
      throw error;
    }
  },

  // Get card data by wishing code only (load first)
  async getCardByCode(wishingCode) {
    try {
      const gqlQuery = `SELECT * WHERE B = '${wishingCode}' LIMIT 1`;
      const encodedQuery = encodeURIComponent(gqlQuery);
      
      const response = await fetch(`${API_BASE}?key=${import.meta.env.VITE_SECRET_KEY || 'default_key'}&query=${encodedQuery}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error getting card by code:', error);
      throw error;
    }
  },

  // Get card data by wishing code and key (legacy method)
  async getCard(wishingCode, key) {
    try {
      const gqlQuery = `SELECT * WHERE B = '${wishingCode}' AND C = '${key}' LIMIT 1`;
      const encodedQuery = encodeURIComponent(gqlQuery);
      
      const response = await fetch(`${API_BASE}?key=${import.meta.env.VITE_SECRET_KEY || 'default_key'}&query=${encodedQuery}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error getting card:', error);
      throw error;
    }
  }
};
