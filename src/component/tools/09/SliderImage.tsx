"use client";

import { useRef, useState } from "react";
import Slider from "react-slick";

export default function SliderImagereview() {

    const sliderRef = useRef<Slider>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<string>("templateA")
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

    let templateSelect = [
        {
            id: 1,
            templateName: "テンプレートA",
            radioName: "templateSelect",
            imgSrc: "/img/tool09/sample-A.png",
            value: "templateA",
        },
        {
            id: 2,
            templateName: "テンプレートB",
            radioName: "templateSelect",
            imgSrc: "/img/tool09/sample-B.png",
            value: "templateB",
        },
        {
            id: 3,
            templateName: "テンプレートC",
            radioName: "templateSelect",
            imgSrc: "/img/tool09/sample-C.png",
            value: "templateC",
        },
        {
            id: 4,
            templateName: "テンプレートD",
            radioName: "templateSelect",
            imgSrc: "/img/tool09/sample-D.png",
            value: "templateD",
        },
        {
            id: 5,
            templateName: "テンプレートE",
            radioName: "templateSelect",
            imgSrc: "/img/tool09/sample-E.png",
            value: "templateE",
        },

                {
            id: 6,
            templateName: "テンプレートF",
            radioName: "templateSelect",
            imgSrc: "/img/tool09/sample-F.png",
            value: "templateE",
        },
                {
            id: 7,
            templateName: "テンプレートG",
            radioName: "templateSelect",
            imgSrc: "/img/tool09/sample-G.png",
            value: "templateE",
        },
        {
            id: 8,
            templateName: "テンプレートH",
            radioName: "templateSelect",
            imgSrc: "/img/tool09/sample-H.png",
            value: "templateE",
        },
    ]

    return (
        <div className="relative w-full mx-2">
            <Slider ref={sliderRef} {...settings}>
                {templateSelect?.map((item) => (
                    <div className="px-1" key={item.id}>
                       
                        <div className="mb-2 flex justify-center">
                            <img
                               
                                src={item.imgSrc}
                                className="w-auto h-[200px] object-cover"
                                alt={item.templateName}
                            />
                        </div>

                        <div className="flex justify-center items-center">
                            <input
                                id={`template-index-${item.id}`}
                                name={item.radioName}
                                type="radio"
                                value={item.value}
                                checked={selectedTemplate === item.value}
                                onChange={(e) => setSelectedTemplate(e.target.value)}
                                // Thêm className cho input nếu cần styling
                                className="mr-2"
                            />
                            <label htmlFor={`template-index-${item.id}`}>{item.templateName}</label>
                        </div>
                    </div>
                ))}
            </Slider>

            {/* Các nút điều hướng vẫn được giữ nguyên */}
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
}