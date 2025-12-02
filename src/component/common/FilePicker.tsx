// components/FilePicker.tsx
'use client';

import { useRef, useState } from 'react';

type FilePickerProps = {
  accept?: string;
  onChange?: (file: File | null) => void;
};

export default function FilePicker({ accept, onChange }: FilePickerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>('ファイルが選択されていません');

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileName(file ? file.name : 'ファイルが選択されていません');
    onChange?.(file);
  };

  return (
    <div className="flex items-center border border-gray-300 rounded p-2 gap-3 w-full max-w-md">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleClick}
        className="border border-red-300 text-red-500 px-3 py-1 rounded text-sm hover:bg-red-50 transition"
      >
        ファイルを選択する
      </button>

      {/* text hiển thị tên file */}
      <span className="text-sm text-gray-600 truncate">{fileName}</span>
    </div>
  );
}
