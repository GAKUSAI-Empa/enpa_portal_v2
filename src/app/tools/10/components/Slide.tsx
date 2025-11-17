'use client';

import { template } from 'lodash';
import React, { useRef } from 'react';
import Slider from 'react-slick';

const Slide = () => {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: false,
    infinite: false,
    speed: 50,
    slidesToShow: 8,
    slidesToScroll: 1,
    autoplay: false,
  };

  let templates = [
    { id: 1, templateName: 'テンプレート1', imgSrc: '/img/tool10/Coupon_No_1.jpg' },
    { id: 2, templateName: 'テンプレート2', imgSrc: '/img/tool10/Coupon_No_4.jpg' },
    { id: 3, templateName: 'テンプレート3', imgSrc: '/img/tool10/Coupon_No_5.jpg' },
    { id: 4, templateName: 'テンプレート4', imgSrc: '/img/tool10/Coupon_No_8.jpg' },
    { id: 5, templateName: 'テンプレート5', imgSrc: '/img/tool10/Coupon_No_9.jpg' },
    { id: 6, templateName: 'テンプレート6', imgSrc: '/img/tool10/Coupon_No_12.jpg' },
    { id: 7, templateName: 'テンプレート7', imgSrc: '/img/tool10/Coupon_No_13.jpg' },
    { id: 8, templateName: 'テンプレート8', imgSrc: '/img/tool10/Coupon_No_16.jpg' },
    { id: 9, templateName: 'テンプレート9', imgSrc: '/img/tool10/Coupon_No_17.jpg' },
    { id: 10, templateName: 'テンプレート10', imgSrc: '/img/tool10/Coupon_No_20.jpg' },
    { id: 11, templateName: 'テンプレート11', imgSrc: '/img/tool10/Coupon_No_21.jpg' },
    { id: 12, templateName: 'テンプレート12', imgSrc: '/img/tool10/Coupon_No_26.jpg' },
    { id: 13, templateName: 'テンプレート13', imgSrc: '/img/tool10/Coupon_No_27.jpg' },
    { id: 14, templateName: 'テンプレート14', imgSrc: '/img/tool10/Coupon_No_30.jpg' },
    { id: 15, templateName: 'テンプレート15', imgSrc: '/img/tool10/Coupon_No_31.jpg' },
    { id: 16, templateName: 'テンプレート16', imgSrc: '/img/tool10/Coupon_No_34.jpg' },
  ];

  return (
    <div className="relative w-full mx-2">
      <Slider ref={sliderRef} {...settings}>
        {templates?.map((item) => (
          <div className="px-1" key={item.id}>
            <img src={item.imgSrc} className="w-[200px] h-[200px] object-cover mx-auto" alt="" />

            <div className="flex justify-center items-center">
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
    </div>
  );
};

export default Slide;
