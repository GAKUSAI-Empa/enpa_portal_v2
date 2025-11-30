import { Button } from '@/component/common/Button';
import { cn } from '@/lib/utils';
import {
  IconAlertCircle,
  IconChevronDown,
  IconCircleCheck,
  IconCircleX,
  IconCloudCheck,
  IconCloudOff,
  IconCloudUpload,
  IconDownload,
  IconLoader2,
  IconUpload,
} from '@tabler/icons-react';

import type { JobStatus, ProductRow } from '../tool10_type';
import { S3Image } from './S3Image';

const JOB_STATUS_JP: Record<string, string> = {
  PENDING: '待機中',
  RUNNING: '生成中',
  COMPLETED: '完了',
  COMPLETED_WITH_ERRORS: '完了 (一部エラー)',
  FAILED: '失敗',
};

const ITEM_STATUS_JP: Record<string, string> = {
  Processing: '処理中',
  Success: '成功',
  Error: 'エラー',
  Pending: '待機中',
};

const getJobStatusIcon = (status: string | null | undefined) => {
  switch (status) {
    case 'COMPLETED':
      return <IconCircleCheck size={20} className="text-green-600" />;
    case 'COMPLETED_WITH_ERRORS':
      return <IconAlertCircle size={20} className="text-yellow-600" />;
    case 'FAILED':
      return <IconCircleX size={20} className="text-red-600" />;
    case 'RUNNING':
    case 'Processing':
    case 'PENDING':
    default:
      return <IconLoader2 size={20} className="animate-spin text-blue-600" />;
  }
};

const getJobStatusText = (status: string | null | undefined) => {
  const s = status || 'PENDING';
  return JOB_STATUS_JP[s] || s; // Dùng map tiếng Nhật
};

const getFtpStatusIcon = (status: string | null | undefined) => {
  const s = status?.toUpperCase(); // (Đảm bảo an toàn)
  switch (s) {
    case 'SUCCESS':
      return <IconCloudCheck size={14} className="text-green-600" />;
    case 'FAILED':
      return <IconCloudOff size={14} className="text-red-600" />;
    case 'UPLOADING':
      return <IconLoader2 size={14} className="animate-spin text-blue-600" />;
    case 'IDLE':
    default:
      return <IconCloudUpload size={14} className="text-gray-500" />;
  }
};

const getFtpStatusText = (status: string | null | undefined, error: string | null | undefined) => {
  const s = status?.toUpperCase() || 'IDLE';
  if (s === 'FAILED') return error ? '失敗' : '失敗';
  if (s === 'SUCCESS') return '成功';
  if (s === 'UPLOADING') return 'アップロード中';
  return '待機中';
};

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobStatus: JobStatus | null;
  isLoading: boolean;
  productRows: ProductRow[];
  onDownLoadZip: () => void;
  onUploadToFtp: (target: 'gold' | 'rcabinet') => void;
  isUploadingGold: boolean;
  isUploadingRcabinet: boolean;
  visibleCount: number;
  onLoadMore: () => void;
}

