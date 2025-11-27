'use client';
import { Button } from '@/component/common/Button';
import { IconLoader2 } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface ReviewModalProps {
  reviewHtml: string;
  handleCloseReviewModal: () => void;
}
const ReviewModal = ({ reviewHtml, handleCloseReviewModal }: ReviewModalProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [successUpload, setSuccessUpload] = useState(false);
  const [code, setCode] = useState('');

  const uploadToRakutenGold = async () => {
    try {
      setLoading(true);
      setSuccessUpload(false);
      const uploadRakutenHtml = reviewHtml.replace(/<base[^>]*>/i, '');

      const res = await fetch('/api/tools/103', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: 'header_103.html', content: uploadRakutenHtml }),
      });
      const data = await res.json();
      console.log(data);
      toast.success(data.message);
      setSuccessUpload(true);
      createSourceCode();
    } catch (err) {
      setSuccessUpload(false);
      toast.error('アップロード中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  const createSourceCode = () => {
    const iframeCode = [
      '<iframe',
      `  src="https://www.rakuten.ne.jp/gold/auc-ronnefeldt/public_html/tools/103/header_103.html"`,
      '  frameborder="0"',
      '  style="width: 100%; height: 2000px"',
      '  sandbox="allow-same-origin allow-scripts allow-popups allow-top-navigation"',
      '></iframe>',
    ].join('\n');
    setCode(iframeCode);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('コードをクリップボードにコピーしました！');
    } catch (err) {
      toast.error('コードのコピーに失敗しました。');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {!successUpload ? (
        <div className="bg-white rounded-xl shadow-lg w-full max-w-[90%] max-h-[90vh] overflow-auto p-6">
          <h2 className="text-lg font-semibold mb-4">プレビュー</h2>
          <div className="mb-4">
            <iframe
              srcDoc={reviewHtml}
              className="bg-white w-full h-[50vh] sm:h-[400px] md:h-[500px] lg:h-[600px] border rounded-md overflow-auto"
              sandbox="allow-same-origin allow-scripts allow-popups allow-top-navigation"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button color="grey" onClick={handleCloseReviewModal}>
              キャンセル
            </Button>
            <Button disabled={loading} onClick={uploadToRakutenGold}>
              {loading ? <IconLoader2 className="animate-spin" /> : <>Rakutenにアップロード</>}
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg w-full max-w-[90%] max-h-[90vh] overflow-auto p-6">
          <h2 className="text-lg font-semibold mb-4">結果</h2>
          <div className="mb-4">
            {/* title */}
            <h2 className="text-center text-lg font-bold mb-4">ヘッダーの生成が完了しました！</h2>

            {/* description */}
            <p className="text-center text-sm text-gray-600 mb-4">
              以下のコードをコピーし、RMSのヘッダー設定画面に貼り付けてください。
            </p>
            {/* code box */}
            <textarea
              readOnly={true}
              value={code}
              className="w-full h-40 p-3 text-sm font-mono whitespace-pre border border-gray-300 rounded resize-none bg-gray-50"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              onClick={() => router.push('/')}
              className="bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              ホームに戻る
            </Button>
            <Button onClick={() => handleCopy()} color="primary">
              コードをコピー
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewModal;
