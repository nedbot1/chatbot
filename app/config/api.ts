import { Capacitor } from '@capacitor/core';

// API configuration for different environments
export const getApiUrl = (endpoint: string): string => {
  // Check if running in Capacitor (mobile app) using the official method
  const isCapacitor = Capacitor.isNativePlatform();
  
  // Debug logging for mobile
  console.log('getApiUrl Debug:', {
    platform: Capacitor.getPlatform(),
    isNativePlatform: isCapacitor,
    isCapacitor,
  });
  
  if (isCapacitor) {
    // For mobile production, use your Vercel deployment
    const PRODUCTION_API_URL = 'https://chatbot-4sjt.vercel.app';
    
    // Uncomment the line below for local development instead
    // const DEV_SERVER_URL = 'http://192.168.1.239:3000';
    // return `${DEV_SERVER_URL}${endpoint}`;
    
    console.log('Using mobile API URL:', `${PRODUCTION_API_URL}${endpoint}`);
    return `${PRODUCTION_API_URL}${endpoint}`;
  }
  
  // For web development and production, use relative URLs
  console.log('Using relative URL:', endpoint);
  return endpoint;
};