function PreviewModal({
  isOpen,
  onClose,
  jobStatus,
  isLoading,
  productRows,
  onDownLoadZip,
  onUploadToFtp,
  isUploadingGold,
  isUploadingRcabinet,
  visibleCount,
  onLoadMore,
}: PreviewModalProps) {
  if (!isOpen) return null;

  const currentTotal = jobStatus?.total ?? productRows.length;
  const currentProgress = jobStatus?.progress ?? 0;
  const progressPercentage = currentTotal ? (currentProgress / currentTotal) * 100 : 0;

  const isJobFinished =
    jobStatus?.status === 'COMPLETED' || jobStatus?.status === 'COMPLETED_WITH_ERRORS';
  const isJobFailed = jobStatus?.status === 'FAILED';
  const isJobRunning =
    jobStatus?.status === 'Processing' ||
    jobStatus?.status === 'PENDING' ||
    jobStatus?.status === 'RUNNING';

  const isAnyFtpUploading =
    isUploadingGold ||
    isUploadingRcabinet ||
    jobStatus?.ftpUploadStatusGold?.toUpperCase() === 'UPLOADING' ||
    jobStatus?.ftpUploadStatusRcabinet?.toUpperCase() === 'UPLOADING';

  const canPerformActions = isJobFinished && !isJobFailed;
  const currentRowIds = new Set(productRows.map((row) => row.id));
  const relevantRows = jobStatus?.results
    ? productRows.filter((row) => currentRowIds.has(row.id) && jobStatus.results[row.id])
    : productRows.filter((row) => currentRowIds.has(row.id));

  const visibleRows = relevantRows.slice(0, visibleCount);
  const totalRelevantRows = relevantRows.length;
  const hasMore = totalRelevantRows > visibleCount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">画像プレビュー</h2>
        </div>

        {/* Body */}
        <div className="p-6 flex-grow overflow-y-auto">
          {/* Status Bar */}
          <div className="mb-4 p-3 bg-gray-50 rounded-md border space-y-2">
            {/* Job status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {/* (SỬA LỖI 1) Gọi hàm nội bộ */}
                {getJobStatusIcon(jobStatus?.status)}
                <span className="font-medium">
                  {/* (SỬA LỖI 1) Gọi hàm nội bộ */}
                  {getJobStatusText(jobStatus?.status)}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {currentProgress} / {currentTotal} 件処理済み
              </span>
            </div>
            {/* Progress bar (Logic cũ không đổi) */}
            {(isJobRunning || isLoading) && !isJobFailed && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={cn(
                    'h-2.5 rounded-full transition-all duration-300',
                    isLoading && !isJobRunning ? 'bg-gray-400 animate-pulse' : 'bg-blue-600',
                  )}
                  style={{
                    width: `${isLoading && !isJobRunning ? 100 : progressPercentage}%`,
                  }}
                ></div>
              </div>
            )}
            {/* FTP status */}
            <div className="flex items-center justify-between text-xs text-gray-600 pt-1 border-t border-gray-200 mt-2">
              <div className="flex items-center space-x-1">
                <span>GOLD:</span>

                {/* === (SỬA LỖI 3) Chỉ hiển thị status nếu không phải IDLE === */}
                {jobStatus?.ftpUploadStatusGold &&
                  jobStatus.ftpUploadStatusGold.toUpperCase() !== 'IDLE' && (
                    <>
                      {getFtpStatusIcon(jobStatus?.ftpUploadStatusGold)}
                      <span title={jobStatus?.ftpUploadErrorGold ?? undefined}>
                        {getFtpStatusText(
                          jobStatus?.ftpUploadStatusGold,
                          jobStatus?.ftpUploadErrorGold,
                        )}
                      </span>
                    </>
                  )}
                {/* === (KẾT THÚC SỬA LỖI 3) === */}
              </div>
              <div className="flex items-center space-x-1">
                <span>R-Cabinet:</span>

                {/* === (SỬA LỖI 3) Chỉ hiển thị status nếu không phải IDLE === */}
                {jobStatus?.ftpUploadStatusRcabinet &&
                  jobStatus.ftpUploadStatusRcabinet.toUpperCase() !== 'IDLE' && (
                    <>
                      {getFtpStatusIcon(jobStatus?.ftpUploadStatusRcabinet)}
                      <span title={jobStatus?.ftpUploadErrorRcabinet ?? undefined}>
                        {getFtpStatusText(
                          jobStatus?.ftpUploadStatusRcabinet,
                          jobStatus?.ftpUploadErrorRcabinet,
                        )}
                      </span>
                    </>
                  )}
                {/* === (KẾT THÚC SỬA LỖI 3) === */}
              </div>
            </div>
            {/* Error messages (Logic cũ không đổi) */}
            {jobStatus?.message && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                {jobStatus.message}
              </div>
            )}
            {jobStatus?.status === 'COMPLETED_WITH_ERRORS' && !jobStatus.message && (
              <div className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded border border-yellow-200">
                一部の画像の生成に失敗しました。詳細は各画像をご確認ください。
              </div>
            )}
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Skeleton loading (Logic cũ không đổi) */}
            {isLoading &&
              (!jobStatus || Object.keys(jobStatus.results).length === 0) &&
              Array.from({ length: Math.min(productRows.length, visibleCount) }).map((_, i) => (
                <div
                  key={`skel-${i}`}
                  className="border rounded-lg p-3 flex flex-col items-center text-center shadow-sm animate-pulse"
                >
                  <div className="w-40 h-40 mb-2 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}

            {/* Actual image results */}
            {jobStatus?.results &&
              visibleRows.map((row) => {
                const rowId = row.id;
                const result = jobStatus.results[rowId];

                const status = result?.status ?? 'Pending';
                const message = result?.message;

                return (
                  <div
                    key={rowId}
                    className="border rounded-lg p-3 flex flex-col items-center text-center shadow-sm"
                  >
                    {/* S3Image component (Logic cũ không đổi) */}
                    <div className="w-40 h-40 mb-2 flex items-center justify-center bg-gray-100 rounded">
                      {status === 'Processing' || status === 'Pending' ? (
                        <IconLoader2 size={32} className="animate-spin text-blue-400" />
                      ) : status === 'Success' && result.filename && jobStatus?.jobId ? (
                        <S3Image
                          jobId={jobStatus.jobId}
                          filename={result.filename}
                          alt={`Preview for ${rowId}`}
                          className="max-w-full max-h-full object-contain rounded w-40 h-40"
                        />
                      ) : (
                        <IconAlertCircle
                          size={32}
                          className="text-red-400"
                          title={message || 'Không thể tải ảnh'}
                        />
                      )}
                    </div>

                    <p className="text-sm font-medium truncate w-full" title={row.id.toString()}>
                      {row.id}
                    </p>
                    <div className="flex items-center text-xs mt-1">
                      {status === 'Success' && (
                        <IconCircleCheck size={14} className="text-green-500 mr-1 flex-shrink-0" />
                      )}
                      {status === 'Error' && (
                        <IconCircleX size={14} className="text-red-500 mr-1 flex-shrink-0" />
                      )}
                      {(status === 'Processing' || status === 'Pending') && (
                        <IconLoader2
                          size={14}
                          className="text-blue-500 mr-1 flex-shrink-0 animate-spin"
                        />
                      )}
                      <span
                        className={cn(
                          'truncate',
                          status === 'Success' && 'text-green-600',
                          status === 'Error' && 'text-red-600',
                          (status === 'Processing' || status === 'Pending') && 'text-blue-600',
                        )}
                        title={message ?? status}
                      >
                        {message ? message : ITEM_STATUS_JP[status] || status}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>

          {hasMore && (
            <div className="mt-6 flex justify-center">
              <Button color="secondary" onClick={onLoadMore} className="inline-flex items-center">
                <IconChevronDown size={18} className="mr-1.5" />
                さらに表示
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-center items-center p-4 border-t space-x-3 bg-gray-50">
          <Button color="grey" onClick={onClose}>
            戻る
          </Button>
          <Button
            color="secondary"
            onClick={onDownLoadZip}
            disabled={!canPerformActions || isAnyFtpUploading}
            className="inline-flex items-center"
          >
            <IconDownload size={18} className="mr-1.5" /> 全画像をダウンロード
          </Button>
          <Button
            color="primary"
            onClick={() => onUploadToFtp('gold')}
            disabled={!canPerformActions || isAnyFtpUploading}
            className="inline-flex items-center"
          >
            {isUploadingGold || jobStatus?.ftpUploadStatusGold?.toUpperCase() === 'UPLOADING' ? (
              <IconLoader2 size={18} className="mr-1.5 animate-spin" />
            ) : (
              <IconUpload size={18} className="mr-1.5" />
            )}
            GOLDにアップロード
          </Button>
          <Button
            color="primary"
            onClick={() => onUploadToFtp('rcabinet')}
            disabled={!canPerformActions || isAnyFtpUploading}
            className="inline-flex items-center"
          >
            {isUploadingRcabinet ||
            jobStatus?.ftpUploadStatusRcabinet?.toUpperCase() === 'UPLOADING' ? (
              <IconLoader2 size={18} className="mr-1.5 animate-spin" />
            ) : (
              <IconUpload size={18} className="mr-1.5" />
            )}
            R-Cabinetにアップロード
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;
