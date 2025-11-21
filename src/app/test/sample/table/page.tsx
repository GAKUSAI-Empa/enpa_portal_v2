'use client';

import { Button } from '@/component/common/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/component/common/Card';
import { Table } from '@/component/common/Table';
import { IconTrash } from '@tabler/icons-react';
import { FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

const page = () => {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      rows: [{ input: '', select: '' }],
    },
    validationSchema: Yup.object({
      rows: Yup.array().of(
        Yup.object({
          input: Yup.string().required('入力してください'),
          select: Yup.string().required('選択してください'),
        }),
      ),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      console.log(values);

      setIsLoading(false);
    },
  });

  const handleAddRow = (numberRow: number) => {
    const newRows = Array.from({ length: numberRow }, () => ({
      input: '',
      select: '',
    }));

    formik.setFieldValue('rows', [...formik.values.rows, ...newRows]);
  };

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col justify-center w-full">
          <div className="flex flex-col items-center justify-center h-full flex-1">
            <div className="w-full xl:max-w-[80%]">
              <Card>
                <CardHeader
                  title="Form mẫu dùng cho front end"
                  description="Copy paste sử dụng các component dưới đây"
                  buttonGroup={
                    <>
                      <Button color="secondary" size="sm" onClick={() => handleAddRow(1)}>
                        行を追加
                      </Button>
                      <Button color="secondary" size="sm" onClick={() => handleAddRow(5)}>
                        5行追加
                      </Button>
                    </>
                  }
                />
                <CardContent>
                  <Table.Container>
                    <Table.Head>
                      <Table.Row>
                        <Table.Th width="w-24">ID</Table.Th>
                        <Table.Th width="w-24">ImageCell</Table.Th>
                        <Table.Th>InputCell</Table.Th>
                        <Table.Th>SelectBox</Table.Th>
                        <Table.Th>Button</Table.Th>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {formik.values.rows.map((row, index) => (
                        <Table.Row key={index}>
                          <Table.Td>{index + 1}</Table.Td>
                          <Table.ImageCell
                            src={
                              'data:image/jpeg;base64,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'
                            }
                            alt="slide"
                          />
                          <Table.InputCellTest
                            name={`rows[${index}].input`}
                            placeholder="Nhập giá trị"
                          />
                          <Table.SelectTest name={`rows[${index}].select`}>
                            <Table.SelectTestOption value={''}>
                              選んでください
                            </Table.SelectTestOption>
                            <Table.SelectTestOption value={'a'}>aaa</Table.SelectTestOption>
                            <Table.SelectTestOption value={'b'}>bbb</Table.SelectTestOption>
                          </Table.SelectTest>
                          <Table.Button onClick={() => {}}>
                            <IconTrash size={20} />
                          </Table.Button>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Container>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Submit</Button>
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
