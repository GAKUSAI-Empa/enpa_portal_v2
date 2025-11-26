'use client';
import { useRef, useState } from 'react';
import Slider from 'react-slick';

interface SliderImagereviewProps {
  value: string; // formik.values.template_id
  onChange: (value: string) => void; // formik.setFieldValue
}

export default function SliderImagereview({ value, onChange }: SliderImagereviewProps) {
  const sliderRef = useRef<Slider>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
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
      imgSrc1: '/img/tool5/rankA1.png',
      imgSrc2: '/img/tool5/rankA2.png',
      value: 'templateA',
    },
    {
      id: 2,
      templateName: 'テンプレートB',
      imgSrc1: '/img/tool5/rankB1.png',
      imgSrc2: '/img/tool5/rankB2.png',
      value: 'templateB',
    },
    {
      id: 3,
      templateName: 'テンプレートC',
      imgSrc1: '/img/tool5/rankC1.png',
      imgSrc2: '/img/tool5/rankC2.png',
      value: 'templateC',
    },
    {
      id: 4,
      templateName: 'テンプレートD',
      imgSrc1: '/img/tool5/rankD1.png',
      imgSrc2: '/img/tool5/rankD2.png',
      value: 'templateD',
    },
  ];

  return (
    <div className="relative w-full mx-2">
      <Slider ref={sliderRef} {...settings}>
        {templateSelect.map((item) => (
          <div className="px-1" key={item.id}>
            <table className="mb-2">
              <tbody>
                <tr>
                  <td>
                    <img
                      src={item.imgSrc1}
                      className="w-[400px] h-[200px] object-cover object-center cursor-pointer"
                      onClick={() => setPreviewImage(item.imgSrc1)}
                      alt=""
                    />
                  </td>
                  <td>
                    <img
                      src={item.imgSrc2}
                      className="w-[400px] h-[200px] object-cover object-center cursor-pointer"
                      onClick={() => setPreviewImage(item.imgSrc2)}
                      alt=""
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-center items-center">
              <input
                id={`template-${item.id}`}
                type="radio"
                name="templateSelect"
                value={item.value}
                checked={value === item.value}
                onChange={(e) => onChange(e.target.value)}
              />
              <label htmlFor={`template-${item.id}`}>{item.templateName}</label>
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
