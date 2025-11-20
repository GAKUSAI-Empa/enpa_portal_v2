// src/app/tools/tool10/components/PreviewModal.tsx
import React from 'react';
import { templates } from '../constants';
import { Button } from '../../../../component/common/Button';
import { cn } from '../../../../lib/utils';
import type { BackendJobStatus, FtpUploadStatus, ProductRow, BackendImageResult } from '../types';
import {
  IconLoader2,
  IconCircleCheck,
  IconAlertCircle,
  IconX,
  IconDownload,
  IconUpload,
  IconCircleX,
  IconChevronDown,
} from '@tabler/icons-react';
import {
  getJobStatusIcon,
  getJobStatusText,
  getFtpStatusIcon,
  getFtpStatusText,
} from '../lib/utils'; // Import utils

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobStatus: BackendJobStatus | null;
  isLoading: boolean;
  productRows: ProductRow[];
  onDownloadZip: () => void;
  onUploadFTP: (target: 'gold' | 'rcabinet') => void;
  // Trạng thái Loading tạm thời cho nút FTP
  isUploadingGold: boolean;
  isUploadingRcabinet: boolean;

  // Logic Lazy Load từ mẫu
  visibleCount: number;
  onLoadMore: () => void;
}

const BATCH_SIZE = 10; // Giả định Batch Size
const isJobFinished = (status: BackendJobStatus['status']) =>
  status === 'Completed' || status === 'Completed with errors' || status === 'Failed';

/**
 * Modal hiển thị trạng thái xử lý Job và Preview ảnh đã tạo.
 */
