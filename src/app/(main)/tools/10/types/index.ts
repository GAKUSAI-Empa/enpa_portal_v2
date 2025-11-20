// src/app/tools/tool10/types/index.ts

/**
 * Định nghĩa cấu trúc dữ liệu cho một dòng Coupon/Sản phẩm (Các cột hiện tại của bạn).
 */
export type ProductRow = {
  id: string;
  template: string;
  couponText1: string;
  couponText2: string;
  discount: string;
  discountType: 'percent' | 'yen' | '';
  conditions: string;
  startDate: string; // YYYY-MM-DDTHH:mm
  endDate: string; // YYYY-MM-DDTHH:mm
};

/**
 * Định nghĩa cấu trúc lỗi cho một dòng.
 */
export type RowErrors = {
  startDate?: string;
  endDate?: string;
  discount?: string;
  couponText1?: string;
  couponText2?: string;
  conditions?: string;
};

/**
 * Định nghĩa cấu trúc lỗi cho toàn bộ bảng (map từ ID dòng).
 */
export type AllErrors = { [key: string]: RowErrors };

// --- CÁC TYPE MỚI CHO CHỨC NĂNG BACKEND JOB & POLLING ---

/**
 * Định nghĩa trạng thái upload FTP.
 */
export type FtpUploadStatus = 'idle' | 'uploading' | 'success' | 'failed';

/**
 * Kết quả xử lý ảnh cho từng dòng sản phẩm.
 */
export type BackendImageResult = {
  status: 'Processing' | 'Success' | 'Error' | 'Pending';
  filename: string | null;
  message: string | null;
  previewUrl: string | null; // URL ảnh preview
};

/**
 * Định nghĩa cấu trúc đầy đủ cho trạng thái của một job xử lý ảnh từ backend.
 */
export type BackendJobStatus = {
  jobId: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Completed with errors' | 'Failed';
  progress: number;
  total: number;
  results: { [rowId: string]: BackendImageResult };
  startTime: number;
  endTime: number | null;
  message: string | null;
  ftpUploadStatusGold: FtpUploadStatus; // Trạng thái Upload FTP GOLD
  ftpUploadStatusRcabinet: FtpUploadStatus; // Trạng thái Upload FTP R-Cabinet
};

// --- TYPE CHO SESSION ---

export type SessionData = {
  productRows: ProductRow[];
  jobId: string | null;
  jobStatus: BackendJobStatus | null;
  timestamp: number;
};
