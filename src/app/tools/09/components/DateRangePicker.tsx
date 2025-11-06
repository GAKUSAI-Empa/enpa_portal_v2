'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Calendar } from './calendar';
import { Button } from './button';
import { Input } from './input';
// Đảm bảo rằng component TextBox của bạn phù hợp với phong cách nhập liệu trong hình
import { TextBox } from '@/component/common/TextBox';

interface DateRangePickerProps {
  label?: string;
  defaultFrom?: Date;
  defaultTo?: Date;
  onChange?: (range: { from?: Date; to?: Date }) => void;
}

export default function DateRangePicker({
  label = '抽出期間',
  defaultFrom,
  defaultTo,
  onChange,
}: DateRangePickerProps) {
  const [from, setFrom] = React.useState<Date | undefined>(defaultFrom);
  const [to, setTo] = React.useState<Date | undefined>(defaultTo);

  // Gửi dữ liệu ra ngoài mỗi khi thay đổi
  React.useEffect(() => {
    if (onChange) onChange({ from, to });
  }, [from, to]);

  return (
    <div className="flex flex-col space-y-2 w-full">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}

      <div className="flex items-center space-x-2 w-full">
        <Popover>
          <PopoverTrigger asChild>
            {/* flex-1 đảm bảo ô này chiếm 50% không gian trừ đi dấu ~ */}
            <div className="relative flex-1">
              <Input
                readOnly
                value={from ? format(from, 'yyyy/MM/dd') : ''}
                placeholder="開始日を選択"
                className="pr-10 cursor-pointer"
              />
              <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Calendar mode="single" selected={from} onSelect={setFrom} />
          </PopoverContent>
        </Popover>

        {/* Dấu ~ */}
        <span className="text-lg text-gray-600">~</span>

        {/* TO - Vẫn sử dụng flex-1 để chiếm đều không gian */}
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative flex-1">
              <Input
                readOnly
                value={to ? format(to, 'yyyy/MM/dd') : ''}
                placeholder="終了日を選択"
                className="pr-10 cursor-pointer"
              />
              <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Calendar mode="single" selected={to} onSelect={setTo} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
