'use client';

import { createContext, ReactNode, useState } from 'react';
import { Button } from './Button';
import { Card, CardContent } from './Card';

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmationText?: string;
  cancellationText?: string;
};

type ConfirmContextType = (options: ConfirmOptions) => Promise<void>;

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export let confirm: ConfirmContextType = async () => {
  throw new Error('ConfirmProvider is missing.');
};

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const [resolver, setResolver] = useState<(value: void) => void>();
  const [rejecter, setRejecter] = useState<(reason?: any) => void>();

  const showConfirm = (opts: ConfirmOptions) => {
    setOptions(opts);
    setOpen(true);

    return new Promise<void>((resolve, reject) => {
      setResolver(() => resolve);
      setRejecter(() => reject);
    });
  };

  // gán function confirm toàn cục để dùng: await confirm(...)
  confirm = showConfirm;

  const handleConfirm = () => {
    setOpen(false);
    resolver && resolver();
  };

  const handleCancel = () => {
    setOpen(false);
    rejecter && rejecter(new Error('Cancelled'));
  };

  return (
    <>
      {children}

      {open && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <Card className="w-[90%] max-w-[450px]">
            <CardContent className="pt-6">
              {options?.title && (
                <h2 className="text-xl font-semibold mb-4 text-center">{options.title}</h2>
              )}

              <p className="mb-6 text-center whitespace-pre-line">
                {options.description || 'よろしいですか？'}
              </p>

              <div className="flex justify-center gap-4">
                <Button onClick={handleCancel}>{options.cancellationText || 'キャンセル'}</Button>
                <Button onClick={handleConfirm}>{options.confirmationText || '確認'}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
