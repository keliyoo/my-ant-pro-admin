import { useModel } from '@umijs/max';
import { Outlet } from '@umijs/max';
import { Spin } from 'antd';

const Legado: React.FC = () => {
  const { loading, data } = useModel('legado');

  return data ? (
    <Outlet />
  ) : loading ? (
    <Spin>获取数据中...</Spin>
  ) : (
    <span>获取数据失败</span>
  );
};

export default Legado;
