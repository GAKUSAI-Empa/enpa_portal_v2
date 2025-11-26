'use client';

import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface SalesLineChartProps {
  thisMonth: Record<number, number>;
  lastMonth: Record<number, number>;
}

export default function SalesLineChart({ thisMonth, lastMonth }: SalesLineChartProps) {
  // Lấy ngày trong tháng hiện tại
  const daysInMonth = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0 = Jan
    const daysCount = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysCount }, (_, i) => `${i + 1}日`);
  }, []);

  const series = useMemo(
    () => [
      {
        name: '今月',
        data: daysInMonth.map((_, idx) => thisMonth[idx + 1] ?? 0),
      },
      {
        name: '先月',
        data: daysInMonth.map((_, idx) => lastMonth[idx + 1] ?? 0),
      },
    ],
    [thisMonth, lastMonth, daysInMonth],
  );

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'line',
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      stroke: {
        curve: 'smooth',
        width: 3,
        dashArray: [0, 5],
      },
      xaxis: {
        categories: daysInMonth,
        title: { text: '日付' },
        axisBorder: { show: true },
      },
      yaxis: {
        labels: {
          formatter: (value: number) => `¥${value.toLocaleString()}`,
        },
        title: { text: '売上 (円)' },
      },
      tooltip: {
        y: { formatter: (value: number) => `¥${value.toLocaleString()}` },
      },
      markers: {
        size: 5,
        hover: {
          size: 5,
        },
      },
      legend: { position: 'top' },
      colors: ['#E6372D', '#9CA3AF'],
      dataLabels: { enabled: false },
      grid: { borderColor: '#e5e7eb' },
    }),
    [daysInMonth],
  );

  return <Chart options={options} series={series} type="line" height={350} />;
}
