'use client';
import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import LoadingData from '@/component/common/LoadingData';
import { useRouter } from 'next/navigation';
import useAccountInfoAPI from './api/useAccountInfoAPI';

const page = () => {
  const { data, error, isLoading, mutate } = useAccountInfoAPI();
  const router = useRouter();

  if (isLoading) {
    return <LoadingData />;
  }

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-x-5">
        <Card className="xl:col-span-1">
          <CardContent className="pt-6 w-full h-full flex items-center justify-center">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKUAAACUCAMAAADF0xngAAAAMFBMVEXFxcX////CwsL7+/vKysrZ2dni4uLQ0ND19fX4+Pjc3Nzw8PDp6enf39/T09Ps7Oyn78KlAAADlUlEQVR4nO2b2ZKrIBCGpQF3x/d/25F4Ui5jUvZKcorvaiZXfwG9t1VVKBQKhUKhUCgUCoX/C4Ddn7t/PodFU4hxGofOe98Nc93H5vHrBwHQ1EPrjvhhjB+kE0LduWv8GHKrewDQjy8krgxTyH6gEN5rTLQ/mWXe0PjQ2WTUCPFsMa/wdT7PdO8gV4Ymi0wIM0Lkcpwxg0xo7t52Rpnw45EiF/pvEOlcbXuaQNG4YGpCYSCq9JYOHuOCjnRmcR16ssjFb1odZsMQ6dxkpBLnzc90JjEdIkukc6PJnWNjzh8M7BwmrkgTA3pVPHzSYbJfZWJUFsk18BWvbeYNKcs4M+leOdQSIt2gKrICappxxOtG8yAi0jnVtB14IXxjVlVJT9mOdKoq2dHxqVJRpJxK3fAjEB5XFD0myPj0hGI1CT9SIl2tJpJX8BSV36hSIrnUV0nrDl2qVPSXQUylZoYJYl6911QpFSG9ZvMNJKqeRKuaE/GLcQOVYrm6chdGyHx0e8LfUZ1VMtFHu+0WRHyR9uRHpD5rtZvrIBEklRswCb79qDezRKoKkwka92Wqv8oEu5DUTId2MnnBfLbQmOAYkIHprLC8kYEXesqMZJk2I6l/UJ/mYLqqRUzavaXGBMVrmnhKrkztrPIKtNs0c5RHmbiuUa4dR2juV0E+5tGYZFb1Tcc559lye+ps7hjRkO8gHyKr18u2O8aQceMaQpzv3bifY6a1W6h6TD3Z9ln2rSO2zdFZv06AmlKXt6Z7t9BQO4SGHunmYvU1RiEIGl5FbrHGDOQEeGPStnbsYvU1s67zxC9WX9OqNv/FplKKm7eCY0jFDoekSLXldZm1rA2NganYqGdDoc0hN3TekE4/BCfjB5mipyk4GD8g6pAEN3TOMiXdu8zE7Aq5TUyxHbwrpFqFoiHnLzJBSO9Rrsg8TfK3PHeR6LwK7Su/gz+lAqntgnfwk2Lt+06w3ZGufT/hZnFiK7ZvaVkaDUxnhWNAJqazwjEgq6PkJO7aUWcPPQKpZhlnyFmH4VHSJ9JmBr5CNPMgthJ6C9oXvEoF2WtopZpFBN9DiuamtpOg2I+x7SQo9mOTZ+wh5BxSX5hhQF95hgsnXLnct1sIsJvXWo2h92DbRgrdyjtgO5qW6dAG8pNtmSVlNMiFoyzPMj1MjEjzTOMJKuMQ+/YEC+orY8hz4cuVo1RmEukcRqVdHX4GYeTZjOeV+fwCWMExTqQ7micAAAAASUVORK5CYII="
                    alt="user img"
                  />
                </div>
                <div className="order-3 xl:order-2">
                  <h4 className="mb-2 text-lg font-semibold text-center xl:text-left">
                    {data.username}
                  </h4>
                  <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{data.company_name}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="xl:col-span-3">
          <CardHeader title="マイページ" />
          <CardContent>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      ユーザー名
                    </p>
                    <p className="text-sm font-medium text-gray-800 ">{data.username}</p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      メールアドレス
                    </p>
                    <p className="text-sm font-medium text-gray-800 ">{data.email}</p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      企業名
                    </p>
                    <p className="text-sm font-medium text-gray-800 ">{data.company_name}</p>
                  </div>
                </div>
              </div>

              <div>
                <Button size="md" className="w-full rounded-full mb-2">
                  連絡先の変更
                </Button>
                <Button
                  size="md"
                  color="grey"
                  className="w-full rounded-full"
                  onClick={() => router.push('/account/password_change')}
                >
                  パスワードの変更
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default page;
