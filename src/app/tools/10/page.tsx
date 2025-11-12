// src/app/tools/tool10/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '../../../component/common/Card';
import { Button } from '../../../component/common/Button';
import { Toaster, toast } from 'sonner';
// import { useHeader } from '@/app/context/HeaderContext';

// --- IMPORT CÁC COMPONENT VÀ LOGIC ---
import EditableProductTable from './components/EditableProductTable';
import PreviewModal from './components/PreviewModal';
import RestoreSessionPopup from './components/RestoreSessionPopup';
import ResetConfirmPopup from './components/ResetConfirmPopup';
import { useJobPolling } from './hooks/useJobPolling';
import { validateRows } from './lib/validation';
import { createNewProductRow, isJobFinished } from './lib/utils';
import { templates, LOCAL_STORAGE_KEY } from './constants';
import type { ProductRow, AllErrors, BackendJobStatus, SessionData } from './types';

const BATCH_SIZE = 10;

export default function CouponImagePage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string | null>(null);
  const [errors, setErrors] = useState<AllErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  const [productRows, setProductRows] = useState<ProductRow[]>(() => [
    createNewProductRow('initial'),
  ]);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<BackendJobStatus | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [showRestorePopup, setShowRestorePopup] = useState(false);
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [isUploadingGold, setIsUploadingGold] = useState(false);
  const [isUploadingRcabinet, setIsUploadingRcabinet] = useState(false);

  // POLLING
  const { jobStatus: pollingStatus, isLoading: isModalLoading } = useJobPolling({
    jobId,
    isOpen: isPreviewModalOpen,
    onJobStatusUpdate: (status) => {
      setJobStatus(status);
      if (status.ftpUploadStatusGold !== 'uploading') setIsUploadingGold(false);
      if (status.ftpUploadStatusRcabinet !== 'uploading') setIsUploadingRcabinet(false);
    },
    onJobNotFound: () => {
      toast.error('処理が見つかりません。セッションをリセットします。', { id: 'session-reset' });
      handleResetConfirm(true);
    },
  });

  const isProcessing = isModalLoading || !!jobId;

  // const { setTitle } = useHeader();

  // useEffect(() => {
  //   setTitle('クーポン画像作成二重価格画像作成');
  // }, [setTitle]);

  // SESSION LOGIC
  const loadSession = useCallback(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const data: SessionData = JSON.parse(savedData);
        if (data.productRows.length > 0) {
          setShowRestorePopup(true);
          return data;
        }
      } catch (e) {
        console.error('Failed to load session:', e);
      }
    }
    return null;
  }, []);

  const saveSession = useCallback(() => {
    const dataToSave: SessionData = {
      productRows,
      jobId,
      jobStatus,
      timestamp: Date.now(),
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
  }, [productRows, jobId, jobStatus]);

  const clearSession = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, []);

  useEffect(() => {
    setIsClient(true);
    const sessionData = loadSession();
    if (!sessionData) setProductRows([createNewProductRow('initial-load')]);
  }, [loadSession]);

  useEffect(() => {
    const handleBeforeUnload = () => saveSession();
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveSession]);

  const handleRestoreSession = useCallback(
    (restore: boolean) => {
      setShowRestorePopup(false);
      if (restore) {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
          const data: SessionData = JSON.parse(savedData);
          setProductRows(data.productRows);
          setJobId(data.jobId);
          setJobStatus(data.jobStatus);
          if (data.jobId) setIsPreviewModalOpen(true);
          toast.success('セッションを復元しました。', { id: 'session-success' });
        }
      } else {
        clearSession();
        setProductRows([createNewProductRow('new-session')]);
      }
    },
    [clearSession],
  );

  // ✅ HANDLE SUBMIT — đã sửa hoàn chỉnh
  const handleSubmit = useCallback(async () => {
    setShowErrors(true);
    const { errors: newErrors, isValid } = validateRows(productRows);

    if (!isValid) {
      setErrors(newErrors);
      toast.error('入力内容にエラーがあります。修正してください。', { id: 'input-error' });
      return;
    }

    setErrors({});
    setShowErrors(false);
    toast.info('画像生成を開始します...', { id: 'submit-job', duration: 3000 });

    try {
      // 🟢 ÉP DỮ LIỆU TRƯỚC KHI GỬI
      const formattedRows = productRows.map((row, index) => ({
        id: Number(row.id ?? index + 1),
        file_name: `coupon_${index + 1}`,
        message1: row.couponText1,
        message2: row.couponText2,
        discount_value: Number(row.discount),
        discount_unit: row.discountType === 'percent' ? '%' : '円',
        template: row.template,
      }));

      console.log('Sending payload:', JSON.stringify({ productRows: formattedRows }, null, 2));

      // 🟢 GỬI REQUEST
      const response = await fetch('http://localhost:8000/tools/10/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productRows: formattedRows }),
      });

      // 🟢 KIỂM TRA PHẢN HỒI
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', response.status, errorText);
        throw new Error('Job submission failed');
      }

      const { jobId: newJobId } = await response.json();

      // 🟢 CẬP NHẬT UI
      setJobId(newJobId);
      setJobStatus(null);
      setVisibleCount(BATCH_SIZE);
      setIsPreviewModalOpen(true);
      toast.success('画像生成 Job を受け付けました。', { id: 'submit-job' });
    } catch (e) {
      toast.error('画像生成 Job の送信に失敗しました。', { id: 'submit-job' });
      console.error('Job submit error:', e);
    }
  }, [productRows]);

  const handleResetConfirm = useCallback(
    (confirm: boolean) => {
      setShowResetPopup(false);
      if (confirm) {
        setProductRows([createNewProductRow('reset')]);
        setErrors({});
        setShowErrors(false);
        setJobId(null);
        setJobStatus(null);
        setIsPreviewModalOpen(false);
        clearSession();
        toast.success('入力内容をリセットしました。', { id: 'input-reset' });
      }
    },
    [clearSession],
  );

  const handleCloseModal = useCallback(() => {
    setIsPreviewModalOpen(false);
    saveSession();
  }, [saveSession]);

  const handleDownloadZip = useCallback(() => {
    if (!jobId || !jobStatus || !isJobFinished(jobStatus.status)) {
      toast.error('画像をダウンロードできません。処理が完了していません。', {
        id: 'download-error',
      });
      return;
    }
    toast.info('ZIPファイルをダウンロードしています...', { id: 'download-pending' });
    console.log(`[Action] Downloading zip for job: ${jobId}`);
  }, [jobId, jobStatus]);

  const handleUploadFTP = useCallback(
    async (target: 'gold' | 'rcabinet') => {
      if (!jobId || !jobStatus || !isJobFinished(jobStatus.status)) {
        toast.error('アップロードできません。画像生成処理が完了していません。', {
          id: 'upload-error',
        });
        return;
      }

      if (target === 'gold') setIsUploadingGold(true);
      if (target === 'rcabinet') setIsUploadingRcabinet(true);

      toast.info(`${target === 'gold' ? 'GOLD' : 'R-Cabinet'} へのアップロードを開始します...`);

      try {
        const response = await fetch(`/api/ftp/upload?jobId=${jobId}&target=${target}`, {
          method: 'POST',
        });
        if (!response.ok) throw new Error('FTP upload failed');
        await response.json();
      } catch (e) {
        toast.error(`FTP アップロードの開始に失敗しました (${target})。`, { id: 'FTP-error' });
        if (target === 'gold') setIsUploadingGold(false);
        if (target === 'rcabinet') setIsUploadingRcabinet(false);
      }
    },
    [jobId, jobStatus],
  );

  return (
    <div className="space-y-6">
      {/* 1. Template Selection */}
      <Card>
        <CardHeader title="1. テンプレート" />
        <CardContent>
          <div className="relative">
            <div className="flex items-start gap-4 overflow-x-auto pb-4">
              {templates.map((template) => (
                <div key={template.id} className="flex-shrink-0 text-center w-auto">
                  <div
                    className="flex items-start gap-2 cursor-pointer"
                    onClick={() => setSelectedImages(template.imgs)}
                  >
                    <img
                      src={`${template.imgs}`}
                      alt={`${template.name}`}
                      className="w-36 h-36 object-cover rounded-lg mb-2 border-2 border-transparent hover:border-primary"
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-700">{template.name}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Product Table */}
      {isClient && (
        <EditableProductTable
          rows={productRows}
          setRows={setProductRows}
          errors={errors}
          showErrors={showErrors}
          isProcessing={isProcessing}
        />
      )}

      {/* 3. Buttons */}
      <div className="flex justify-center pt-4 space-x-4">
        <Button color="secondary" onClick={() => setShowResetPopup(true)} disabled={isProcessing}>
          入力リセット
        </Button>
        <Button color="primary" onClick={handleSubmit} disabled={isProcessing}>
          {isProcessing ? '画像生成処理中...' : 'プレビュー / 画像生成'}
        </Button>
      </div>

      {/* 4. Preview Popup */}
      {selectedImages && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImages(null)}
        >
          <div
            className="flex flex-col md:flex-row items-center justify-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImages}
              alt="Template Preview"
              className="max-w-[45vw] max-h-[80vh] object-contain rounded-md"
            />
          </div>
        </div>
      )}

      {/* 5. Preview Modal */}
      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={handleCloseModal}
        jobStatus={pollingStatus}
        isLoading={isModalLoading}
        productRows={productRows}
        onDownloadZip={handleDownloadZip}
        onUploadFTP={handleUploadFTP}
        isUploadingGold={isUploadingGold}
        isUploadingRcabinet={isUploadingRcabinet}
        visibleCount={visibleCount}
        onLoadMore={() => setVisibleCount((prev) => prev + BATCH_SIZE)}
      />

      {/* 6. Popups */}
      {showRestorePopup && <RestoreSessionPopup onResponse={handleRestoreSession} />}
      {showResetPopup && <ResetConfirmPopup onResponse={handleResetConfirm} />}
    </div>
  );
}
