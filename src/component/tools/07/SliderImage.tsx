'use client';

import { useRef, useState } from 'react';
import Slider from 'react-slick';

export default function SliderImagereview() {
  const sliderRef = useRef<Slider>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('templateA');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    variableWidth: false, // Quan trọng: set false để full width
    centerMode: false, // Quan trọng: set false để full width
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1, // trên mobile mỗi slide chỉ 1 item (2 hình vẫn nằm ngang)
        },
      },
    ],
  };

  let templateSelect = [
    {
      id: 1,
      templateName: 'テンプレートA',
      radioName: 'templateSelect',
      imgSrc1: '/img/tool07/A_MINI.jpg',
      imgSrc2: '/img/tool07/A_NOMAL.jpg',
      value: 'templateA',
    },
    {
      id: 2,
      templateName: 'テンプレートB',
      radioName: 'templateSelect',
      imgSrc1: '/img/tool07/B_MINI.jpg',
      imgSrc2: '/img/tool07/B_NOMAL.jpg',
      value: 'templateB',
    },
    {
      id: 3,
      templateName: 'テンプレートC',
      radioName: 'templateSelect',
      imgSrc1: '/img/tool07/C_MINI.jpg',
      imgSrc2: '/img/tool07/C_NOMAL.jpg',
      value: 'templateC',
    },
    {
      id: 4,
      templateName: 'テンプレートD',
      radioName: 'templateSelect',
      imgSrc1: '/img/tool07/D_MINI.jpg',
      imgSrc2: '/img/tool07/D_NOMAL.jpg',
      value: 'templateD',
    },

    {
      id: 5,
      templateName: 'テンプレートE',
      radioName: 'templateSelect',
      imgSrc1: '/img/tool07/E_MINI.jpg',
      imgSrc2: '/img/tool07/E_NOMAL.jpg',
      value: 'templateE',
    },
  ];
  return (
    <div className="relative w-full mx-2">
      <Slider ref={sliderRef} {...settings}>
        {templateSelect?.map((item, index) => (
          <div className="px-1" key={item.id}>
            <table className="mb-2">
              <tbody>
                <tr>
                  <td>
                    <img
                      src={item.imgSrc1}
                      className="w-[400px] h-[200px] object-cover object-center"
                      alt=""
                      onClick={() => setPreviewImage(item.imgSrc1)}
                    />
                  </td>
                  <td>
                    <img
                      src={item.imgSrc2}
                      className="w-[400px] h-[200px] object-cover object-center"
                      alt=""
                      onClick={() => setPreviewImage(item.imgSrc2)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-center items-center">
              <input
                id={`template-index-${item.id}`}
                name={item.radioName}
                type="radio"
                value={item.value}
                checked={selectedTemplate === item.value}
                onChange={(e) => setSelectedTemplate(e.target.value)}
              />
              <label htmlFor={`template-index-${item.id}`}>{item.templateName}</label>
            </div>
          </div>
        ))}
      </Slider>

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
      {/* 🟢 Popup hiển thị ảnh lớn */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="preview"
            className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} // để click vào ảnh không đóng popup
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
