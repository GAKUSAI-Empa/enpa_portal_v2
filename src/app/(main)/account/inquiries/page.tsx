'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/component/common/Card';
import SelectBox from '@/component/common/SelectBox';
import { TextArea } from '@/component/common/TextArea';
import { TextBox } from '@/component/common/TextBox';

const page = () => {
  return (
    <>
      <Card>
        <CardHeader title="店舗からの問い合わせ" />
        <CardContent>
          <SelectBox
            id="selectboxValue"
            label="select box sample"
            name="selectboxValue"
            width="full"
            options={[
              { value: '', label: '選んでください' },
              { value: 'Option 1', label: '1' },
              { value: 'Option 2', label: '2' },
              { value: 'Option 3', label: '3' },
            ]}
            isRequired={true}
            direction="horizontal"
          />
          <TextArea
            id="textareaValue"
            name="textareaValue"
            label={'Text area samplesssssssssssssssssccascascacssssss'}
            rows={3}
            placeholder="Text area sample"
            direction="horizontal"
          />
          <TextBox
            id="textboxValue"
            name="textboxValue"
            isRequired={true}
            label={'Text box sample sacascsacasc'}
            placeholder="Text box sample"
            direction="horizontal"
          />
          <TextArea
            id="textareaValue"
            name="textareaValue"
            label={'Text area samplesssssssssssssssssccascascacssssss'}
            rows={3}
            placeholder="Text area sample"
          />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  );
};

export default page;
