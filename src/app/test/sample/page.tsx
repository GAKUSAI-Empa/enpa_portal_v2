'use client';
import { Button } from '@/component/common/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/component/common/Card';
import { CheckboxGroup } from '@/component/common/CheckboxGroup';
import { DatePicker } from '@/component/common/DatePicker';
import { DateTimePicker } from '@/component/common/DateTimePicker';
import FilePicker from '@/component/common/FilePicker';
import RadioBox from '@/component/common/RadioBox';
import SelectBox from '@/component/common/SelectBox';
import { TextArea } from '@/component/common/TextArea';
import { TextBox } from '@/component/common/TextBox';
import { IconLoader2 } from '@tabler/icons-react';
import { FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

const page = () => {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      dateTimePickerValue: null,
      datePickerValue: null,
      textboxValue: '',
      textareaValue: '',
      checkboxValue: [],
      selectboxValue: '',
      radioboxValue: '',
    },
    validationSchema: Yup.object({
      datePickerValue: Yup.date().required('date Picker Valueを入力してください。'),
      dateTimePickerValue: Yup.date().required('date Picker Valueを入力してください。'),
      textboxValue: Yup.string().trim().required('Text box sampleを入力してください。'),
      textareaValue: Yup.string().trim().required('Text area sample入力してください。'),

      checkboxValue: Yup.array()
        .min(1, 'Check box sample入力してください。')
        .required('Check box sample入力してください。'),
      selectboxValue: Yup.string().trim().required('select box sample入力してください。'),
      radioboxValue: Yup.string().trim().required('Radio box sample入力してください。'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      console.log(values);

      setIsLoading(false);
    },
  });
  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col justify-center w-full">
          <div className="flex flex-col items-center justify-center h-full flex-1">
            <div className="w-full xl:max-w-[50%]">
              <Card>
                <CardHeader
                  title="Form mẫu dùng cho front end"
                  description="Copy paste sử dụng các component dưới đây"
                />
                <CardContent>
                  <div className="p-6">
                    <FilePicker
                      accept=".pdf,.jpg,.png"
                      onChange={(file) => {
                        console.log('File selected:', file);
                      }}
                    />
                  </div>
                  <DatePicker
                    id="datePickerValue"
                    name="datePickerValue"
                    label={'datePicker sample'}
                    width="lg"
                    value={formik.values.datePickerValue}
                    onChange={(date) => formik.setFieldValue('datePickerValue', date)}
                    error={formik.errors.datePickerValue}
                    touched={formik.touched.datePickerValue}
                  />
                  <DateTimePicker
                    id="dateTimePickerValue"
                    name="dateTimePickerValue"
                    label={'datetimePicker sample'}
                    width="lg"
                    value={formik.values.dateTimePickerValue}
                    onChange={(date) => formik.setFieldValue('dateTimePickerValue', date)}
                    error={formik.errors.dateTimePickerValue}
                    touched={formik.touched.dateTimePickerValue}
                  />

                  <TextBox
                    id="textboxValue"
                    name="textboxValue"
                    isRequired={true}
                    label={'Text box sample'}
                    placeholder="Text box sample"
                    width="lg"
                  />
                  <TextArea
                    id="textareaValue"
                    name="textareaValue"
                    label={'Text area sample'}
                    rows={3}
                    width="lg"
                    placeholder="Text area sample"
                  />
                  <CheckboxGroup
                    id="checkboxValue"
                    name="checkboxValue"
                    label="Check box sample"
                    options={[
                      { label: 'Option 1', value: '1' },
                      { label: 'Option 2', value: '2' },
                      { label: 'Option 3', value: '3' },
                      { label: 'Option 4', value: '4' },
                    ]}
                  />
                  <SelectBox
                    id="selectboxValue"
                    label="select box sample"
                    name="selectboxValue"
                    width="lg"
                    options={[
                      { value: '', label: '選んでください' },
                      { value: 'Option 1', label: '1' },
                      { value: 'Option 2', label: '2' },
                      { value: 'Option 3', label: '3' },
                    ]}
                    isRequired={true}
                  />
                  <RadioBox.Group
                    direction="horizontal"
                    label="Radio box sample"
                    name="radioboxValue"
                  >
                    <RadioBox.Option value="1">Option 1</RadioBox.Option>
                    <RadioBox.Option value="2">Option 2</RadioBox.Option>
                    <RadioBox.Option value="3" disabled={true}>
                      Option 3 (Disabled)
                    </RadioBox.Option>
                  </RadioBox.Group>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button type="submit" disabled={isLoading} onClick={formik.submitForm}>
                    {isLoading ? <IconLoader2 className="animate-spin" /> : <>実行</>}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </FormikProvider>
  );
};

export default page;
