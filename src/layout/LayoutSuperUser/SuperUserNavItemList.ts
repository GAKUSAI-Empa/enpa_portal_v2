import { IconDatabase } from '@tabler/icons-react';

const superUserNavItemList = [
  {
    label: 'データ設定',
    icon: IconDatabase,
    children: [
      { label: 'ユーザー', href: '/admin/accounts' },
      { label: '企業', href: '/admin/companies' },
      { label: 'ストア', href: '/admin/stores' },
    ],
  },
];

export default superUserNavItemList;
