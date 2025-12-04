'use client';

import { Card, CardContent, CardHeader } from '@/component/common/Card';
import Label from '@/component/common/Label';
import { useState } from 'react';

interface UserPageProps {
  params: {
    NO: string;
  };
}
const page = ({ params }: UserPageProps) => {
  const { NO } = params;
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Card>
        <CardHeader title="テーマ詳細" />
        <CardContent>
          <div className="flex mb-3 items-start gap-3">
            <Label labelWidth="lg">NO</Label>
            <p>323</p>
          </div>
          <div className="flex mb-3 items-start gap-3">
            <Label labelWidth="lg">テーマ</Label>
            <p>ああああああああああああああああああああああああああ</p>
          </div>
          <div className="flex mb-3 items-start gap-3">
            <Label labelWidth="lg">2025/12/03</Label>
            <p>ああああああああああああああああああああああああああ</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default page;
