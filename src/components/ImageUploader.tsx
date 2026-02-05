import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface ImageUploaderProps {
  onUpload: (url: string) => void;
}

const ImageUploader = ({ onUpload }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    setError('');

    if (!file.type.startsWith('image/')) {
      setError('Solo se aceptan imágenes (JPEG, PNG, GIF, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar 5 MB');
      return;
    }

    // Preview local
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${BACKEND_URL}/api/upload/image`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error al subir imagen');
      }

      onUpload(data.data.url);
      setPreview(null);
    } catch (err: any) {
      setError(err.message || 'Error al subir imagen');
      setPreview(null);
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(localUrl);
    }
  }, [onUpload]);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      {/* Zona de arrastrar */}
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 transition-colors cursor-pointer ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
        }`}
      >
        {isUploading ? (
          <>
            {preview && (
              <img src={preview} alt="Preview" className="h-16 w-16 rounded-lg object-cover opacity-50" />
            )}
            <span className="material-symbols-outlined text-3xl text-gray-400 animate-spin">progress_activity</span>
            <p className="text-sm text-gray-500">Subiendo imagen...</p>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-4xl text-gray-300">image</span>
            <p className="text-sm text-gray-500">No hay imagen seleccionada</p>
            <p className="text-xs text-gray-400">Arrastra y suelta una imagen aquí</p>
          </>
        )}
      </div>

      {/* Input file */}
      <div className="space-y-2">
        <p className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
          <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
          Subir nueva imagen
        </p>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            disabled={isUploading}
            className="w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border file:border-gray-200 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-gray-600 hover:file:bg-gray-50 disabled:opacity-50"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default ImageUploader;
