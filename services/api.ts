import { create } from 'axios';

const API_BASE_URL = 'https://6a096fb3e7e3f433d4831574.mockapi.io';

export const api = create({
  baseURL: API_BASE_URL,
  headers: { 
    'Content-Type': 'application/json',
  },
});