import imageCompression from 'browser-image-compression'
import api from '@/lib/api'
import { getMediaUrl } from '@/lib/utils'

export interface UploadedImage {
    path: string
    src: string
    alt: string
}

/**
 * Compress → upload → resolve the storage URL. Shared by the editor's
 * toolbar image insert and the hover "Replace image" control on image
 * blocks, so both paths behave identically.
 */
export const uploadImageFile = async (file: File): Promise<UploadedImage> => {
    const compressed = await imageCompression(file, {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: file.type,
    })

    const formData = new FormData()
    formData.append('file', compressed, file.name)

    const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })

    return {
        path: response.data.path,
        src: getMediaUrl(response.data.path),
        alt: file.name,
    }
}

/** User-facing message for a failed upload. */
export const uploadErrorMessage = (err: any): string =>
    err?.response?.data?.message || 'Could not upload image. Please try again.'
