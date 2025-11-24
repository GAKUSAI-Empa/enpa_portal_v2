'use client';
const LoadingData = () => {
  return (
    // <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
    //   <div className="flex flex-col items-center">
    //     <img src="/img/logo/emportal_logo.png" alt="Loading logo" className="w-24 h-24" />
    //     <p className="mt-4 text-gray-600 text-lg">読み込み中...</p>
    //   </div>
    // </div>
    <div className="flex flex-col items-center justify-center py-10 animate-pulse">
      <img src="/img/logo/emportal_logo.png" alt="Loading logo" className="w-16 h-16 opacity-80" />
      <p className="mt-4 text-gray-400 text-lg">読み込み中...</p>
    </div>
  );
};

export default LoadingData;
