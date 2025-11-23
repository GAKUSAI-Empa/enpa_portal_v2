'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Alert } from '@/component/common/Alert';
import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import { IconLoader2, IconRefresh } from '@tabler/icons-react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { Toaster, toast } from 'sonner';
import useTool101API from './api/useTool101API';

// コンポーネントとロジックの分離
import EditableProductTable, {
  EditableProductTableHandle,
} from './components/EditableProductTable';
import PreviewModal from './components/PreviewModal';
import ResetConfirmPopup from './components/ResetConfirmPopup';
import RestoreSessionPopup from './components/RestoreSessionPopup';
import { templates } from './constants';
import { useJobPolling } from './hooks/useJobPolling';
import { createNewProductRow } from './lib/utils';
import type { AllErrors, ProductRow } from './types';

type SonnerToastId = string | number;

const LOCAL_STORAGE_KEY = 'tool101_session_data_v2';

const BATCH_SIZE = 10;

export default function TwoPriceImagePage() {
  // Khởi tạo Hook ở ngay đầu Component
  const tool101API = useTool101API();

  // Ref để gọi validation từ EditableProductTable
  const tableRef = useRef<EditableProductTableHandle>(null);

  // --- State の宣言 ---
  const [isClient, setIsClient] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[] | null>(null);
  const [errors, setErrors] = useState<AllErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  const [productRows, setProductRows] = useState<ProductRow[]>([]);
  const [globalAlert, setGlobalAlert] = useState<string | null>(null);
  const [modifiedRowIds, setModifiedRowIds] = useState<Set<string>>(new Set());
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [isApiLoading, setIsApiLoading] = useState(false);

  // --- LAZY LOAD (START) ---
  // 表示を許可する画像数を追跡する State
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  // セッション復元
  const [showRestorePopup, setShowRestorePopup] = useState(false);
  const [restoredData, setRestoredData] = useState<ProductRow[] | null>(null);
  const initialLoadRef = useRef(true);

  // リセット確認ポップアップ
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const goldUploadToastIdRef = useRef<SonnerToastId | null>(null);
  const rcabinetUploadToastIdRef = useRef<SonnerToastId | null>(null);

  // --- FTP用コールバック ---
  const handleFtpSuccess = useCallback((target: 'gold' | 'rcabinet', message: string) => {
    const toastIdRef = target === 'gold' ? goldUploadToastIdRef : rcabinetUploadToastIdRef;
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
    toast.success(message);
  }, []);
  const handleFtpError = useCallback((target: 'gold' | 'rcabinet', message: string) => {
    const toastIdRef = target === 'gold' ? goldUploadToastIdRef : rcabinetUploadToastIdRef;
    if (toastIdRef.current) {
      toast.error(message, { id: toastIdRef.current });
      toastIdRef.current = null;
    } else {
      toast.error(message);
    }
  }, []);

  // -----------------------------------

  // --- ポーリング用カスタムフック ---
  const handleJobNotFound = useCallback(() => {
    setJobId(null);
    setGlobalAlert('現在のジョブが見つかりませんでした。新しいジョブを開始します。');
    if (goldUploadToastIdRef.current) {
      toast.dismiss(goldUploadToastIdRef.current);
      goldUploadToastIdRef.current = null;
    }
    if (rcabinetUploadToastIdRef.current) {
      toast.dismiss(rcabinetUploadToastIdRef.current);
      rcabinetUploadToastIdRef.current = null;
    }
  }, []);

  const {
    jobStatus,
    setJobStatus,
    isLoading: isPollingLoading,
    stopPolling,
  } = useJobPolling({
    jobId,
    isOpen: isPreviewModalOpen,
    onJobNotFound: handleJobNotFound,
    onFtpSuccess: handleFtpSuccess,
    onFtpError: handleFtpError,
  });
  //------------------------------------

  // --- localStorage ロジック ---
  const saveStateToLocalStorage = useCallback(
    debounce((rowsToSave: ProductRow[]) => {
      try {
        const isDefaultEmptyRow =
          rowsToSave.length === 1 &&
          !rowsToSave[0].productCode &&
          !rowsToSave[0].startDate &&
          !rowsToSave[0].endDate &&
          !rowsToSave[0].regularPrice &&
          !rowsToSave[0].salePrice;

        if (!isDefaultEmptyRow) {
          console.log('[LocalStorage] 状態を保存中...', `(${rowsToSave.length} 行)`);
          const dataString = JSON.stringify(rowsToSave);
          localStorage.setItem(LOCAL_STORAGE_KEY, dataString);
        } else {
          console.log('[LocalStorage] デフォルトの空行を検出、ストレージから削除します。');
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      } catch (error) {
        console.error('localStorage への状態保存エラー:', error);
        toast.error(
          'セッションデータの保存中にエラーが発生しました。ストレージがいっぱいかもしれません。',
        );
      }
    }, 1500),
    [],
  );

  useEffect(() => {
    if (!initialLoadRef.current && isClient && productRows.length > 0) {
      saveStateToLocalStorage(productRows);
    }
  }, [productRows, saveStateToLocalStorage, isClient]);

  useEffect(() => {
    setIsClient(true);
    if (initialLoadRef.current) {
      try {
        const savedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedDataString) {
          const parsedData: ProductRow[] = JSON.parse(savedDataString);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            setRestoredData(parsedData);
            setShowRestorePopup(true);
            console.log(
              '[LocalStorage] 保存されたセッションを発見、復元ポップアップを表示します。',
            );
          } else {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            initializeEmptyRow();
          }
        } else {
          initializeEmptyRow();
        }
      } catch (error) {
        console.error('localStorage からの状態読み込みエラー:', error);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        initializeEmptyRow();
        toast.error('保存されたセッションデータの読み込み中にエラーが発生しました。');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- 空行の初期化ロジック ---
  const initializeEmptyRow = (idPrefix = 'initial-load-empty') => {
    console.log(`[Session] 空行で初期化します (prefix: ${idPrefix}).`);
    const initialRow = createNewProductRow(idPrefix);
    setProductRows([initialRow]);
    setModifiedRowIds(new Set([initialRow.id]));
    setJobId(null);
    setJobStatus(null);
    setGlobalAlert(null);
    setShowErrors(false);
    setErrors({});
    clearSavedSession();
    initialLoadRef.current = false;
  };
  // ----------------------------------------------

  const handleRestoreSession = (restore: boolean) => {
    setShowRestorePopup(false);
    if (restore && restoredData) {
      console.log('[LocalStorage] セッションを復元しています...');
      setProductRows(restoredData);
      setModifiedRowIds(new Set(restoredData.map((r) => r.id)));
      toast.success('前のセッションを復元しました。');
    } else {
      console.log('[LocalStorage] 新しいセッションを開始します。');
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      initializeEmptyRow('initial-new-session');
    }
    setRestoredData(null);
    initialLoadRef.current = false;
  };

  const clearSavedSession = useCallback(() => {
    console.log('[LocalStorage] 保存されたセッションをクリアします。');
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, []);
  // --- localStorage ロジック終了 ---

  // --- handleSetProductRows ロジック ---
  const handleSetProductRows = useCallback(
    (newRowsOrFn: ProductRow[] | ((prev: ProductRow[]) => ProductRow[])) => {
      setProductRows((prevRows) => {
        let newRows: ProductRow[];
        let operation: 'set' | 'append' | 'delete' | 'reset' | 'unknown' = 'unknown';

        if (typeof newRowsOrFn !== 'function') {
          newRows = newRowsOrFn;
          operation = 'set';
        } else {
          newRows = newRowsOrFn(prevRows);
          if (newRows.length > prevRows.length) {
            operation = 'append';
          } else if (
            prevRows.length === 1 &&
            newRows.length === 1 &&
            prevRows[0].id !== newRows[0].id
          ) {
            operation = 'reset';
          } else {
            operation = 'delete';
          }
        }

        const currentIds = new Set(newRows.map((r) => r.id));
        setModifiedRowIds((prevModified) => {
          const nextModified = new Set(prevModified);

          prevModified.forEach((id) => {
            if (!currentIds.has(id)) {
              nextModified.delete(id);
            }
          });

          if (operation === 'set') {
            nextModified.clear();
            newRows.forEach((r) => nextModified.add(r.id));
            setJobId(null);
            setJobStatus(null);
            clearSavedSession();
          } else if (operation === 'append') {
            const addedRows = newRows.slice(prevRows.length);
            addedRows.forEach((row) => nextModified.add(row.id));
          } else if (operation === 'reset') {
            nextModified.clear();
            nextModified.add(newRows[0].id);
            setJobId(null);
            setJobStatus(null);
            clearSavedSession();
          }

          return nextModified;
        });

        return newRows;
      });
    },
    [setJobStatus, clearSavedSession],
  );
  // -----------------------------------------------------------

  const handleCloseModal = useCallback(() => {
    setIsPreviewModalOpen(false);
    setIsApiLoading(false);
    stopPolling();
    setVisibleCount(BATCH_SIZE);
    if (goldUploadToastIdRef.current) {
      toast.dismiss(goldUploadToastIdRef.current);
      goldUploadToastIdRef.current = null;
    }
    if (rcabinetUploadToastIdRef.current) {
      toast.dismiss(rcabinetUploadToastIdRef.current);
      rcabinetUploadToastIdRef.current = null;
    }
    if (jobStatus?.status === 'COMPLETED') {
      clearSavedSession();
    }
  }, [stopPolling, jobStatus, clearSavedSession]);

  const handleResetClick = () => {
    if (
      productRows.length === 1 &&
      !productRows[0].productCode &&
      !productRows[0].startDate &&
      !productRows[0].regularPrice
    ) {
      toast.info('テーブルは既に空です。');
      return;
    }
    setShowResetConfirm(true);
  };

  const handleResetConfirm = (confirm: boolean) => {
    setShowResetConfirm(false);
    if (confirm) {
      initializeEmptyRow('manual-reset');
      toast.success('テーブルをリセットしました。');
    }
  };

  // handlePreviewClick 関数
  const handlePreviewClick = async () => {
    setGlobalAlert(null);

    // Gọi triggerValidation từ Ref
    let isValid = false;
    if (tableRef.current) {
      isValid = await tableRef.current.triggerValidation();
    }

    // Kiểm tra kết quả trả về từ triggerValidation
    if (!isValid) {
      setGlobalAlert('入力内容にエラーがあります。確認してください。');
      return;
    }

    clearSavedSession();
    setIsApiLoading(true);
    setIsPreviewModalOpen(true);
    setShowErrors(false);
    setVisibleCount(BATCH_SIZE);

    try {
      let currentJobId = jobId;
      if (!currentJobId) {
        // --- POST ロジック (新規ジョブ作成) ---
        console.log('>>> [DEBUG][Page] 新規ジョブを作成中 (POST)');

        const data = await tool101API.createJob(productRows);
        const newJobId = data.jobId;

        setJobId(newJobId);
        setJobStatus({
          jobId: newJobId,
          status: 'PENDING',
          progress: 0,
          total: data.totalItems,
          results: {},
          startTime: Date.now() / 1000,
          endTime: null,
          message: null,
          ftpUploadStatusGold: 'idle',
          ftpUploadErrorGold: null,
          ftpUploadStatusRcabinet: 'idle',
          ftpUploadErrorRcabinet: null,
        });
        setIsApiLoading(false);
        setModifiedRowIds(new Set());
        console.log('>>> [DEBUG][Page] 新規ジョブ作成完了, Job ID:', newJobId);
      } else {
        // --- PATCH ロジック (ジョブ更新) ---
        console.log('>>> [DEBUG][Page] ジョブを更新中 (PATCH), Job ID:', currentJobId);
        console.log('>>> [DEBUG] PATCH フィルター前の modifiedRowIds:', modifiedRowIds);
        const rowsToUpdate = productRows.filter((row) => modifiedRowIds.has(row.id));
        console.log('>>> [DEBUG] PATCH 対象の rowsToUpdate:', rowsToUpdate);

        if (rowsToUpdate.length > 0) {
          setJobStatus((prev) => ({
            jobId: currentJobId!,
            startTime: prev?.startTime ?? Date.now() / 1000,
            status: 'Processing',
            progress: 0,
            total: productRows.length,
            results: prev?.results ?? {},
            message: null,
            endTime: null,
            ftpUploadStatusGold: 'idle',
            ftpUploadErrorGold: null,
            ftpUploadStatusRcabinet: 'idle',
            ftpUploadErrorRcabinet: null,
          }));

          await tool101API.updateJob(currentJobId, rowsToUpdate);

          setIsApiLoading(false);
          setModifiedRowIds(new Set());
          console.log(
            '>>> [DEBUG][Page] ジョブ更新を開始しました。ポーリングが続行/再開されます。',
          );
        } else {
          console.log('>>> [DEBUG][Page] 変更された行がないため、PATCH をスキップします。');
          setIsApiLoading(false);
        }
      }
    } catch (error) {
      console.error('ジョブの開始または更新に失敗しました:', error);
      let errorMessage = '不明なエラー';
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(`ジョブの開始/更新に失敗しました: ${errorMessage}`);
      setIsApiLoading(false);
      setIsPreviewModalOpen(false);
    }
  };

  const handleDownloadZip = async () => {
    if (!jobId || jobStatus?.status === 'FAILED') {
      toast.error('ダウンロードするジョブが見つからないか、失敗しました。');
      return;
    }

    const toastId = toast.loading('ダウンロードを準備中...');

    try {
      const blob = await tool101API.downloadZip(jobId);
      const url = window.URL.createObjectURL(new Blob([blob]));

      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const fileName = `${yyyy}${mm}${dd}_image.zip`;

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.dismiss(toastId);
      toast.success('ダウンロードを開始しました');
    } catch (error) {
      console.error('Download error:', error);
      toast.dismiss(toastId);
      toast.error('ダウンロードに失敗しました。権限を確認してください。');
    }
  };

  const handleUploadFTP = async (target: 'gold' | 'rcabinet') => {
    if (
      !jobId ||
      !jobStatus ||
      !['COMPLETED', 'COMPLETED_WITH_ERRORS'].includes(jobStatus.status)
    ) {
      toast.error('アップロードするジョブが見つからないか、まだ完了していません。');
      return;
    }
    const targetName = target === 'gold' ? 'Rakuten GOLD' : 'R-Cabinet';
    const toastIdRef = target === 'gold' ? goldUploadToastIdRef : rcabinetUploadToastIdRef;
    const ftpStatusKey = target === 'gold' ? 'ftpUploadStatusGold' : 'ftpUploadStatusRcabinet';
    const ftpErrorKey = target === 'gold' ? 'ftpUploadErrorGold' : 'ftpUploadErrorRcabinet';

    if (toastIdRef.current || jobStatus[ftpStatusKey] === 'UPLOADING') {
      toast.info(`${targetName} へのアップロードは既に進行中です。`);
      return;
    }

    setJobStatus((prev) =>
      prev ? { ...prev, [ftpStatusKey]: 'uploading', [ftpErrorKey]: null } : null,
    );
    toastIdRef.current = toast.loading(`${targetName} へのアップロードを開始しています...`);

    try {
      await tool101API.uploadFTP(jobId, target);

      console.log(
        `>>> [DEBUG][Page] ${targetName} アップロード開始。ポーリングでステータスを追跡します。`,
      );
    } catch (error: any) {
      console.error(`${target} アップロードの開始に失敗:`, error);

      let errorMessage = '不明なエラー';
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage =
            error.response.data?.detail || `HTTPエラー! status: ${error.response.status}`;
        } else if (error.request) {
          errorMessage = 'サーバーからの応答がありません。ネットワーク接続を確認してください。';
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (toastIdRef.current) {
        toast.error(`${targetName} へのアップロード開始に失敗しました: ${errorMessage}`, {
          id: toastIdRef.current,
        });
        toastIdRef.current = null;
      }
      setJobStatus((prev) =>
        prev ? { ...prev, [ftpStatusKey]: 'failed', [ftpErrorKey]: errorMessage } : null,
      );
    }
  };
  // ---------------------------------

  const isModalLoading = isApiLoading || isPollingLoading;

  const isJobRunning = jobStatus?.status === 'Processing' || jobStatus?.status === 'PENDING';
  const isProcessing = isApiLoading || (isPollingLoading && !jobStatus) || isJobRunning;

  // --- JSX Return ---
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-800">二重価格セール画像生成</h1>
      {/* テンプレート選択 */}
      <Card>
        <CardHeader title="テンプレート種類" />
        <CardContent>
          <div className="relative">
            <div className="flex items-start gap-4 overflow-x-auto pb-4">
              {templates.map((template) => (
                <div key={template.id} className="flex-shrink-0 text-center w-auto">
                  <div
                    className="flex items-start gap-2 cursor-pointer"
                    onClick={() => setSelectedImages(template.imgs)}
                  >
                    {template.imgs.map((imgSrc, index) => (
                      <img
                        key={index}
                        src={imgSrc}
                        alt={`${template.name} part ${index + 1}`}
                        className="w-36 h-36 object-cover rounded-lg mb-2 border-2 border-transparent hover:border-primary"
                      />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-gray-700">{template.name}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 編集可能テーブル */}
      {isClient && !showRestorePopup && (
        <EditableProductTable
          ref={tableRef} // Gắn Ref vào đây
          rows={productRows}
          setRows={handleSetProductRows}
          errors={errors}
          showErrors={showErrors}
          setModifiedRowIds={setModifiedRowIds}
          jobId={jobId}
          setJobId={setJobId}
          disabled={isProcessing && isPreviewModalOpen}
        />
      )}
      {isClient && showRestorePopup && (
        <div className="text-center p-10 text-gray-500">セッションデータを読み込み中...</div>
      )}

      {/* グローバルアラート */}
      {globalAlert && <Alert variant="error">{globalAlert}</Alert>}

      {/* ボタン群 (更新) */}
      {!showRestorePopup && (
        <div className="flex justify-center items-center space-x-4 pt-4">
          <Button
            color="secondary"
            onClick={handleResetClick}
            disabled={isProcessing && isPreviewModalOpen}
            className="inline-flex items-center"
          >
            <IconRefresh size={18} className="mr-1.5" />
            リセット
          </Button>
          <Button
            color="primary"
            onClick={handlePreviewClick}
            disabled={isProcessing && isPreviewModalOpen}
            className="inline-flex items-center"
          >
            {isProcessing && isPreviewModalOpen ? (
              <IconLoader2 className="animate-spin mr-2" />
            ) : null}
            画像生成
          </Button>
        </div>
      )}

      {/* テンプレートプレビューモーダル */}
      {selectedImages && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImages(null)}
        >
          <div
            className="flex flex-col md:flex-row items-center justify-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedImages.map((imgSrc, index) => (
              <img
                key={index}
                src={imgSrc}
                alt={`Template Preview ${index + 1}`}
                className="max-w-[45vw] max-h-[80vh] object-contain rounded-md"
              />
            ))}
          </div>
        </div>
      )}

      {/* 生成画像プレビューモーダル */}
      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={handleCloseModal}
        jobStatus={jobStatus}
        isLoading={isModalLoading}
        productRows={productRows}
        onDownloadZip={handleDownloadZip}
        onUploadFTP={handleUploadFTP}
        isUploadingGold={jobStatus?.ftpUploadStatusGold === 'UPLOADING'}
        isUploadingRcabinet={jobStatus?.ftpUploadStatusRcabinet === 'UPLOADING'}
        visibleCount={visibleCount}
        onLoadMore={() => setVisibleCount((prev) => prev + BATCH_SIZE)}
      />

      {/* セッション復元ポップアップ */}
      {showRestorePopup && <RestoreSessionPopup onResponse={handleRestoreSession} />}

      {/* Reset popup */}
      {showResetConfirm && <ResetConfirmPopup onResponse={handleResetConfirm} />}

      {/* Sonner Toaster */}
      <Toaster richColors position="top-right" />
    </div>
  );
}
