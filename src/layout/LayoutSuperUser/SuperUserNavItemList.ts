import { IconDatabase } from '@tabler/icons-react';

const superUserNavItemList = [
  {
    label: '管理',
    icon: IconDatabase,
    children: [
      { label: 'ユーザー', href: '/admin/accounts' },
      { label: '企業', href: '/admin/companies' },
      { label: 'ストア', href: '/admin/stores' },
    ],
  },
];

export default superUserNavItemList;
