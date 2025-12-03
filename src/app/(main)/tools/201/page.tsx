'use client';
import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import FilePicker from '@/component/common/FilePicker';
import RadioBox from '@/component/common/RadioBox';
import SelectBox from '@/component/common/SelectBox';
import { Table } from '@/component/common/Table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/component/common/Tabs';
import { TextBox } from '@/component/common/TextBox';
const page = () => {
  const toolList = [
    {
      id: 1,
      name: 'セール更新　更新',
      file: 'セール更新2025.01.10.xlsmm',
      updateDate: '2025-01-10',
    },
    {
      id: 2,
      name: 'セール更新　復元',
      file: 'セール更新2025.02.03.xlsm',
      updateDate: '2025-02-03',
    },
  ];
  // const formik = useFormik({
  //   initialValues:{
  //   },

  //   validationSchema: Yup.object({

  //   }),

  // });

  return (
    // <FormikProvider value={formik}>
    //   <form onSubmit={formik.handleSubmit}>
    <Tabs defaultTab="tab1">
      <TabsList>
        <TabsTrigger value="tab1">データチェック</TabsTrigger>
        <TabsTrigger value="tab2">現在のページ設定</TabsTrigger>
        <TabsTrigger value="tab3">コピーページ設定</TabsTrigger>
        <TabsTrigger value="tab4">予約確認</TabsTrigger>
      </TabsList>

      <TabsContent value="tab1">
        <Card>
          <CardHeader title="" />
          <div className="flex justify-center">
            <CardContent>
              <div className="p-6">
                {/* Dòng chứa FilePicker + Button */}
                <div className="flex items-center gap-3">
                  <FilePicker
                    accept=".pdf,.jpg,.png"
                    onChange={(file) => {
                      console.log('File selected:', file);
                    }}
                  />

                  <Button type="submit">実行</Button>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="tab2">
        <Card>
          <CardHeader title="" />
          <CardContent>
            <RadioBox.Group
              label="変更設定"
              name="radioboxValue"
              direction="horizontal"
              className="gap-14"
            >
              <RadioBox.Option value="1">即時</RadioBox.Option>
              <RadioBox.Option value="2">予約</RadioBox.Option>
            </RadioBox.Group>
          </CardContent>
          <div className="border-t border-gray-200 my-4"></div>

          <CardContent>
            <RadioBox.Group
              label="復元設定"
              name="radioboxValue"
              direction="horizontal"
              className="gap-14"
            >
              <RadioBox.Option value="1">即時</RadioBox.Option>
              <RadioBox.Option value="2">予約</RadioBox.Option>
            </RadioBox.Group>
          </CardContent>

          <div className="border-t border-gray-200 my-4"></div>
          <div className="flex justify-center">
            <CardContent>
              <div className="p-6">
                {/* Dòng chứa FilePicker + Button */}
                <div className="flex items-center gap-3">
                  <FilePicker
                    accept=".pdf,.jpg,.png"
                    onChange={(file) => {
                      console.log('File selected:', file);
                    }}
                  />

                  <Button type="submit">実行</Button>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="tab3">
        <Card>
          <CardHeader title="" />
          <div className="grid grid-cols-4 gap-6">
            <CardContent>
              <RadioBox.Group
                label="公開設定"
                name="radioboxValue"
                direction="horizontal"
                className="gap-14"
              >
                <RadioBox.Option value="1">即時</RadioBox.Option>
                <RadioBox.Option value="2">予約</RadioBox.Option>
              </RadioBox.Group>
            </CardContent>
            <CardContent>
              <TextBox
                id="startDate"
                name="startDate"
                type="datetime-local"
                direction="vertical"
                label="公開日時"
                width="md"
              />
            </CardContent>
          </div>

          <div className="border-t border-gray-200 my-4"></div>

          <CardContent>
            <RadioBox.Group
              label="非公開設定"
              name="radioboxValue"
              direction="horizontal"
              className="gap-14"
            >
              <RadioBox.Option value="1">即時</RadioBox.Option>
              <RadioBox.Option value="2">予約</RadioBox.Option>
            </RadioBox.Group>
          </CardContent>
          <div className="border-t border-gray-200 my-4"></div>
          <div className="flex justify-center">
            <SelectBox
              id="selectboxValue"
              label="在庫を同期しますか？"
              name="selectboxValue"
              width="sm"
              direction="horizontal"
              options={[
                { value: '1', label: 'する' },
                { value: '2', label: 'しない' },
              ]}
              isRequired={true}
            />
          </div>
          <div className="flex justify-center">
            <CardContent>
              <div className="p-6">
                {/* Dòng chứa FilePicker + Button */}
                <div className="flex items-center gap-3">
                  <FilePicker
                    accept=".pdf,.jpg,.png"
                    onChange={(file) => {
                      console.log('File selected:', file);
                    }}
                  />

                  <Button type="submit">実行</Button>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="tab4">
        <Card>
          <CardContent>
            <CardHeader title="" />
            <Table.Container>
              <Table.Head>
                <Table.Row>
                  <Table.Th width="w-10">#</Table.Th>
                  <Table.Th width="w-20">ツール名</Table.Th>
                  <Table.Th width="w-48">ファイル名</Table.Th>
                  <Table.Th width="w-32">更新予定日</Table.Th>
                  <Table.Th width="w-40">操作</Table.Th>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {toolList.map((tool) => (
                  <Table.Row key={tool.id}>
                    <Table.Td>{tool.id}</Table.Td>
                    <Table.Td>{tool.name}</Table.Td>
                    <Table.Td>{tool.file}</Table.Td>
                    <Table.Td>{tool.updateDate}</Table.Td>

                    {/* Cột 操作 */}
                    <Table.Td>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                          予約時間変更
                        </Button>
                        <Button>キャンセル</Button>
                      </div>
                    </Table.Td>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Container>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    //   </form>
    // </FormikProvider>
  );
};
export default page;
