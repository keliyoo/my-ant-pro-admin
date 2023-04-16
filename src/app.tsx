// 运行时配置

import React from 'react';
import { RuntimeConfig } from '@umijs/max';
import { PageContainer } from '@ant-design/pro-components';
import { STORAGE_GITHUB } from './constants';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ [key in string]?: string }> {
  return {
    name: '@umijs/max',
    ...JSON.parse(localStorage.getItem(STORAGE_GITHUB) || '{}'),
  };
}

export const layout: RuntimeConfig['layout'] = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    layout: 'mix',
    childrenRender: (dom, props) => (
      <PageContainer>{React.cloneElement(dom, props)}</PageContainer>
    ),
  };
};
