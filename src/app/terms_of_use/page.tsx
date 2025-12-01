import { Card, CardContent, CardHeader } from '@/component/common/Card';
import Image from 'next/image';
import Link from 'next/link';

const page = () => {
  return (
    <>
      <div className="flex flex-col justify-center w-full mt-2">
        <div className="flex flex-col items-center justify-center w-full flex-1">
          <div className="w-full xl:max-w-[80%]">
            {/* Logo */}
            <Link href={'/'}>
              <div className="flex items-center mb-2 w-full max-w-xs h-20">
                {/* Logo icon */}
                <div className="flex-none w-20 h-full relative">
                  <Image
                    src="/img/logo/emportal_logo.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                {/* Logo text */}
                <div className="flex-1 h-full relative ml-2">
                  <Image
                    src="/img/logo/emportal_logo_text.png"
                    alt="Logo Text"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </Link>
            <Card className="h-[70vh]">
              <CardHeader title="利用規約" />
              <CardContent className="h-full p-0">
                <iframe src="/docs/terms_of_use.pdf" className="w-full h-full border-none" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
