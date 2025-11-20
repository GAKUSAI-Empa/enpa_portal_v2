'use client';
import { Button } from '@/component/common/Button';
import { Card, CardContent } from '@/component/common/Card';
import { DatePicker } from '@/component/common/DatePicker';
import { Tabs, TabsContent } from '@/component/common/Tabs';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
const Page = () => {
  const pageFormik = useFormik({
    initialValues: {
      startDate: '',
      endDate: '',
    },
    validationSchema: Yup.object({
      startDate: Yup.date().required('開始日を選択ください'),
      endDate: Yup.date().required('終了日を選択ください'),
    }),

    onSubmit: (values) => {},
  });
  return (
    <Tabs defaultTab="tab1">
      <TabsContent value="tab1">
        <FormikProvider value={pageFormik}>
          <form onSubmit={pageFormik.handleSubmit}>
            <Card>
              <CardContent>
                <div className="flex items-center gap-4">
                  <DatePicker
                    id="startDate"
                    name="startDate"
                    value={
                      pageFormik.values.startDate ? new Date(pageFormik.values.startDate) : null
                    }
                    onChange={(date) => pageFormik.setFieldValue('startDate', date)}
                    error={pageFormik.errors.startDate}
                    touched={pageFormik.touched.startDate}
                    width="sm"
                  />
                  <DatePicker
                    id="endDate"
                    name="endDate"
                    value={pageFormik.values.startDate ? new Date(pageFormik.values.endDate) : null}
                    onChange={(date) => pageFormik.setFieldValue('endDate', date)}
                    error={pageFormik.errors.endDate}
                    touched={pageFormik.touched.endDate}
                    width="sm"
                  />
                  <Button type="submit">検索</Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </FormikProvider>
      </TabsContent>
    </Tabs>
  );
};
export default Page;
