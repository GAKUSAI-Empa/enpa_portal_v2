'use client';
import { useRef, useState } from 'react';
import Slider from 'react-slick';

interface SliderImageProps {
  value: string; // formik.values.template_id
  onChange: (value: string) => void; // formik.setFieldValue
}

export default function SliderImage({ value, onChange }: SliderImageProps) {
  const sliderRef = useRef<Slider>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const templateSelect = [
    {
      id: 1,
      templateName: 'テンプレートA',
      imgSrc: '/img/tool000/template1.png',
      value: 'templateA',
    },
    {
      id: 2,
      templateName: 'テンプレートB',
      imgSrc: '/img/tool000/template2.png',
      value: 'templateB',
    },
    {
      id: 3,
      templateName: 'テンプレートC',
      imgSrc: '/img/tool000/template3.png',
      value: 'templateC',
    },
    {
      id: 4,
      templateName: 'テンプレートD',
      imgSrc: '/img/tool000/template4.png',
      value: 'templateD',
    },
    {
      id: 5,
      templateName: 'テンプレートE',
      imgSrc: '/img/tool000/template5.png',
      value: 'templateE',
    },
  ];

  return (
    <div className="relative w-full mx-4">
      <Slider ref={sliderRef} {...settings}>
        {templateSelect.map((item) => (
          <div className="px-1" key={item.id}>
            <img
              src={item.imgSrc}
              alt={item.templateName}
              className="w-[200px] h-[200px] object-cover mx-auto cursor-pointer"
              onClick={() => setPreviewImage(item.imgSrc)}
            />

            <div className="flex justify-center items-center mt-2">
              <input
                id={`template-${item.id}`}
                type="radio"
                name="templateSelect"
                value={item.value}
                checked={value === item.value}
                onChange={(e) => onChange(e.target.value)}
              />
              <label htmlFor={`template-${item.id}`} className="ml-2">
                {item.templateName}
              </label>
            </div>
          </div>
        ))}
      </Slider>

      {/* Nút điều hướng */}
      <button
        type="button"
        onClick={() => sliderRef.current?.slickPrev()}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
      >
        ◀
      </button>
      <button
        type="button"
        onClick={() => sliderRef.current?.slickNext()}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
      >
        ▶
      </button>

      {/* Popup ảnh lớn */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="preview"
            className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-5 right-5 text-white text-3xl"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
