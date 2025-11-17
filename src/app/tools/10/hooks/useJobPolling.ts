// src/app/tools/tool10/hooks/useJobPolling.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import type { BackendJobStatus } from '../types';

// --- Helper Functions ---
function isFtpFinalState(status?: string | null): boolean {
  return status === 'success' || status === 'failed';
}

function isFtpUploading(status?: string | null): boolean {
  return status === 'uploading';
}

function isJobProcessingFinished(status?: string | null): boolean {
  return !['Pending', 'Processing'].includes(status || '');
}
// ------------------------

interface UseJobPollingProps {
  jobId: string | null;
  isOpen: boolean; // Chỉ polling khi modal mở
  onJobStatusUpdate: (status: BackendJobStatus) => void;
  // Các handler callback cho các sự kiện Job/FTP (giống mẫu)
  onJobNotFound?: () => void;
  onPollingError?: (error: Error) => void;
  onFtpSuccess?: (target: 'gold' | 'rcabinet', message: string) => void;
  onFtpError?: (target: 'gold' | 'rcabinet', message: string) => void;
}

export function useJobPolling({
  jobId,
  isOpen,
  onJobStatusUpdate,
  onJobNotFound,
  onPollingError,
  onFtpSuccess,
  onFtpError,
}: UseJobPollingProps) {
  const [jobStatus, setJobStatus] = useState<BackendJobStatus | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const latestJobStatusRef = useRef(jobStatus);
  const latestIsOpenRef = useRef(isOpen);
  const latestJobIdRef = useRef(jobId);

  // Cập nhật refs mỗi lần render
  useEffect(() => {
    latestJobStatusRef.current = jobStatus;
    latestIsOpenRef.current = isOpen;
    latestJobIdRef.current = jobId;
  });

  // Hàm API MOCK để lấy trạng thái Job (CẦN THAY THẾ BẰNG API THẬT CỦA BẠN)
  const fetchJobStatus = useCallback(
    async (id: string) => {
      console.log(`[Polling] Fetching status for job: ${id}`);
      try {
        // --- THAY THẾ BẰNG CALL API THẬT CỦA BẠN ---
        // const response = await fetch(`/api/job/status?jobId=${id}`);
        // if (response.status === 404) {
        //   onJobNotFound?.();
        //   return null;
        // }
        // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        // const newStatus: BackendJobStatus = await response.json();
        // ---------------------------------------------

        // MOCK DATA (Thay thế bằng code trên khi có API)
        const mockStatus: BackendJobStatus = {
          jobId: id,
          status: 'Completed',
          progress: 5,
          total: 5,
          results: {},
          startTime: Date.now() - 60000,
          endTime: Date.now(),
          message: null,
          ftpUploadStatusGold: 'success',
          ftpUploadStatusRcabinet: 'idle',
        };
        const newStatus = mockStatus;

        // Xử lý logic trạng thái FTP thay đổi
        const prevStatus = latestJobStatusRef.current;

        if (prevStatus && newStatus) {
          // Gold
          if (
            !isFtpFinalState(prevStatus.ftpUploadStatusGold) &&
            isFtpFinalState(newStatus.ftpUploadStatusGold)
          ) {
            if (newStatus.ftpUploadStatusGold === 'success') {
              onFtpSuccess?.('gold', 'GOLD へのアップロードが完了しました。');
            } else {
              onFtpError?.('gold', 'GOLD へのアップロード中にエラーが発生しました。');
            }
          }
          // R-Cabinet
          if (
            !isFtpFinalState(prevStatus.ftpUploadStatusRcabinet) &&
            isFtpFinalState(newStatus.ftpUploadStatusRcabinet)
          ) {
            if (newStatus.ftpUploadStatusRcabinet === 'success') {
              onFtpSuccess?.('rcabinet', 'R-Cabinet へのアップロードが完了しました。');
            } else {
              onFtpError?.('rcabinet', 'R-Cabinet へのアップロード中にエラーが発生しました。');
            }
          }
        }

        setJobStatus(newStatus);
        onJobStatusUpdate(newStatus);

        if (
          isJobProcessingFinished(newStatus.status) &&
          !isFtpUploading(newStatus.ftpUploadStatusGold) &&
          !isFtpUploading(newStatus.ftpUploadStatusRcabinet)
        ) {
          // Dừng polling khi job hoàn thành và tất cả FTP đã xong/lỗi
          if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
          if (newStatus.status.startsWith('Completed')) {
            toast.success('画像生成処理が完了しました。');
          } else if (newStatus.status === 'Failed') {
            toast.error('画像生成処理が完全に失敗しました。');
          }
        }

        return newStatus;
      } catch (error) {
        console.error('Polling error:', error);
        onPollingError?.(error as Error);
        return null;
      }
    },
    [onJobStatusUpdate, onJobNotFound, onPollingError, onFtpSuccess, onFtpError],
  );

  const runPollingIteration = useCallback(() => {
    if (latestJobIdRef.current) {
      fetchJobStatus(latestJobIdRef.current);
    }
  }, [fetchJobStatus]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // --- Logic Chính: Thiết lập Interval ---
  useEffect(() => {
    const status = latestJobStatusRef.current;

    // Chỉ polling nếu Modal đang mở VÀ JobId tồn tại
    // VÀ job chưa hoàn thành VÀ không có FTP nào đang chạy hoặc chưa xong
    const shouldPoll =
      isOpen &&
      !!jobId &&
      (!isJobProcessingFinished(status?.status) ||
        isFtpUploading(status?.ftpUploadStatusGold) ||
        isFtpUploading(status?.ftpUploadStatusRcabinet));

    if (shouldPoll) {
      if (!pollingIntervalRef.current) {
        // Chạy lần đầu ngay lập tức
        runPollingIteration();
        pollingIntervalRef.current = setInterval(runPollingIteration, 3000); // Poll mỗi 3 giây
        console.log('[Hook] start interval (polling needed)');
      }
    } else {
      stopPolling();
      console.log('[Hook] stop interval (polling no longer needed)');
    }

    // Cleanup function
    return () => {
      stopPolling();
      console.log('[Hook] interval cleanup on unmount/deps change');
    };
  }, [
    isOpen,
    jobId,
    jobStatus?.status,
    jobStatus?.ftpUploadStatusGold,
    jobStatus?.ftpUploadStatusRcabinet,
    stopPolling,
    runPollingIteration,
  ]);

  // --- isLoading ---
  const isLoading =
    (isOpen && !!jobId && !jobStatus) ||
    jobStatus?.status === 'Processing' ||
    jobStatus?.status === 'Pending' ||
    isFtpUploading(jobStatus?.ftpUploadStatusGold) ||
    isFtpUploading(jobStatus?.ftpUploadStatusRcabinet);

  return { jobStatus, isLoading, fetchJobStatus };
}
