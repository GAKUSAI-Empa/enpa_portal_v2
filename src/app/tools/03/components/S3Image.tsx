// src/app/tools/03/components/S3Image.tsx
'use client';

import React, { useState, useEffect } from 'react';
// (Import thêm IconAlertCircle để báo lỗi)
import { IconLoader2, IconAlertCircle } from '@tabler/icons-react';
// === SỬA LỖI IMPORT ===
// Đổi từ đường dẫn tương đối ('../api/tool03API')
// sang đường dẫn tuyệt đối (alias '@') dựa trên cấu trúc dự án
import { tool03API } from '@/app/tools/03/api/tool03API'; // Import API
// === KẾT THÚC SỬA LỖI ===

interface S3ImageProps {
  jobId: string;
  filename: string;
  className?: string; // (Để tùy chỉnh style)
  alt: string;
}

/**
 * Component này tự động:
 * 1. Gọi API Backend (hàm fetchImagePresignedUrl) để lấy S3 Presigned URL.
 * 2. Hiển thị spinner (loading).
 * 3. Hiển thị ảnh (<img>) khi có URL S3.
 * 4. Hiển thị icon lỗi nếu không lấy được URL.
 */
export function S3Image({ jobId, filename, className, alt }: S3ImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false); // (Thêm state báo lỗi)

  useEffect(() => {
    let isMounted = true; // (Tránh memory leak)

    const fetchUrl = async () => {
      setIsLoading(true);
      setIsError(false); // (Reset lỗi)
      try {
        // *** (SỬA ĐỔI QUAN TRỌNG: Gọi hàm API mới) ***
        // Gọi hàm API mới (fetchImagePresignedUrl) để lấy S3 URL
        const s3Url = await tool03API.fetchImagePresignedUrl(jobId, filename);
        if (isMounted) {
          // Gắn thêm tham số timestamp để tránh lỗi cache nếu có
          setImageUrl(s3Url + `&t=${Date.now()}`);
        }
      } catch (error) {
        console.error(`Lỗi khi tải S3 URL cho ${filename}:`, error);
        if (isMounted) {
          setIsError(true); // (Set cờ lỗi)
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
  }, [jobId, filename]); // (Chạy lại khi jobId hoặc filename thay đổi)

  // (Lấy class CSS từ PreviewModal để đồng bộ kích thước)
  const containerClasses = `flex items-center justify-center bg-gray-100 rounded ${className || 'w-40 h-40'}`;

  // (Trạng thái Loading)
  if (isLoading) {
    return (
      <div className={containerClasses}>
        <IconLoader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  // (Trạng thái Lỗi - không lấy được S3 URL)
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

  // (Trạng thái Thành công - Đã có S3 URL)
  return (
    <img
      src={imageUrl}
      alt={alt}
      // (Đảm bảo class khớp với container, sử dụng object-contain để ảnh không bị méo)
      className={`max-w-full max-h-full object-contain rounded ${className || 'w-40 h-40'}`}
      onError={(e) => {
        // Fallback: Nếu ảnh không tải được từ S3 URL (dù URL đã có), hiển thị lỗi.
        const target = e.target as HTMLImageElement;
        target.onerror = null; // Ngăn chặn vòng lặp
        target.src = '/img/placeholder_error.png'; // Sử dụng placeholder cục bộ nếu cần
        target.title = `S3から画像のロードに失敗しました: ${filename}`;
      }}
    />
  );
}
