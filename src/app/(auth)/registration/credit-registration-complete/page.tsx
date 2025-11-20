import { Card, CardContent, CardHeader } from '@/component/common/Card';

const page = () => {
  return (
    <div className="flex flex-col justify-center w-full mt-2">
      <div className="flex flex-col items-center justify-center h-full flex-1">
        <div className="w-full xl:max-w-[50%]">
          <Card>
            <CardHeader title="登録結果" />
            <CardContent>
              <p>
                クレジットカード登録完了しました。2〜3営業日以内に、ログインURL、ID、パスワードをご登録いただいEmaillに送信いたしますので、ご確認ください。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default page;
