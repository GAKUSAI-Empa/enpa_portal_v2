'use client';

import { useRef, useState } from 'react';
import Slider from 'react-slick';

const Slide = () => {
  const sliderRef = useRef<Slider>(null);
  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null);

  const settings = {
    dots: false,
    infinite: false,
    speed: 50,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
  };

  let templates = [
    { id: 1, templateName: 'テンプレート1', imgSrc: '/img/tool105/sample_1.png' },
    { id: 2, templateName: 'テンプレート2', imgSrc: '/img/tool105/sample_1.png' },
    { id: 3, templateName: 'テンプレート2', imgSrc: '/img/tool105/sample_1.png' },
    { id: 4, templateName: 'テンプレート2', imgSrc: '/img/tool105/sample_1.png' },
  ];

  return (
    <div className="relative w-full mx-4">
      <Slider ref={sliderRef} {...settings}>
        {templates.map((item) => (
          <div className="px-1" key={item.id}>
            <img
              src={item.imgSrc}
              className="w-full h-auto object-contain mx-auto cursor-pointer"
              alt=""
              onClick={() => setFullscreenImg(item.imgSrc)}
            />
            <div className="flex justify-center items-center mt-1">
              <div>{item.templateName}</div>
            </div>
          </div>
        ))}
      </Slider>

      <button
        onClick={() => sliderRef.current?.slickPrev()}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
      >
        ◀
      </button>

      <button
        onClick={() => sliderRef.current?.slickNext()}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
      >
        ▶
      </button>

      {fullscreenImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 cursor-pointer"
          onClick={() => setFullscreenImg(null)}
        >
          <img src={fullscreenImg} className="max-w-full max-h-full" alt="fullscreen" />
        </div>
      )}
    </div>
  );
};

export default Slide;
