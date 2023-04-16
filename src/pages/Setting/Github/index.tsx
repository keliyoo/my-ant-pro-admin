import { LEGADO_BOOK_SOURCE_ACCESS, STORAGE_GITHUB } from '@/constants';
import { useModel } from '@umijs/max';
import { Button, Form, FormInstance, Input } from 'antd';
import { useEffect, useRef, useState } from 'react';

const initialValuesDefault: FormValues = {
  branch: 'main',
};

type FormValues = {
  [key in string]?: string;
};

// export type GithubProps = {};

const Github: React.FC = () => {
  const { setInitialState } = useModel('@@initialState');

  const formRef = useRef<FormInstance<FormValues>>(null);

  const [initialValues, setInitialValues] =
    useState<FormValues>(initialValuesDefault);

  const onFinish = (values: FormValues) => {
    console.log('onFinish', values);

    localStorage.setItem(STORAGE_GITHUB, JSON.stringify(values));
    setInitialState((preState) => ({ ...preState, ...values }));
  };

  useEffect(() => {
    const temp = localStorage.getItem(STORAGE_GITHUB);
    if (!temp) {
      return;
    }

    if (formRef.current) {
      formRef.current.setFieldsValue(JSON.parse(temp));
    } else {
      setInitialValues(JSON.parse(temp));
    }
  }, []);

  return (
    <Form
      ref={formRef}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Form.Item name="owner" label="owner">
        <Input placeholder="请输入存储库的帐户所有者名称，不区分大小写" />
      </Form.Item>
      <Form.Item name="repo" label="repo">
        <Input placeholder="请输入存储库的名称，不区分大小写" />
      </Form.Item>
      <Form.Item name="branch" label="branch">
        <Input placeholder="请输入分支名" />
      </Form.Item>
      <Form.Item name="token" label="Token">
        <Input placeholder="请输入Token" />
      </Form.Item>
      <Form.Item name={LEGADO_BOOK_SOURCE_ACCESS} label="开源阅读书源路径">
        <Input />
      </Form.Item>

      <Button htmlType="submit">保存</Button>
    </Form>
  );
};

export default Github;
