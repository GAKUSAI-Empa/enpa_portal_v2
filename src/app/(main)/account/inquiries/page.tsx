'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/component/common/Card';
import Label from '@/component/common/Label';
import Pagination from '@/component/common/Pagination';
import SelectBox from '@/component/common/SelectBox';
import { Table } from '@/component/common/Table';
import { TextArea } from '@/component/common/TextArea';
import { useRouter } from 'next/navigation';

const page = () => {
  const router = useRouter();

  return (
    <>
      <Card>
        <CardHeader title="店舗からの問い合わせ" />
        <CardContent>
          <div className="flex mb-3 items-start gap-3">
            <Label labelWidth="lg">NO</Label>
            <p>323</p>
          </div>
          <SelectBox
            id=""
            label="テーマ"
            name=""
            options={[
              { value: '', label: '選んでください' },
              { value: 'Option 1', label: '1' },
              { value: 'Option 2', label: '2' },
              { value: 'Option 3', label: '3' },
            ]}
            isRequired={true}
            direction="horizontal"
            width="full"
            labelWidth="lg"
          />
          <TextArea
            id="textareaValue"
            name="textareaValue"
            label={'内容'}
            rows={8}
            placeholder="送りたいことがあればこちらどぞ"
            isRequired={true}
            direction="horizontal"
            width="full"
            labelWidth="lg"
          />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button>送信</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader title="送信したテーマ" />
        <CardContent>
          <Table.Container>
            <Table.Head>
              <Table.Row>
                <Table.Th width="w-40">日付</Table.Th>
                <Table.Th width="w-24">NO</Table.Th>
                <Table.Th>内容</Table.Th>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              <Table.Row onClick={() => router.push('/')} className="cursor-pointer">
                <Table.Td>2025/12/03</Table.Td>
                <Table.Td>123</Table.Td>
                <Table.Td
                  position="left"
                  className="overflow-hidden text-ellipsis whitespace-nowrap truncate"
                >
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Molestiae laudantium
                  doloribus suscipit et consequuntur minus debitis itaque? Sapiente accusantium
                  fugiat magnam nam, consectetur minima eius eligendi labore quae distinctio sint!
                </Table.Td>
              </Table.Row>
              <Table.Row onClick={() => router.push('/')} className="cursor-pointer">
                <Table.Td>2025/12/03</Table.Td>
                <Table.Td>123</Table.Td>
                <Table.Td
                  position="left"
                  className="overflow-hidden text-ellipsis whitespace-nowrap truncate"
                >
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Molestiae laudantium
                  doloribus suscipit et consequuntur minus debitis itaque? Sapiente accusantium
                  fugiat magnam nam, consectetur minima eius eligendi labore quae distinctio sint!
                </Table.Td>
              </Table.Row>
            </Table.Body>
          </Table.Container>
          <Pagination
            page={1}
            totalPages={12}
            handleClickPrevPage={() => {}}
            handleClickNextPage={() => {}}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default page;
