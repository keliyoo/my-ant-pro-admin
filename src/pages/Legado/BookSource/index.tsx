import { LEGADO_BOOK_SOURCE_ACCESS } from '@/constants';
import { getDataFromGitHub } from '@/services/github';
import { useModel } from '@umijs/max';
import { Form, Input } from 'antd';
import { useEffect } from 'react';

// export type BookSourceProps = {};

const BookSource: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  useEffect(() => {
    if (initialState) {
      getDataFromGitHub({
        ...initialState,
        path: initialState[LEGADO_BOOK_SOURCE_ACCESS],
      }).then(console.log);
    }
  }, [initialState]);

  return (
    <Form layout="vertical">
      <Form.Item label="Field A">
        <Input />
      </Form.Item>
    </Form>
  );
};

export default BookSource;
