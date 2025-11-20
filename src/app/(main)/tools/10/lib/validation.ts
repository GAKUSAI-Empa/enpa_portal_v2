// src/app/tools/tool10/lib/validation.ts
import type { ProductRow, AllErrors, RowErrors } from '../types';

/**
 * Kiểm tra tính hợp lệ của tất cả các dòng sản phẩm (dựa trên các cột hiện tại của bạn).
 * @param rows - Mảng các đối tượng ProductRow cần kiểm tra.
 * @returns Một đối tượng chứa lỗi (AllErrors) và boolean cho biết có lỗi hay không.
 */
export const validateRows = (rows: ProductRow[]): { errors: AllErrors; isValid: boolean } => {
  const newErrors: AllErrors = {};

  rows.forEach((row) => {
    const rowErrors: RowErrors = {};

    // 1. Kiểm tra Ngày Bắt đầu/Kết thúc (StartDate/EndDate)
    if (!row.startDate) {
      rowErrors.startDate = '必須項目です。';
    }
    if (!row.endDate) {
      rowErrors.endDate = '必須項目です。';
    }

    // 2. Kiểm tra Discount
    if (!row.discount) {
      rowErrors.discount = '必須項目です。';
    } else {
      // Cho phép cả số nguyên và số thập phân (do input đã được lọc ở component)
      const discountNum = parseFloat(row.discount);
      if (isNaN(discountNum) || discountNum < 0) {
        rowErrors.discount = '有効な数値を入力してください。';
      }
    }

    // 3. Kiểm tra Ngày Kết thúc > Ngày Bắt đầu (Nếu cả 2 đều hợp lệ)
    if (row.startDate && row.endDate && !rowErrors.startDate && !rowErrors.endDate) {
      const start = new Date(row.startDate).getTime();
      const end = new Date(row.endDate).getTime();
      if (start >= end) {
        rowErrors.endDate = '開始日時より後の日時を設定してください。';
      }
    }

    // 4. Kiểm tra Coupon Text 1 (Ví dụ: giới hạn 50 ký tự)
    if (row.couponText1 && row.couponText1.length > 50) {
      rowErrors.couponText1 = '50文字以内で入力してください。';
    }

    // 5. Kiểm tra Coupon Text 2 (Ví dụ: giới hạn 50 ký tự)
    if (row.couponText2 && row.couponText2.length > 50) {
      rowErrors.couponText2 = '50文字以内で入力してください。';
    }

    // 6. Kiểm tra Conditions (Ví dụ: giới hạn 100 ký tự)
    if (!row.conditions) {
      rowErrors.conditions = '必須項目です。';
    } else if (row.conditions.length > 100) {
      rowErrors.conditions = '100文字以内で入力してください。';
    }

    if (Object.keys(rowErrors).length > 0) {
      newErrors[row.id] = rowErrors;
    }
  });

  return { errors: newErrors, isValid: Object.keys(newErrors).length === 0 };
};
