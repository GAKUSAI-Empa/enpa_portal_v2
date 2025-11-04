/**Huyen */

"use client"

import { Button } from '@/component/common/Button'
import { Card, CardContent, CardHeader } from '@/component/common/Card'
import SelectBox from '@/component/common/SelectBox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/component/common/Tabs'
import { TextBox } from '@/component/common/TextBox'
import SliderImagereview from '@/component/tools/07/SliderImage'
import { CheckBoxGroup } from '@/component/common/CheckBox'
import { useRef, useState } from "react";
import React, { useEffect } from 'react'
import { useHeader } from '@/app/context/HeaderContext'
import RadioBox from '@/component/common/RadioBox'
import { useFormik } from 'formik';
import * as Yup from 'yup';

const cn = (...classes: (string | boolean | null | undefined)[]) => classes.filter(Boolean).join(' ');
const page = () => {

    const { setTitle } = useHeader();

    useEffect(() => {
        setTitle("レビュー評価バナー自動掲載");
    }, [setTitle]);

    const [imagePositionPc, setImagePositionPc] = useState<string[]>([]); // Mặc định là k tich chon
    const [imagePositionSp, setImagePositionSp] = useState<string[]>([]);

    const [selectedImages, setSelectedImages] = useState<string[] | null>(null);
    return (
        <>
            <Tabs defaultTab="tab1">

                <TabsContent value="tab1">
                    <Card>
                        <CardHeader title='1.テンプレート選択' />
                        <CardContent>
                            <SliderImagereview />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader title='2.詳細設定' />
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 my-5">
                                <TextBox
                                    label='掲載されるための最低レビュー件数'
                                    id=''
                                    name=''
                                    value={''}
                                    // width={'sm'}
                                    direction='horizontal'
                                    readOnly={true}
                                />

                                <TextBox
                                    label='レビュー件数表示のための最低レビュー件数'
                                    id=''
                                    name=''
                                    // width={'sm'}
                                    value={''}
                                    direction='horizontal'
                                    readOnly={true}
                                />
                            </div>
                            <div className="border-t border-gray-200 my-4"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 my-5">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                        レビュ画像のサイズ設定
                                    </h3>
                                    <TextBox
                                        label='PC用 横幅の調整'
                                        id=''
                                        name=''
                                        // width={'sm'}
                                        value={""}
                                        direction='horizontal'
                                        readOnly={true}// sau nay can xoa dong nay
                                        suffix={
                                            <SelectBox
                                                id="pc_width_unit"
                                                name='pc_width_unit'
                                                // width={'sm'}
                                                classNameParent='mb-0'
                                                options={[
                                                    { value: "pixel", label: "px" },
                                                    { value: "percent", label: "%" },
                                                ]}
                                                defaultValue="px"
                                            />
                                        }
                                    />
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                        画像挿入位置
                                    </h3>
                                    <CheckBoxGroup
                                        name="pc_position"
                                        defaultValue={imagePositionPc}
                                        onChange={setImagePositionPc}
                                        direction='vertical'
                                    >
                                        <CheckBoxGroup.Option value="1">説明文の前</CheckBoxGroup.Option>
                                        <CheckBoxGroup.Option value="2">説明文の後</CheckBoxGroup.Option>
                                    </CheckBoxGroup>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 my-4"></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 my-5">
                                <div>
                                    <TextBox
                                        label='スマホ用 横幅の調整'
                                        id=''
                                        name=''
                                        // width={'sm'}
                                        value={""}
                                        readOnly={true}

                                        direction='horizontal'
                                        suffix={
                                            <SelectBox
                                                id="pc_width_unit"
                                                name='pc_width_unit'
                                                // width='sm'
                                                classNameParent='mb-0'
                                                options={[
                                                    { value: "pixel", label: "px" },
                                                    { value: "percent", label: "%" },
                                                ]}
                                                defaultValue="px"
                                            />
                                        }
                                    />
                                </div>
                                <div>
                                    <CheckBoxGroup
                                        name="sp_position"
                                        defaultValue={imagePositionSp}
                                        onChange={setImagePositionSp}
                                        direction='vertical'
                                    >
                                        <CheckBoxGroup.Option value="1">説明文の前</CheckBoxGroup.Option>
                                        <CheckBoxGroup.Option value="2">説明文の後</CheckBoxGroup.Option>
                                    </CheckBoxGroup>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className='flex justify-center'>
                        <Button
                            size='lg'
                            type='submit'
                        >
                            設定を保存
                        </Button>
                    </div>
                </TabsContent>
                <TabsContent value="tab2">


                </TabsContent>
            </Tabs>
        </>
    )
}

export default page
