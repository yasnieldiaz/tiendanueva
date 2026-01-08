"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  ImageIcon,
  Loader2,
  AlertCircle,
  Plus,
} from "lucide-react";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  className?: string;
}

export default function ImageUpload({
  value = [],
  onChange,
  maxImages = 5,
  className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const remainingSlots = maxImages - value.length;
      if (remainingSlots <= 0) {
        setError(`Máximo ${maxImages} imágenes permitidas`);
        return;
      }

      const filesToUpload = Array.from(files).slice(0, remainingSlots);
      setError(null);
      setUploading(true);

      try {
        const uploadPromises = filesToUpload.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Upload failed");
          }

          const data = await res.json();
          return data.url;
        });

        const newUrls = await Promise.all(uploadPromises);
        onChange([...value, ...newUrls]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al subir imagen");
      } finally {
        setUploading(false);
      }
    },
    [value, onChange, maxImages]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const removeImage = useCallback(
    async (index: number) => {
      const urlToRemove = value[index];
      const newUrls = value.filter((_, i) => i !== index);
      onChange(newUrls);

      // Try to delete from server (optional, don't fail if it doesn't work)
      try {
        const filename = urlToRemove.split("/").pop();
        if (filename) {
          await fetch(`/api/upload?filename=${filename}`, {
            method: "DELETE",
          });
        }
      } catch {
        // Ignore delete errors
      }
    },
    [value, onChange]
  );

  const moveImage = useCallback(
    (from: number, to: number) => {
      if (to < 0 || to >= value.length) return;
      const newUrls = [...value];
      const [removed] = newUrls.splice(from, 1);
      newUrls.splice(to, 0, removed);
      onChange(newUrls);
    },
    [value, onChange]
  );

  return (
    <div className={className}>
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-auto p-1 hover:bg-red-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
          {value.map((url, index) => (
            <motion.div
              key={url}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative aspect-square bg-neutral-100 rounded-xl overflow-hidden group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Imagen ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index > 0 && (
                  <button
                    onClick={() => moveImage(index, index - 1)}
                    className="p-2 bg-white rounded-lg hover:bg-neutral-100 text-neutral-900 text-xs font-medium"
                  >
                    ←
                  </button>
                )}
                <button
                  onClick={() => removeImage(index)}
                  className="p-2 bg-red-500 rounded-lg hover:bg-red-600 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
                {index < value.length - 1 && (
                  <button
                    onClick={() => moveImage(index, index + 1)}
                    className="p-2 bg-white rounded-lg hover:bg-neutral-100 text-neutral-900 text-xs font-medium"
                  >
                    →
                  </button>
                )}
              </div>

              {/* Position badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-neutral-900 text-white text-xs font-medium rounded">
                  Principal
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {value.length < maxImages && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
            ${
              dragOver
                ? "border-neutral-900 bg-neutral-100"
                : "border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50"
            }
            ${uploading ? "pointer-events-none opacity-60" : ""}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-neutral-400 animate-spin" />
              <p className="text-neutral-600">Subiendo imagen...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              {value.length === 0 ? (
                <>
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-neutral-900 font-medium">
                      Arrastra imágenes aquí
                    </p>
                    <p className="text-neutral-500 text-sm mt-1">
                      o haz clic para seleccionar
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center">
                    <Plus className="w-6 h-6 text-neutral-400" />
                  </div>
                  <p className="text-neutral-600 text-sm">
                    Añadir más imágenes ({value.length}/{maxImages})
                  </p>
                </>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Upload className="w-4 h-4 text-neutral-400" />
                <span className="text-xs text-neutral-400">
                  JPG, PNG, WebP, GIF • Máx 10MB
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Helper text */}
      <p className="text-xs text-neutral-500 mt-2">
        La primera imagen será la imagen principal del producto.
        Puedes reordenar las imágenes arrastrándolas.
      </p>
    </div>
  );
}
