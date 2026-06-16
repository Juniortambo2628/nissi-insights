"use client"

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2, FileText, Download } from 'lucide-react'
import api from '@/lib/api'
import { getMediaUrl } from '@/lib/utils'

interface FileUploaderProps {
    value?: string
    onChange: (url: string) => void
    accept?: string[]
    maxSizeMB?: number
    label?: string
    className?: string
}

const FileUploader = ({ 
    value, 
    onChange, 
    accept = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'], 
    maxSizeMB = 10, 
    label = 'Upload Document', 
    className 
}: FileUploaderProps) => {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        setError(null)
        setIsUploading(true)
        setUploadProgress(0)

        try {
            const formData = new FormData()
            formData.append('file', file, file.name)

            const response = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent: any) => {
                    const pct = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
                    setUploadProgress(pct)
                },
            })

            setUploadProgress(100)
            onChange(response.data.path)
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Upload failed. Please try again.')
        } finally {
            setIsUploading(false)
        }
    }, [onChange])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: accept.reduce((acc: any, type: string) => {
            const mimeMap: Record<string, string> = {
                '.pdf': 'application/pdf',
                '.doc': 'application/msword',
                '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                '.xls': 'application/vnd.ms-excel',
                '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                '.ppt': 'application/vnd.ms-powerpoint',
                '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                '.txt': 'text/plain',
            }
            const mime = mimeMap[type]
            if (mime) acc[mime] = [type]
            return acc
        }, {}),
        maxFiles: 1,
        disabled: isUploading,
    })

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        onChange('')
    }

    const getFilename = (path?: string) => {
        if (!path) return ''
        const parts = path.split('/')
        return parts[parts.length - 1]
    }

    return (
        <div className={className}>
            {label && <label className="text-sm font-semibold text-foreground/80 mb-2 block">{label}</label>}

            <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-lg transition-all cursor-pointer overflow-hidden ${
                    isDragActive
                        ? 'border-primary bg-primary/5'
                        : error
                            ? 'border-destructive/50 bg-destructive/5'
                            : 'border-border/50 hover:border-primary/50 bg-secondary/5'
                }`}
            >
                <input {...getInputProps()} />

                {value ? (
                    <div className="relative group">
                        <div className="h-32 flex flex-col items-center justify-center bg-black/5">
                            <FileText className="h-10 w-10 text-primary mb-2" />
                            <span className="text-sm text-foreground font-medium truncate max-w-[80%] px-4">
                                {getFilename(value)}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-1 bg-secondary/50 px-2 py-0.5 rounded">
                                Document Attached
                            </span>
                        </div>
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                            {value && (
                                <a
                                    href={getMediaUrl(value)}
                                    download
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-1.5 bg-primary rounded-full text-white hover:bg-primary/80"
                                    title="Download File"
                                >
                                    <Download className="h-4 w-4" />
                                </a>
                            )}
                            <span className="text-white text-sm font-medium">Replace File</span>
                            <button
                                onClick={handleClear}
                                className="p-1.5 bg-destructive rounded-full text-white hover:bg-destructive/80"
                                title="Remove File"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 px-4">
                        {isUploading ? (
                            <>
                                <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
                                <div className="w-full max-w-[200px] h-1.5 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <span className="text-xs text-muted-foreground mt-2">{uploadProgress}%</span>
                            </>
                        ) : (
                            <>
                                <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                                <p className="text-sm text-muted-foreground text-center">
                                    <span className="font-semibold text-foreground">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    PDF, DOCX, XLSX, PPTX (max {maxSizeMB}MB)
                                </p>
                            </>
                        )}
                    </div>
                )}
            </div>

            {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
        </div>
    )
}

export default FileUploader
