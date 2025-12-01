'use client';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import RadioBox from '@/component/common/RadioBox';
import SelectBox from '@/component/common/SelectBox';
import { Table } from '@/component/common/Table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/component/common/Tabs';
import { TextBox } from '@/component/common/TextBox';
const page = () => {
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
          <CardContent></CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="tab2">
        <Card>
          <CardHeader title="変更設定" />
          <CardContent>
            <RadioBox.Group label="" name="radioboxValue" direction="horizontal">
              <RadioBox.Option value="1">即時</RadioBox.Option>
              <RadioBox.Option value="2">予約</RadioBox.Option>
            </RadioBox.Group>
          </CardContent>
          <div className="border-t border-gray-200 my-4"></div>
          <CardHeader title="復元設定" />
          <CardContent>
            <RadioBox.Group label="" name="radioboxValue" direction="horizontal">
              <RadioBox.Option value="1">即時</RadioBox.Option>
              <RadioBox.Option value="2">予約</RadioBox.Option>
            </RadioBox.Group>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tab3">
        <Card>
          <CardHeader title="公開設定" />

          <CardContent>
            <div className="flex items-center gap-6">
              <RadioBox.Group label="" name="radioboxValue" direction="horizontal">
                <RadioBox.Option value="1">即時</RadioBox.Option>
                <RadioBox.Option value="2">予約</RadioBox.Option>
              </RadioBox.Group>

              <TextBox
                id="startDate"
                name="startDate"
                type="datetime-local"
                direction="vertical"
                label="公開日時"
                width="md"
              />
            </div>
          </CardContent>
          <div className="border-t border-gray-200 my-4"></div>
          <CardHeader title="非公開設定" />
          <CardContent>
            <RadioBox.Group label="" name="radioboxValue" direction="horizontal">
              <RadioBox.Option value="1">即時</RadioBox.Option>
              <RadioBox.Option value="2">予約</RadioBox.Option>
            </RadioBox.Group>
          </CardContent>
          <div className="border-t border-gray-200 my-4"></div>
          <SelectBox
            id="selectboxValue"
            label="在庫を同期しますか？"
            name="selectboxValue"
            width="sm"
            options={[
              { value: '1', label: 'する' },
              { value: '2', label: 'しない' },
            ]}
            isRequired={true}
          />
        </Card>
      </TabsContent>

      <TabsContent value="tab4">
        <Card>
          <CardContent>
            <CardHeader title="一覧" />
            <Table.Container>
              <Table.Head>
                <Table.Row>
                  <Table.Th width="w-10">#</Table.Th>
                  <Table.Th width="w-16">ツール名</Table.Th>
                  <Table.Th width="w-48">ファイル名</Table.Th>
                  <Table.Th width="w-32">更新予定日</Table.Th>
                  <Table.Th width="w-40">操作</Table.Th>
                </Table.Row>
              </Table.Head>
              <Table.Body></Table.Body>
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
