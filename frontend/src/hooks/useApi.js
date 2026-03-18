import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * A React Hook for standard GET requests to the backend API.
 * Automatically injects the Supabase JWT Authorization header.
 * 
 * @param {string} endpoint The API route (e.g., "/matches")
 * @returns {object} { data, error, loading, refetch }
 */
export function useApi(endpoint) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!endpoint) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      const headers = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error(`Failed to fetch ${endpoint}:`, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading, refetch: fetchData };
}

/**
 * A utility function for mutations (POST, PUT, DELETE) to the backend API.
 * Automatically injects the Supabase JWT Authorization header.
 * 
 * @param {string} endpoint The API route (e.g., "/polls/vote")
 * @param {object} options Fetch options object (method, body, etc.)
 */
export const fetchApi = async (endpoint, options = {}) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers = { 
    'Content-Type': 'application/json',
    ...options.headers 
  };
  
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    throw new Error(`API Request Failed: ${response.status}`);
  }
  
  return response.json();
};
