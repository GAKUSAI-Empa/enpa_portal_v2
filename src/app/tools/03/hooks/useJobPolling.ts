// src/app/tools/03/hooks/useJobPolling.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { tool03API } from '../api/tool03API';
import type { BackendJobStatus } from '../types';

interface UseJobPollingProps {
  jobId: string | null;
  isOpen: boolean;
  onJobNotFound?: () => void;
  onPollingError?: (error: Error) => void;
  onFtpSuccess?: (target: 'gold' | 'rcabinet', message: string) => void;
  onFtpError?: (target: 'gold' | 'rcabinet', message: string) => void;
}

function isFtpFinalState(status?: string | null): boolean {
  // === (SỬA LỖI 2) Kiểm tra cả chữ hoa và chữ thường cho an toàn ===
  const upperStatus = status?.toUpperCase();
  return upperStatus === 'SUCCESS' || upperStatus === 'FAILED';
}

function isFtpUploading(status?: string | null): boolean {
  // === (SỬA LỖI 2) Thêm 'PENDING' vào trạng thái đang chờ ===
  // Giúp polling tiếp tục chạy nếu CSDL trả về 'PENDING'
  const upperStatus = status?.toUpperCase();
  return upperStatus === 'UPLOADING' || upperStatus === 'PENDING';
}

function isJobProcessingFinished(status?: string | null): boolean {
  // === (SỬA LỖI) Đảm bảo kiểm tra đúng các trạng thái "chưa hoàn thành" ===
  return !['PENDING', 'Processing', 'RUNNING'].includes(status || '');
}

