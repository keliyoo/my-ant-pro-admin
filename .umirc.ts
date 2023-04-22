import { LEGADO_BOOK_SOURCE_ACCESS } from './src/constants';
import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      key: 'home',
      path: '/home',
      component: './Home',
    },
    {
      name: '开源阅读',
      key: 'legado',
      component: './Legado',
      routes: [
        {
          name: '书源',
          key: 'legado:book-source',
          path: '/legado/book-source',
          component: './Legado/BookSource',
          access: LEGADO_BOOK_SOURCE_ACCESS,
        },
        {
          name: '添加书源',
          key: 'legado:book-source:id',
          path: '/legado/book-source/:id',
          component: './Legado/BookSourceDetail',
          access: LEGADO_BOOK_SOURCE_ACCESS,
          hideInMenu: true,
        },
      ],
    },
    {
      name: '设置',
      key: 'setting',
      routes: [
        {
          name: 'Github',
          key: 'setting:github',
          path: '/setting/github',
          component: './Setting/Github',
        },
      ],
    },
  ],

  npmClient: 'pnpm',
  tailwindcss: {},
});
