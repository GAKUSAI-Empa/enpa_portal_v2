'use client';

import { IconAlertCircle, IconLoader2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import useTool10API from '../tool106_api/useTool10API';

interface S3ImageProps {
  jobId: string;
  filename: string;
  className?: string;
  alt: string;
}

export function S3Image({ jobId, filename, className, alt }: S3ImageProps) {
  const api = useTool10API();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    let isMounted = true;
    const fetchUrl = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const s3Url = await api.fetchImagePresignedUrl(jobId, filename);
        if (isMounted) {
          setImageUrl(s3Url + `&t=${Date.now()}`);
        }
      } catch (error) {
        console.error(`Lỗi khi tải S3 URL cho ${filename}:`, error);
        if (isMounted) {
          setIsError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUrl();

    return () => {
      isMounted = false;
    };
  }, [jobId, filename, api]);

  const containerClasses = `flex items-center justify-center bg-gray-100 rounded ${className || 'w-40 h-40'}`;

  if (isLoading) {
    return (
      <div className={containerClasses}>
        <IconLoader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (isError || !imageUrl) {
    return (
      <div
        className={`${containerClasses} bg-red-50`}
        title={`Presigned URLの取得に失敗しました: ${filename}`}
      >
        <IconAlertCircle className="text-red-400" />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={`max-w-full max-h-full object-contain rounded ${className || 'w-40 h-40'}`}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null;
        target.src = '/img/placeholder_error.png';
        target.title = `S3から画像のロードに失敗しました: ${filename}`;
      }}
    />
  );
}
