import React, { useState } from 'react';

const ButtonCustom = () => {
  const [file, setFile] = useState<File | null>(null);
  const defaultFileName = 'ファイルが選択されていません';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleExecute = () => {
    if (!file) {
      alert('ファイルを選択してください。');
      return;
    }
    console.log('実行中:', file.name);
  };

  return (
    <>
      <div className="flex flex-row justify-center items-center mb-4">
        <div className="flex flex-row">
          <label
            className="px-2 font-medium text-red-600 border border-red-600 rounded-l-lg flex items-center"
            htmlFor="fileInput"
          >
            ファイルを選択する
          </label>
          <input
            type="file"
            id="fileInput"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
          <span
            className={`w-[500px] block border border-gray-300 p-2 text-blue-600 rounded-r-lg ${file ? 'has-file' : ''}`}
          >
            {file ? file.name : defaultFileName}
          </span>
        </div>
        <div className="flex justify-center mb-2">
          <button
            className="bg-red-600
                      text-white
                      font-semibold
                      py-2 px-5
                      border-none
                      rounded-lg
                      cursor-pointer
                      transition
                      duration-200
                      ml-8
                      hover:bg-red-700"
            onClick={handleExecute}
          >
            実行
          </button>
        </div>
      </div>
    </>
  );
};

export default ButtonCustom;
