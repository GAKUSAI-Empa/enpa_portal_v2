'use client';
import Link from 'next/link';

const AppFooter = () => {
  return (
    <footer className="bg-white text-gray-700 py-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 text-sm">
          <Link href="/terms_of_use" className="text-blue-600 hover:underline">
            利用規約
          </Link>
          <Link href="/legal_disclosure" className="text-blue-600 hover:underline">
            特定商取引法に基づく表記
          </Link>
        </div>
        <div className="text-sm text-center sm:text-right">© EMPOWERMENT TOWN PORTAL</div>
      </div>
    </footer>
  );
};

export default AppFooter;