export function useJobPolling({
  jobId,
  isOpen,
  onJobNotFound,
  onPollingError,
  onFtpSuccess,
  onFtpError,
}: UseJobPollingProps) {
  const [jobStatus, setJobStatus] = useState<BackendJobStatus | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousJobStatusRef = useRef<BackendJobStatus | null>(null);
  const latestIsOpenRef = useRef(isOpen);
  const latestJobIdRef = useRef(jobId);
  const onJobNotFoundRef = useRef(onJobNotFound);
  const onPollingErrorRef = useRef(onPollingError);
  const onFtpSuccessRef = useRef(onFtpSuccess);
  const onFtpErrorRef = useRef(onFtpError);

  useEffect(() => {
    latestIsOpenRef.current = isOpen;
    latestJobIdRef.current = jobId;
    onJobNotFoundRef.current = onJobNotFound;
    onPollingErrorRef.current = onPollingError;
    onFtpSuccessRef.current = onFtpSuccess;
    onFtpErrorRef.current = onFtpError;
  }, [isOpen, jobId, onJobNotFound, onPollingError, onFtpSuccess, onFtpError]);

  useEffect(() => {
    previousJobStatusRef.current = jobStatus;
  }, [jobStatus]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      console.log('[Hook] stop interval');
    }
  }, []);

  const runPollingIteration = useCallback(async () => {
    const currentIsOpen = latestIsOpenRef.current;
    const targetJobId = latestJobIdRef.current;
    if (!currentIsOpen || !targetJobId || !pollingIntervalRef.current) {
      if (pollingIntervalRef.current) stopPolling();
      return;
    }

    try {
      let newData: BackendJobStatus;
      try {
        newData = await tool03API.getJobStatus(targetJobId);
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          toast.error('ジョブが見つかりません。');
          stopPolling();
          setJobStatus(null);
          onJobNotFoundRef.current?.();
          return;
        }
        throw error;
      }

      if (
        !latestIsOpenRef.current ||
        latestJobIdRef.current !== targetJobId ||
        !pollingIntervalRef.current
      ) {
        if (pollingIntervalRef.current) stopPolling();
        return;
      }

      console.log('[Hook] polling RECEIVED:', JSON.stringify(newData));
      const prevData = previousJobStatusRef.current;
      setJobStatus(newData);

      // --- (SỬA LỖI) Kiểm tra trạng thái chữ IN HOA ---
      if (
        prevData?.status &&
        !isJobProcessingFinished(prevData.status) &&
        isJobProcessingFinished(newData.status)
      ) {
        if (newData.status === 'COMPLETED') toast.success('画像の生成が完了しました。');
        else if (newData.status === 'COMPLETED_WITH_ERRORS')
          toast.warning('一部のプレビュー生成に失敗しました。');
        else if (newData.status === 'FAILED')
          toast.error(`画像の生成に失敗しました: ${newData.message || '不明なエラー'}`);
      }
      // --- (KẾT THÚC SỬA LỖI) ---

      // --- (SỬA LỖI) Chuyển đổi trạng thái FTP (dùng isFtpUploading/isFtpFinalState) ---
      if (
        isFtpUploading(prevData?.ftpUploadStatusGold) &&
        isFtpFinalState(newData.ftpUploadStatusGold)
      ) {
        if (newData.ftpUploadStatusGold?.toUpperCase() === 'SUCCESS') {
          onFtpSuccessRef.current?.('gold', 'GOLDへのアップロードが完了しました。');
        } else {
          onFtpErrorRef.current?.(
            'gold',
            `GOLDへのアップロードに失敗しました: ${newData.ftpUploadErrorGold || '不明なエラー'}`,
          );
        }
      }

      if (
        isFtpUploading(prevData?.ftpUploadStatusRcabinet) &&
        isFtpFinalState(newData.ftpUploadStatusRcabinet)
      ) {
        if (newData.ftpUploadStatusRcabinet?.toUpperCase() === 'SUCCESS') {
          onFtpSuccessRef.current?.('rcabinet', 'R-Cabinetへのアップロードが完了しました。');
        } else {
          onFtpErrorRef.current?.(
            'rcabinet',
            `R-Cabinetへのアップロードに失敗しました: ${
              newData.ftpUploadErrorRcabinet || '不明なエラー'
            }`,
          );
        }
      }
      // --- (KẾT THÚC SỬA LỖI) ---

      const shouldStop =
        newData.status === 'FAILED' ||
        (isJobProcessingFinished(newData.status) &&
          isFtpFinalState(newData.ftpUploadStatusGold) &&
          isFtpFinalState(newData.ftpUploadStatusRcabinet));

      if (shouldStop) {
        stopPolling();
      }
    } catch (error) {
      console.error('[Hook] polling error:', error);
      onPollingErrorRef.current?.(error as Error);
    }
  }, [stopPolling]);

  useEffect(() => {
    const shouldPoll =
      isOpen &&
      !!jobId &&
      jobStatus &&
      (!isJobProcessingFinished(jobStatus.status) ||
        isFtpUploading(jobStatus.ftpUploadStatusGold) ||
        isFtpUploading(jobStatus.ftpUploadStatusRcabinet));
    const initialLoad = isOpen && !!jobId && !jobStatus;

    let firstRunTimeoutId: NodeJS.Timeout | null = null;

    if (shouldPoll || initialLoad) {
      if (!pollingIntervalRef.current) {
        firstRunTimeoutId = setTimeout(() => {
          if (latestIsOpenRef.current && latestJobIdRef.current === jobId) {
            runPollingIteration();
          }
          firstRunTimeoutId = null;
        }, 100);
        pollingIntervalRef.current = setInterval(runPollingIteration, 3000);
        console.log('[Hook] start interval (polling needed)');
      }
    } else {
      if (firstRunTimeoutId) clearTimeout(firstRunTimeoutId);
      if (pollingIntervalRef.current) {
        stopPolling();
        console.log('[Hook] stop interval (polling no longer needed)');
      }
    }
    return () => {
      if (firstRunTimeoutId) clearTimeout(firstRunTimeoutId);
      stopPolling();
      console.log('[Hook] interval cleanup on unmount/deps change');
    };
  }, [isOpen, jobId, jobStatus, stopPolling, runPollingIteration]);

  const isLoading =
    (isOpen && !!jobId && !jobStatus) ||
    jobStatus?.status === 'Processing' ||
    jobStatus?.status === 'PENDING' ||
    jobStatus?.status === 'RUNNING' ||
    isFtpUploading(jobStatus?.ftpUploadStatusGold) ||
    isFtpUploading(jobStatus?.ftpUploadStatusRcabinet);

  return { jobStatus, setJobStatus, isLoading, stopPolling };
}
