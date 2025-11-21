'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import ColorPicker from '@/component/common/ColorPicker';
import { TextBox } from '@/component/common/TextBox';
import { IconTrash } from '@tabler/icons-react';
import { FieldArray, FormikValues } from 'formik';

interface TabItem1Props {
  formik: FormikValues;
  createInputAwardImg: () => void;
  deleteInputAwardImg: (index: number) => void;
}
const TabItem1 = ({ formik, createInputAwardImg, deleteInputAwardImg }: TabItem1Props) => {
  return (
    <>
      <Card>
        <CardHeader title="参考" />
        <CardContent>
          <img src={'/img/tool4/tab1_des.jpg'} alt="" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="1.基本設定" description="は必須項目です。" showDescAsterisk={true} />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* 基本設定 Col 1  */}
            <div>
              <TextBox
                id="topMessage"
                name="topMessage"
                type="text"
                isRequired={true}
                label={'最上部メッセージ'}
                placeholder="3,980円以上で送料無料"
                direction="vertical"
              />
              <TextBox
                id="storeLogoUrl"
                name="storeLogoUrl"
                type="text"
                isRequired={true}
                label={'店舗ロゴURL'}
                placeholder="https://example.com/logo.png"
                direction="vertical"
              />
              <ColorPicker
                id="hexColor"
                name="hexColor"
                value={formik.values.hexColor}
                onColorChange={(color) => {
                  formik.setFieldValue('hexColor', color);
                }}
              />
            </div>
            {/* 基本設定 Col 2  */}
            <div>
              <FieldArray
                name="awards"
                render={(arrayHelpers) => (
                  <>
                    {formik.values.awards?.map((url: string, index: number) => (
                      <TextBox
                        key={index}
                        id={`award-${index}`}
                        name={`awards[${index}]`}
                        label={`受賞ロゴ ${index + 1}`}
                        type="text"
                        width="full"
                        className="flex-1"
                        placeholder="https://image.rakuten.co.jp/empoportal/empo.jpg"
                        direction="vertical"
                        suffix={
                          <Button
                            size="sm"
                            color="textOnly"
                            className="px-0"
                            disabled={formik.values.awards.length === 1}
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            <IconTrash size={20} />
                          </Button>
                        }
                      />
                    ))}
                    <Button
                      size="sm"
                      color="secondary"
                      disabled={formik.values.awards.length >= 3 ? true : false}
                      onClick={() => createInputAwardImg()}
                    >
                      受賞ロゴを追加
                    </Button>
                  </>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TabItem1;
