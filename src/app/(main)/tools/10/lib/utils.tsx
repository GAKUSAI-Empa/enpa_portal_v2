import {
  IconAlertCircle,
  IconCircleCheck,
  IconCloudCheck,
  IconCloudOff,
  IconCloudUpload,
  IconLoader2,
  IconX,
} from '@tabler/icons-react';
import React from 'react';
import { FtpUploadStatus, JobStatus, ProductRow } from '../tool10_type';

export const createNewProductRow = (idPrefix: string): ProductRow => {
  const uniqueId: number = Date.now() + Math.floor(Math.random() * 1000);
  return {
    id: uniqueId,
    template: '',
    coupon_message1: '',
    coupon_message2: '',
    discount_value: 0,
    discount_unit: '',
    available_condition: '',
    start_date: '',
    end_date: '',
  };
};

export const getJobStatusIcon = (status: JobStatus['status'] | 'PENDING'): React.ReactNode => {
  switch (status) {
    case 'PENDING':
      return <IconLoader2 className="animate-spin text-blue-500" />;
    case 'Processing':
      return <IconLoader2 className="animate-spin text-blue-500" />;
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

export const getJobStatusText = (status: JobStatus['status'] | 'PENDING'): string => {
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
