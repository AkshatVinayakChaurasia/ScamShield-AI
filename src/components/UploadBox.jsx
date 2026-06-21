"use client";

import { useState, useRef, useCallback } from "react";
import { ImageUp, X } from "lucide-react";
import { validateScreenshotFile } from "@/utils/validators";

/**
 * Drag-and-drop / click-to-browse upload box for screenshots.
 * Owns file selection + preview only — the parent page owns the
 * "Analyze" action and API call, kept separate so this component
 * stays reusable if other upload flows are added later.
 *
 * @param {(file: File|null) => void} onFileSelected - called with the
 *   selected File, or null if cleared/invalid.
 */
export default function UploadBox({ onFileSelected }) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFile = useCallback(
    (file) => {
      const { valid, error: validationError } = validateScreenshotFile(file);

      if (!valid) {
        setError(validationError);
        setPreviewUrl(null);
        setFileName("");
        onFileSelected?.(null);
        return;
      }

      setError("");
      setFileName(file.name);
      setPreviewUrl(URL.createObjectURL(file));
      onFileSelected?.(file);
    },
    [onFileSelected]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleClear = useCallback(
    (e) => {
      e.stopPropagation();
      setPreviewUrl(null);
      setFileName("");
      setError("");
      if (inputRef.current) inputRef.current.value = "";
      onFileSelected?.(null);
    },
    [onFileSelected]
  );

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal ${
          isDragging
            ? "border-signal bg-ink-raised"
            : "border-wire hover:border-wire-soft hover:bg-ink-raised/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        {previewUrl ? (
          <div className="relative w-full max-w-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Selected screenshot preview"
              className="max-h-64 w-full rounded-md border border-wire object-contain"
            />
            <button
              type="button"
              onClick={handleClear}
              aria-label="Remove selected image"
              className="absolute -right-2 -top-2 rounded-full bg-ink p-1.5 text-paper ring-1 ring-wire hover:bg-alarm/20 hover:text-alarm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="mt-2 truncate font-mono text-xs text-text-muted">
              {fileName}
            </p>
          </div>
        ) : (
          <>
            <ImageUp className="h-8 w-8 text-text-muted" strokeWidth={1.5} />
            <p className="mt-3 text-sm font-medium text-paper">
              Drag and drop a screenshot, or click to browse
            </p>
            <p className="mt-1 font-mono text-xs text-text-muted">
              PNG, JPG, or WEBP · up to 8MB
            </p>
          </>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-alarm">{error}</p>}
    </div>
  );
}
