import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// Add a request interceptor to ensure the token is always up to date
api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

export const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nissi-insights.com';
export const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function fetchEntity<T = Record<string, unknown>>(slug: string, endpoint: string): Promise<T | null> {
    try {
        const res = await fetch(`${apiUrl}/${endpoint}/${slug}`, { next: { revalidate: 60 } });
        if (res.ok) {
            return await res.json() as T;
        }
    } catch (error) {
        console.error(`Error fetching ${endpoint} on server:`, error);
    }
    return null;
}
