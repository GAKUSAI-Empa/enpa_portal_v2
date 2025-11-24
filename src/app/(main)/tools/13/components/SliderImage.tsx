'use client';

import { useCallback, useRef, useState } from 'react';
import Slider from 'react-slick';

// テンプレートデータの型定義
type TemplateItem = {
  id: number;
  templateName: string;
  radioName: string;
  imgSrc: string;
  value: string; // ラジオボタンの値
};

const templateSelect: TemplateItem[] = [
  {
    id: 1,
    templateName: 'テンプレートA',
    radioName: 'templateSelect',
    imgSrc: '/img/tool13/sample-A.png',
    value: 'templateA',
  },
  {
    id: 2,
    templateName: 'テンプレートB',
    radioName: 'templateSelect',
    imgSrc: '/img/tool13/sample-B.png',
    value: 'templateB',
  },
  {
    id: 3,
    templateName: 'テンプレートC',
    radioName: 'templateSelect',
    imgSrc: '/img/tool13/sample-C.png',
    value: 'templateC',
  },
  {
    id: 4,
    templateName: 'テンプレートD',
    radioName: 'templateSelect',
    imgSrc: '/img/tool13/sample-D.png',
    value: 'templateD',
  },
  {
    id: 5,
    templateName: 'テンプレートE',
    radioName: 'templateSelect',
    imgSrc: '/img/tool13/sample-E.png',
    value: 'templateE',
  },
  // valueが重複していたため、修正しました (元のコードではE, E, E, Eとなっていたため、F, G, Hに変更)
  {
    id: 6,
    templateName: 'テンプレートF',
    radioName: 'templateSelect',
    imgSrc: '/img/tool13/sample-F.png',
    value: 'templateF',
  },
  {
    id: 7,
    templateName: 'テンプレートG',
    radioName: 'templateSelect',
    imgSrc: '/img/tool13/sample-G.png',
    value: 'templateG',
  },
  {
    id: 8,
    templateName: 'テンプレートH',
    radioName: 'templateSelect',
    imgSrc: '/img/tool13/sample-H.png',
    value: 'templateH',
  },
];

export default function SliderImagereview() {
  const sliderRef = useRef<Slider>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('templateA');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // react-slick の設定
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: false,
    variableWidth: false,
    centerMode: false,
    responsive: [
      {
        breakpoint: 768, // 768px以下の場合
        settings: {
          slidesToShow: 1,
        },
      },
      // 適切なブレークポイントを追加しても良いでしょう (例: PC/Tablet/Mobile)
    ],
  };

  // スライダーの次のスライドへ移動
  const goToNext = useCallback(() => {
    sliderRef.current?.slickNext();
  }, []);

  // スライダーの前のスライドへ移動
  const goToPrev = useCallback(() => {
    sliderRef.current?.slickPrev();
  }, []);

  // プレビュー表示を閉じる
  const closePreview = useCallback(() => {
    setPreviewImage(null);
  }, []);

  return (
    <div className="relative w-full mx-2">
      <Slider ref={sliderRef} {...settings}>
        {templateSelect.map((item) => (
          <div className="px-1" key={item.id}>
            {/* 画像部分 */}
            <div className="mb-2 flex justify-center cursor-pointer">
              <img
                src={item.imgSrc}
                className="w-auto h-[200px] object-cover"
                onClick={() => setPreviewImage(item.imgSrc)} // 画像クリックでプレビュー表示
                alt={item.templateName} // alt属性を追加
              />
            </div>

            {/* ラジオボタンとラベル */}
            <div className="flex justify-center items-center">
              <input
                id={`template-index-${item.id}`}
                name={item.radioName}
                type="radio"
                value={item.value}
                checked={selectedTemplate === item.value}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" // Tailwind CSSのクラスを追加
              />
              <label
                htmlFor={`template-index-${item.id}`}
                className="text-sm font-medium text-gray-700 select-none cursor-pointer" // Tailwind CSSのクラスを追加
              >
                {item.templateName}
              </label>
            </div>
          </div>
        ))}
      </Slider>

      {/* --- スライダーナビゲーションボタン --- */}
      <button
        type="button"
        onClick={goToPrev}
        className="absolute top-1/2 left-0 md:left-2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-10 transition duration-150 ease-in-out"
        aria-label="前のスライド"
      >
        ◀
      </button>
      <button
        type="button"
        onClick={goToNext}
        className="absolute top-1/2 right-0 md:right-2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-10 transition duration-150 ease-in-out"
        aria-label="次のスライド"
      >
        ▶
      </button>

      {/* --- プレビューモーダル --- */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4"
          onClick={closePreview} // 外側クリックで閉じる
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()} // 画像クリックでは閉じない
          >
            <img
              src={previewImage}
              alt="プレビュー画像"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={closePreview}
              className="absolute top-2 right-2 text-white text-4xl font-light opacity-90 hover:opacity-100 transition duration-150"
              aria-label="プレビューを閉じる"
            >
              &times; {/* '✕' の代わりに '&times;' を使用 */}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
