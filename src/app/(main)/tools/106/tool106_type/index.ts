export type ProductRow = {
  id: number;
  template: string;
  coupon_message1: string;
  coupon_message2: string;
  discount_value: number;
  discount_unit: string;
  available_condition: string;
  start_date: string;
  end_date: string;
};

export type RowErrors = {
  template?: string;
  coupon_message1?: string;
  coupon_message2?: string;
  discount_value?: number;
  discount_unit?: string;
  available_condition?: string;
  start_date?: string;
  end_date?: string;
};

export type AllErrors = { [key: string]: RowErrors };

export type BackendImageResult = {
  status: 'Processing' | 'Success' | 'Error' | 'Pending';
  filename: string | null;
  message: string | null;
};

export type FtpUploadStatus = 'IDLE' | 'UPLOADING' | 'SUCCESS' | 'FAILED';

export type JobStatus = {
  jobId: string;
  status: 'PENDING' | 'Processing' | 'COMPLETED' | 'COMPLETED_WITH_ERRORS' | 'FAILED' | 'RUNNING';
  progress: number;
  total: number;
  results: { [rowId: string]: BackendImageResult };
  startTime: number;
  endTime: number | null;
  message: string | null;
  ftpUploadStatusGold?: FtpUploadStatus | 'idle';
  ftpUploadErrorGold?: string | null;
  ftpUploadStatusRcabinet?: FtpUploadStatus | 'idle';
  ftpUploadErrorRcabinet?: string | null;
};
