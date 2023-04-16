export default (initialState: Record<string, any>) => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://umijs.org/docs/max/access
  // const canSeeAdmin = !!(
  //   initialState && initialState.name !== 'dontHaveAccess'
  // );
  return Object.keys(initialState).reduce((t, v) => {
    t[v] = !!initialState[v];
    return t;
  }, {} as Record<string, boolean>);
};
