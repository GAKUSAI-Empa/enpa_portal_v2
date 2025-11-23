// src/app/tools/03/types/index.ts

/**
 * Định nghĩa cấu trúc dữ liệu cho một dòng sản phẩm trong bảng.
 */
export type ProductRow = {
  id: string; // ID duy nhất cho mỗi dòng (có thể là UUID tạm thời phía client)
  productCode: string; // Mã quản lý sản phẩm (商品管理番号)
  template: string; // Tên template được chọn (テンプレート)
  startDate: string; // Thời gian bắt đầu (YYYY-MM-DDTHH:mm) (開始日時)
  endDate: string; // Thời gian kết thúc (YYYY-MM-DDTHH:mm) (終了日時)
  priceType: string; // Loại giá gốc (当店通常価格, メーカー希望小売価格, クーポン利用で, custom) (二重価格)
  customPriceType: string; // Giá trị tùy chỉnh nếu priceType là 'custom'
  regularPrice: string; // Giá gốc (số dưới dạng string) (価格)
  salePrice: string; // Giá sale (số dưới dạng string) (セール価格)
  saleText: string; // Text hiển thị cho sale (セール文言)
  discount: string; // Text hiển thị discount (tự động tính, vd: "20%OFF", "1000円OFF")
  discountType: 'percent' | 'yen' | ''; // Loại discount được chọn ('percent' hoặc 'yen') (割引表示)
  mobileStartDate: string; // Thời gian bắt đầu trên mobile (YYYY-MM-DDTHH:mm) (楽天モバイル開始日時)
  mobileEndDate: string; // Thời gian kết thúc trên mobile (YYYY-MM-DDTHH:mm) (楽天モバイル終了日時)
};

/**
 * Định nghĩa cấu trúc lỗi cho một dòng sản phẩm.
 * Các key tương ứng với các trường trong ProductRow có thể bị lỗi.
 */
export type RowErrors = {
  productCode?: string;
  startDate?: string;
  endDate?: string;
  regularPrice?: string;
  salePrice?: string;
  saleText?: string;
};

/**
 * Định nghĩa cấu trúc chứa tất cả lỗi, map từ ID dòng sang đối tượng RowErrors.
 */
export type AllErrors = { [key: string]: RowErrors };

/**
 * Định nghĩa cấu trúc kết quả xử lý ảnh từ backend cho một item.
 */
export type BackendImageResult = {
  // === (SỬA LỖI) Sửa lại status của item (backend worker có thể trả về 'Success' hoặc 'Error') ===
  status: 'Processing' | 'Success' | 'Error' | 'Pending';
  filename: string | null; // Tên file ảnh đã tạo (nếu thành công)
  message: string | null; // Thông báo lỗi (nếu có)
};

/**
 * Định nghĩa các trạng thái có thể có của quá trình upload FTP.
 */
// === (SỬA LỖI) FTP Status cũng dùng chữ thường (theo logic cũ) hoặc chữ hoa?
// Tạm thời giả định là chữ thường (idle, uploading, success, failed)
// Nếu FTP cũng dùng chữ hoa, bạn cần sửa lại ở đây.
export type FtpUploadStatus = 'IDLE' | 'UPLOADING' | 'SUCCESS' | 'FAILED';

/**
 * Định nghĩa cấu trúc đầy đủ cho trạng thái của một job xử lý ảnh từ backend.
 */
export type BackendJobStatus = {
  jobId: string; // ID của job
  // === (SỬA LỖI) Đổi sang chữ IN HOA để khớp với backend ===
  status:
    | 'PENDING'
    | 'Processing' // (Giữ lại 'Processing' của frontend)
    | 'RUNNING'
    | 'COMPLETED'
    | 'COMPLETED_WITH_ERRORS'
    | 'FAILED';
  // === (KẾT THÚC SỬA LỖI) ===
  progress: number;
  total: number;
  results: { [rowId: string]: BackendImageResult };
  startTime: number;
  endTime: number | null;
  message: string | null;
  ftpUploadStatusGold?: FtpUploadStatus | 'idle'; // (Thêm 'idle' làm mặc định)
  ftpUploadErrorGold?: string | null;
  ftpUploadStatusRcabinet?: FtpUploadStatus | 'idle'; // (Thêm 'idle' làm mặc định)
  ftpUploadErrorRcabinet?: string | null;
};