function PreviewModal({
  isOpen,
  onClose,
  jobStatus,
  isLoading,
  productRows,
  onDownloadZip,
  onUploadFTP,
  isUploadingGold,
  isUploadingRcabinet,
  visibleCount,
  onLoadMore,
}: PreviewModalProps) {
  if (!isOpen) return null;

  const resultsArray = jobStatus ? Object.entries(jobStatus.results) : [];
  const canPerformActions = jobStatus && isJobFinished(jobStatus.status);
  const isAnyFtpUploading =
    isUploadingGold ||
    isUploadingRcabinet ||
    jobStatus?.ftpUploadStatusGold === 'uploading' ||
    jobStatus?.ftpUploadStatusRcabinet === 'uploading';

  // Component hiển thị chi tiết kết quả từng dòng
  const ResultItem: React.FC<{
    row: ProductRow;
    result: [string, BackendImageResult];
    index: number;
  }> = ({ row, result: [rowId, result], index }) => {
    // Tìm template image (cần template của row)
    const templateImg = templates.find((t) => t.name === row.template)?.imgs;

    return (
      <div className="flex items-start border-b p-3 last:border-b-0 space-x-3">
        <div className="text-sm font-medium w-8 flex-shrink-0 text-center">{index + 1}</div>
        <div className="flex-grow min-w-0 space-y-1">
          {/* Dòng chính: Template, Discount, Status */}
          <div className="text-sm font-semibold text-gray-700 truncate">
            <span className="text-xs font-normal text-gray-500 mr-2">Template:</span>
            {row.template}
          </div>
          <div className="text-xs text-gray-600 truncate">
            <span className="font-normal text-gray-500 mr-2">Discount:</span>
            {row.discount} {row.discountType === 'percent' ? '%' : '円'} / {row.conditions}
          </div>
        </div>
        <div className="flex-shrink-0 w-32 text-right">
          <div
            className={cn(
              'text-sm font-medium',
              result.status === 'Success'
                ? 'text-green-600'
                : result.status === 'Error'
                  ? 'text-red-600'
                  : 'text-gray-500',
            )}
          >
            {result.status === 'Processing'
              ? '処理中'
              : result.status === 'Success'
                ? '成功'
                : result.status === 'Error'
                  ? 'エラー'
                  : '待機中'}
          </div>
          {result.message && <div className="text-xs text-red-500">{result.message}</div>}
        </div>
        {/* Preview ảnh (dùng template làm placeholder nếu không có URL thật) */}
        <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden border">
          {result.previewUrl || templateImg ? (
            <img
              src={result.previewUrl || templateImg || undefined}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
              No Image
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[90] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold">画像生成とアップロード</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <IconX size={24} />
            </button>
          </div>

          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center space-x-3">
              {getJobStatusIcon(jobStatus?.status)}
              <div className="text-lg font-semibold">{getJobStatusText(jobStatus?.status)}</div>
              <div className="text-sm text-gray-500">
                ({jobStatus?.progress ?? 0} / {jobStatus?.total ?? productRows.length} 件 完了)
              </div>
              {isLoading && <span className="text-sm text-blue-500 ml-auto">処理中...</span>}
            </div>
            {/* Thanh tiến trình */}
            <div className="mt-2 h-2 bg-gray-200 rounded">
              <div
                className={cn(
                  'h-full rounded transition-all duration-500',
                  jobStatus?.status === 'Completed'
                    ? 'bg-green-500'
                    : jobStatus?.status === 'Failed'
                      ? 'bg-red-500'
                      : 'bg-blue-500',
                )}
                style={{
                  width: `${jobStatus ? (jobStatus.progress / (jobStatus.total || 1)) * 100 : 0}%`,
                }}
              />
            </div>
            {jobStatus?.message && (
              <div className="text-red-500 text-sm mt-2">エラー: {jobStatus.message}</div>
            )}
          </div>

          {/* Khu vực Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            {/* Download Button */}
            <Button
              color="secondary"
              onClick={onDownloadZip}
              disabled={!canPerformActions || isAnyFtpUploading}
              className="inline-flex items-center"
            >
              <IconDownload size={18} className="mr-1.5" /> 全画像をダウンロード
            </Button>

            {/* Upload GOLD */}
            <Button
              color="primary"
              onClick={() => onUploadFTP('gold')}
              disabled={!canPerformActions || isAnyFtpUploading}
              className="inline-flex items-center"
            >
              {isUploadingGold || jobStatus?.ftpUploadStatusGold === 'uploading' ? (
                <IconLoader2 size={18} className="mr-1.5 animate-spin" />
              ) : (
                <IconUpload size={18} className="mr-1.5" />
              )}
              GOLDにアップロード
            </Button>
            {/* Upload R-Cabinet */}
            <Button
              color="primary"
              onClick={() => onUploadFTP('rcabinet')}
              disabled={!canPerformActions || isAnyFtpUploading}
              className="inline-flex items-center"
            >
              {isUploadingRcabinet || jobStatus?.ftpUploadStatusRcabinet === 'uploading' ? (
                <IconLoader2 size={18} className="mr-1.5 animate-spin" />
              ) : (
                <IconUpload size={18} className="mr-1.5" />
              )}
              R-Cabinetにアップロード
            </Button>
          </div>

          {/* Trạng thái Upload FTP */}
          <div className="mt-3 flex justify-center gap-6 text-sm">
            <div className="flex items-center space-x-1">
              {getFtpStatusIcon(jobStatus?.ftpUploadStatusGold)}
              <span className="font-medium text-gray-700">GOLD:</span>
              <span
                className={cn(
                  jobStatus?.ftpUploadStatusGold === 'success'
                    ? 'text-green-600'
                    : jobStatus?.ftpUploadStatusGold === 'failed'
                      ? 'text-red-600'
                      : 'text-gray-500',
                )}
              >
                {getFtpStatusText(jobStatus?.ftpUploadStatusGold) || '待機中'}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              {getFtpStatusIcon(jobStatus?.ftpUploadStatusRcabinet)}
              <span className="font-medium text-gray-700">R-Cabinet:</span>
              <span
                className={cn(
                  jobStatus?.ftpUploadStatusRcabinet === 'success'
                    ? 'text-green-600'
                    : jobStatus?.ftpUploadStatusRcabinet === 'failed'
                      ? 'text-red-600'
                      : 'text-gray-500',
                )}
              >
                {getFtpStatusText(jobStatus?.ftpUploadStatusRcabinet) || '待機中'}
              </span>
            </div>
          </div>
        </div>

        {/* Nội dung Preview/Result */}
        <div className="flex-grow overflow-y-auto px-6 pb-6">
          <h4 className="text-lg font-semibold mb-3">生成結果 ({resultsArray.length} 件)</h4>
          <div className="border rounded-lg divide-y">
            {resultsArray.slice(0, visibleCount).map(([rowId, result], index) => {
              const row = productRows.find((r) => r.id === rowId);
              if (!row) return null;
              return <ResultItem key={rowId} row={row} result={[rowId, result]} index={index} />;
            })}
          </div>

          {/* Nút Load More (Lazy Load) */}
          {resultsArray.length > visibleCount && (
            <div className="text-center mt-4">
              <Button onClick={onLoadMore} color="secondary" className="inline-flex items-center">
                <IconChevronDown size={18} className="mr-1.5" /> さらに{' '}
                {Math.min(BATCH_SIZE, resultsArray.length - visibleCount)} 件表示
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;
