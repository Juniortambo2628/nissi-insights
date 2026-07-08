import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMediaUrl(path: string | undefined | null) {
  if (!path) return ''
  
  // If it's already a full URL, return it
  if (path.startsWith('http') || path.startsWith('data:')) return path
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
  
  // Normalize path by removing leading slash for checking prefixes
    const cleanPath = path.startsWith('/') ? path.substring(1) : path
  
  // If it's a local public asset (starts with assets/, logos/, or NI-Digital-Assets/)
  if (cleanPath.startsWith('assets/') || cleanPath.startsWith('logos/') || cleanPath.startsWith('NI-Digital-Assets/')) {
    // Ensure it starts with / for Next.js Image component
    return path.startsWith('/') ? path : `/${path}`
  }

  // If it's explicitly marked as storage path
  if (cleanPath.startsWith('storage/')) {
    // Some implementations might save path as 'storage/uploads/...'
    // Our backend route is /api/storage/{path}, so we pass the part after /api/storage/
    const subPath = cleanPath.replace('storage/', '')
    return `${baseUrl}/storage/${subPath}`
  }
  
  // If it starts with uploads/ or files/, it's meant for the backend storage
  if (cleanPath.startsWith('uploads/') || cleanPath.startsWith('files/')) {
    return `${baseUrl}/storage/${cleanPath}`
  }

  // If the path starts with / but didn't match local assets, it might be a root-relative local asset
  if (path.startsWith('/')) {
    return path
  }

  // Fallback: assume it's an uploaded file in the 'uploads' directory
  // (e.g. if setting is just 'filename.png')
  return `${baseUrl}/storage/uploads/${cleanPath}`
}
