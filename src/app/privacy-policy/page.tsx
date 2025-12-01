import { Card, CardContent, CardHeader } from '@/component/common/Card';
import Image from 'next/image';
import Link from 'next/link';
import PrivacyPolicyList from './PrivacyPolicyList';

// components/CompanyInfo.tsx
export default function page() {
  return (
    <div className="max-w-4xl mx-auto">
      <Link href={'/'}>
        <div className="flex items-center mb-2 w-full max-w-xs h-20">
          {/* Logo icon */}
          <div className="flex-none w-20 h-full relative">
            <Image src="/img/logo/emportal_logo.png" alt="Logo" fill className="object-contain" />
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
      <Card>
        <CardHeader title="プライバシーポリシー（個人情報保護方針）" />
        <CardContent>
          {PrivacyPolicyList?.map((item, index) => (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3 border-b border-gray-200">
              <div className="md:col-span-1">
                <span className="font-medium text-gray-700">{item.title}</span>
              </div>
              <div className="md:col-span-2 whitespace-pre-line">
                <span className="text-gray-900">{item.content}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
