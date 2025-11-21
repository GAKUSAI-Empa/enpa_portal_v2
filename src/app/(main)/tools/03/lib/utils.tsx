// src/app/tools/03/lib/utils.ts
import React from 'react';
import type { ProductRow, BackendJobStatus, FtpUploadStatus } from '../types';
import { templates } from '../constants';
import {
  IconLoader2,
  IconCircleCheck,
  IconAlertCircle,
  IconX,
  IconCloudUpload,
  IconCloudCheck,
  IconCloudOff,
} from '@tabler/icons-react';

/**
 * Tạo một đối tượng ProductRow mới với giá trị mặc định.
 */
export const createNewProductRow = (idPrefix: string): ProductRow => ({
  id: `${idPrefix}-${Date.now()}`,
  productCode: '',
  template: templates[0]?.name || '',
  startDate: '',
  endDate: '',
  priceType: '当店通常価格',
  customPriceType: '',
  regularPrice: '',
  salePrice: '',
  saleText: '',
  discount: '',
  discountType: 'percent',
  mobileStartDate: '',
  mobileEndDate: '',
});

/**
 * Tính toán và định dạng chuỗi hiển thị giảm giá (%OFF hoặc 円OFF).
 */
export const calculateDiscountDisplay = (
  regularPriceStr: string,
  salePriceStr: string,
  type: 'percent' | 'yen' | '',
): string => {
  const regularPrice = parseFloat(regularPriceStr);
  const salePrice = parseFloat(salePriceStr);
  if (type && !isNaN(regularPrice) && !isNaN(salePrice) && regularPrice > salePrice) {
    if (type === 'percent') {
      if (regularPrice > 0) {
        const percentage = Math.round(((regularPrice - salePrice) / regularPrice) * 100);
        if (!isNaN(percentage)) return `${percentage}%OFF`;
      }
    } else {
      const difference = Math.round(regularPrice - salePrice);
      if (!isNaN(difference)) return `${difference.toLocaleString()}円OFF`;
    }
  }
  return '';
};

/**
 * Chuyển đổi chuỗi ngày tháng tiếng Nhật sang định dạng ISO (YYYY-MM-DDTHH:mm).
 */
export const parseJapaneseDate = (dateStr: string): string => {
  if (!dateStr || !dateStr.includes('月')) return '';
  const match = dateStr.match(/(\d{1,2})月(\d{1,2})日(\d{1,2}):(\d{1,2})/);
  if (!match) return '';

  const [, month, day, hour, minute] = match.map(Number);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const year = month < currentMonth ? currentYear + 1 : currentYear;

  const formattedMonth = String(month).padStart(2, '0');
  const formattedDay = String(day).padStart(2, '0');
  const formattedHour = String(hour).padStart(2, '0');
  const formattedMinute = String(minute).padStart(2, '0');

  return `${year}-${formattedMonth}-${formattedDay}T${formattedHour}:${formattedMinute}`;
};

/**
 * Trả về Icon tương ứng với trạng thái của Job.
 */
export const getJobStatusIcon = (
  status: BackendJobStatus['status'] | 'PENDING',
): React.ReactNode => {
  switch (status) {
    case 'PENDING':
      return <IconLoader2 className="h-5 w-5 text-gray-500" />;
    case 'Processing':
      return <IconLoader2 className="h-5 w-5 animate-spin text-blue-500" />;
    case 'RUNNING':
      return <IconLoader2 className="h-5 w-5 animate-spin text-blue-500" />;
    case 'COMPLETED':
      return <IconCircleCheck className="h-5 w-5 text-green-500" />;
    case 'COMPLETED_WITH_ERRORS':
      return <IconAlertCircle className="h-5 w-5 text-yellow-500" />;
    case 'FAILED':
      return <IconX className="h-5 w-5 text-red-500" />;
    default:
      return null;
  }
};

/**
 * Trả về Text mô tả trạng thái của Job (Tiếng Nhật).
 */
export const getJobStatusText = (status: BackendJobStatus['status'] | 'PENDING'): string => {
  switch (status) {
    case 'PENDING':
      return '待機中...';
    case 'Processing':
    case 'RUNNING':
      return '生成中...';
    case 'COMPLETED':
      return '完了';
    case 'COMPLETED_WITH_ERRORS':
      return '完了 (一部エラー)';
    case 'FAILED':
      return '失敗';
    default:
      return status || '不明';
  }
};

/**
 * Trả về Icon tương ứng với trạng thái Upload FTP.
 */
export const getFtpStatusIcon = (status?: FtpUploadStatus | 'idle'): React.ReactNode => {
  switch (status) {
    case 'UPLOADING':
      return <IconCloudUpload className="h-4 w-4 animate-pulse text-blue-500" />;
    case 'SUCCESS':
      return <IconCloudCheck className="h-4 w-4 text-green-500" />;
    case 'FAILED':
      return <IconCloudOff className="h-4 w-4 text-red-500" />;
    case 'IDLE':
    case 'idle':
    default:
      return null;
  }
};

/**
 * Trả về Text mô tả trạng thái Upload FTP (Tiếng Nhật).
 */
export const getFtpStatusText = (
  status?: FtpUploadStatus | 'idle',
  error?: string | null,
): string | null => {
  switch (status) {
    case 'UPLOADING':
      return 'アップロード中...';
    case 'SUCCESS':
      return '完了';
    case 'FAILED':
      return error ? `失敗: ${error}` : '失敗';
    case 'IDLE':
    case 'idle':
    default:
      return null;
  }
};
