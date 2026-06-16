<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $file = $request->file('file');
        if (!$file) {
            return response()->json(['message' => 'No file uploaded'], 400);
        }

        $mime = $file->getClientMimeType();
        $isVid = str_starts_with($mime, 'video/') || $file->getClientOriginalExtension() === 'mp4';
        
        // Allow up to 20MB for videos, 10MB for other formats (images, PDFs)
        $maxSize = $isVid ? '20480' : '10240';

        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,webp,svg,mp4,gif,pdf|max:' . $maxSize,
        ]);

        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();
        
        $slugifiedName = \Illuminate\Support\Str::slug($originalName);
        if (empty($slugifiedName)) {
            $slugifiedName = 'file-' . uniqid();
        }
        
        $filename = $slugifiedName . '.' . $extension;
        
        // Ensure unique filename on disk
        $count = 1;
        while (Storage::disk('public')->exists('uploads/' . $filename)) {
            $filename = $slugifiedName . '-' . $count . '.' . $extension;
            $count++;
        }

        $path = $file->storeAs('uploads', $filename, 'public');

        // Optimize image in-place if it is an image format we can parse
        $this->optimizeImage($path);

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('public');
        $actualSize = $disk->size($path);

        return response()->json([
            'url' => $disk->url($path),
            'path' => $path,
            'filename' => $file->getClientOriginalName(),
            'size' => $actualSize,
            'mime' => $file->getClientMimeType(),
        ], 201);
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        if (Storage::disk('public')->exists($request->path)) {
            Storage::disk('public')->delete($request->path);
            return response()->json(['message' => 'File deleted'], 200);
        }

        return response()->json(['message' => 'File not found'], 404);
    }

    public function serve(string $path)
    {
        if (!Storage::disk('public')->exists($path)) {
            abort(404);
        }

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('public');
        $file = $disk->get($path);
        $mime = $disk->mimeType($path);

        return response($file, 200)
            ->header('Content-Type', $mime)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    }

    private function optimizeImage(string $path)
    {
        $fullPath = storage_path('app/public/' . $path);
        if (!file_exists($fullPath)) {
            return;
        }

        $info = @getimagesize($fullPath);
        if (!$info) {
            return;
        }

        $mime = $info['mime'];

        // Only optimize JPEG, PNG, and WebP using GD library
        if (!in_array($mime, ['image/jpeg', 'image/png', 'image/webp'])) {
            return;
        }

        if (!extension_loaded('gd')) {
            return;
        }

        // Create image resource from file
        switch ($mime) {
            case 'image/jpeg':
                $image = @imagecreatefromjpeg($fullPath);
                break;
            case 'image/png':
                $image = @imagecreatefrompng($fullPath);
                if ($image) {
                    imagealphablending($image, false);
                    imagesavealpha($image, true);
                }
                break;
            case 'image/webp':
                $image = @imagecreatefromwebp($fullPath);
                break;
            default:
                return;
        }

        if (!$image) {
            return;
        }

        // Check dimensions and resize if width or height exceeds 1920px
        $width = imagesx($image);
        $height = imagesy($image);
        $maxDimension = 1920;

        if ($width > $maxDimension || $height > $maxDimension) {
            if ($width > $height) {
                $newWidth = $maxDimension;
                $newHeight = (int)($height * ($maxDimension / $width));
            } else {
                $newHeight = $maxDimension;
                $newWidth = (int)($width * ($maxDimension / $height));
            }

            $resizedImage = imagecreatetruecolor($newWidth, $newHeight);
            if ($mime === 'image/png') {
                imagealphablending($resizedImage, false);
                imagesavealpha($resizedImage, true);
            }
            imagecopyresampled($resizedImage, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
            imagedestroy($image);
            $image = $resizedImage;
        }

        // Save image back in-place with optimal compression
        switch ($mime) {
            case 'image/jpeg':
                imagejpeg($image, $fullPath, 75); // 75% quality
                break;
            case 'image/png':
                imagepng($image, $fullPath, 7); // compression level 7
                break;
            case 'image/webp':
                imagewebp($image, $fullPath, 80); // 80% quality
                break;
        }

        imagedestroy($image);

        // Clear PHP stat cache so Laravel returns the correct updated file size
        clearstatcache(true, $fullPath);
    }
}
