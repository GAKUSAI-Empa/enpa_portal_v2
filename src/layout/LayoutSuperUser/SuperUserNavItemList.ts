import { IconSettings } from '@tabler/icons-react';

const superUserNavItemList = [
  {
    label: '基本設定',
    icon: IconSettings,
    children: [
      { label: 'レビュー評価バナー自動掲載', href: '/2' },
      { label: 'RPP予算消化アラート', href: '/5' },
    ],
  },
];

export default superUserNavItemList;
