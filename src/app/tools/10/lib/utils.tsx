// src/app/tools/tool10/lib/utils.ts
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
 * @param idPrefix - Tiền tố cho ID (thường là baseId từ useId).
 * @returns Một đối tượng ProductRow mới.
 */
export const createNewProductRow = (idPrefix: string): ProductRow => ({
  id: `${idPrefix}-${Date.now()}`,
  template: templates[0]?.name || '',
  couponText1: '',
  couponText2: '',
  discount: '',
  discountType: 'percent',
  conditions: '',
  startDate: '',
  endDate: '',
});

/**
 * Chuyển đổi định dạng ngày giờ tiếng Nhật (M月 D日 H時 M分) sang ISO 8601 (YYYY-MM-DDTHH:mm).
 * @param dateStr - Chuỗi ngày giờ tiếng Nhật.
 * @returns Chuỗi ngày giờ theo định dạng input type="datetime-local" hoặc chuỗi rỗng.
 */
export const parseJapaneseDate = (dateStr: string): string => {
  if (!dateStr || !dateStr.includes('月')) return '';
  const match = dateStr.match(/(\d{1,2})月\s*(\d{1,2})日\s*(\d{1,2})[:時](\d{1,2})/);
  if (!match) return '';
  const [, month, day, hour, minute] = match.map(Number);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  // Giả định nếu tháng < tháng hiện tại thì là năm sau
  const year = month < currentMonth ? currentYear + 1 : currentYear;

  const formattedMonth = String(month).padStart(2, '0');
  const formattedDay = String(day).padStart(2, '0');
  const formattedHour = String(hour).padStart(2, '0');
  const formattedMinute = String(minute).padStart(2, '0');

  return `${year}-${formattedMonth}-${formattedDay}T${formattedHour}:${formattedMinute}`;
};

// --- HELPER FUNCTIONS MỚI CHO JOB STATUS (TỪ CODE MẪU) ---

/**
 * Trả về Icon tương ứng với trạng thái Job.
 * @param status - Trạng thái Job.
 * @returns React Node của Icon.
 */
export const getJobStatusIcon = (status?: BackendJobStatus['status']): React.ReactNode => {
  switch (status) {
    case 'Pending':
    case 'Processing':
      return <IconLoader2 className="h-4 w-4 animate-spin text-blue-500" />;
    case 'Completed':
      return <IconCircleCheck className="h-4 w-4 text-green-500" />;
    case 'Completed with errors':
      return <IconAlertCircle className="h-4 w-4 text-yellow-500" />;
    case 'Failed':
      return <IconX className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

/**
 * Trả về Text mô tả tương ứng với trạng thái Job.
 * @param status - Trạng thái Job.
 * @returns Chuỗi mô tả trạng thái.
 */
export const getJobStatusText = (status?: BackendJobStatus['status']): string => {
  switch (status) {
    case 'Pending':
      return '処理待ち...';
    case 'Processing':
      return '画像生成中...';
    case 'Completed':
      return '完了しました';
    case 'Completed with errors':
      return '一部エラーで完了しました';
    case 'Failed':
      return '失敗しました';
    default:
      return '不明';
  }
};

/**
 * Trả về Icon tương ứng với trạng thái Upload FTP.
 * @param status - Trạng thái FTP ('idle', 'uploading', 'success', 'failed').
 * @returns React Node của Icon hoặc null.
 */
export const getFtpStatusIcon = (status?: FtpUploadStatus): React.ReactNode => {
  switch (status) {
    case 'uploading':
      return <IconCloudUpload className="h-4 w-4 animate-pulse text-blue-500" />;
    case 'success':
      return <IconCloudCheck className="h-4 w-4 text-green-500" />;
    case 'failed':
      return <IconCloudOff className="h-4 w-4 text-red-500" />;
    case 'idle':
    default:
      return null;
  }
};

/**
 * Trả về Text mô tả tương ứng với trạng thái Upload FTP.
 * @param status - Trạng thái FTP.
 * @param error - Thông báo lỗi (nếu có).
 * @returns Chuỗi mô tả trạng thái hoặc null.
 */
export const getFtpStatusText = (
  status?: FtpUploadStatus,
  error?: string | null,
): string | null => {
  switch (status) {
    case 'uploading':
      return 'アップロード中...';
    case 'success':
      return 'アップロード完了';
    case 'failed':
      return error || 'アップロード失敗';
    case 'idle':
    default:
      return null;
  }
};

/**
 * Kiểm tra xem Job có ở trạng thái cuối cùng (Finished) hay không.
 * Trạng thái Finished bao gồm thành công, thành công có lỗi, hoặc thất bại.
 */
export const isJobFinished = (status: BackendJobStatus['status']): boolean => {
  return status === 'Completed' || status === 'Completed with errors' || status === 'Failed';
};
