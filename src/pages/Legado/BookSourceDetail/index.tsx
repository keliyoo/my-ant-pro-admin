import { cloneDeepByJSON } from '@/utils/utils';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { history, useParams } from '@umijs/max';
import { useModel } from '@umijs/max';
import {
  Button,
  Col,
  Collapse,
  Form,
  FormInstance,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Switch,
} from 'antd';
import { useEffect, useRef, useState } from 'react';

// 0: 文本, 1: 音频, 2: 图片, 3: 文件",
const bookSourceTypeOptions = [
  { value: 0, label: '文本' },
  { value: 1, label: '音频' },
  { value: 2, label: '图片' },
  { value: 3, label: '文件' },
];
const layoutAlignSelfOptions = [
  { value: 'auto', label: '默认' },
  { value: 'flex_start', label: 'start' },
  { value: 'flex_end', label: 'end' },
  { value: 'center', label: 'center' },
  { value: 'baseline', label: 'baseline' },
  { value: 'stretch', label: 'stretch' },
];

const initialValues = {
  bookSourceType: 0,
  enabled: true,
  ruleSearch: [{}],
  exploreUrl: [{}],
  ruleExplore: [{}],
  ruleBookInfo: [{}],
  ruleToc: [{}],
  ruleContent: [{}],
};

const BookSourceDetail: React.FC = () => {
  const { loading, data, maxId, putData } = useModel('legado');
  const { id } = useParams();

  const formRef = useRef<FormInstance>(null);

  const [type, setType] = useState<'add' | 'edit'>('add');

  useEffect(() => {
    formRef.current?.resetFields();

    if (id && data) {
      let formData = data.find((v) => +v.id === +id);
      if (formData) {
        setType('edit');
        console.log('formData', formData);
        formData = cloneDeepByJSON(formData);

        formRef.current?.setFieldsValue(formData);
        return;
      }
    }

    formRef.current?.setFieldsValue({ id: maxId + 1 });

    if (id !== 'add') {
      history.replace('/legado/book-source/add');
    }
    setType('add');
  }, [id, data]);

  const onValuesChange = console.log;

  const onFinish = (e: any) => {
    console.log('e', e);
    putData(e);
  };

  return (
    <Spin spinning={loading}>
      <Form
        ref={formRef}
        layout="vertical"
        initialValues={initialValues}
        onValuesChange={onValuesChange}
        onFinish={onFinish}
      >
        <Form.Item name="id" label="id" hidden>
          <Input />
        </Form.Item>

        <Row gutter={24}>
          <Col>
            <Form.Item name="bookSourceType" label="源类型">
              <Select options={bookSourceTypeOptions} />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item name="enabled" label="启用" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              name="enabledExplore"
              label="启用发现"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              name="enabledCookieJar"
              label="启用 CookieJar"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>

          <Col className="ml-auto">
            <Form.Item label={type === 'add' ? '新增' : '编辑'}>
              <div />
            </Form.Item>
          </Col>
        </Row>

        <Collapse accordion>
          {/* 基本 */}
          <Collapse.Panel header="基本" key="base" forceRender>
            {/* 源URL */}
            <Form.Item
              name="bookSourceUrl"
              label="源URL -- 唯一"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            {/* 源名称 */}
            <Form.Item
              name="bookSourceName"
              label="源名称"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            {/* 源分组 id */}
            <Form.Item name="bookSourceGroupId" label="源分组">
              <Select />
            </Form.Item>
            {/* 源注释 */}
            <Form.Item name="bookSourceComment" label="源注释">
              <Input />
            </Form.Item>
            {/* 登录URL */}
            <Form.Item name="loginUrl" label="登录URL">
              <Input />
            </Form.Item>
            {/* 登录UI */}
            <Form.Item name="loginUi" label="登录UI">
              <Input />
            </Form.Item>
            {/* 登录检查js */}
            <Form.Item name="loginCheckJs" label="登录检查js">
              <p>未知</p>
            </Form.Item>
            {/* 封面解密 */}
            <Form.Item name="coverDecodeJs" label="封面解密">
              <p>未知</p>
            </Form.Item>
            {/* 请求头 */}
            <Form.Item label="请求头">
              <Form.List name="header">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: 'flex', marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, 'key']}
                          rules={[{ required: true, message: 'key' }]}
                        >
                          <Input placeholder="key" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'value']}
                          rules={[{ required: true, message: 'value' }]}
                        >
                          <Input placeholder="value" />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        添加请求头
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
            {/* 书籍URL正则 */}
            <Form.Item
              name="bookUrlPattern"
              label="书籍URL正则 -- 添加网址时，用于识别书源"
            >
              <Input />
            </Form.Item>
            {/* 变量说明 */}
            <Form.Item name="variableComment" label="变量说明">
              <p>未知</p>
            </Form.Item>
            {/* 并发率 */}
            <Form.Item name="concurrentRate" label="并发率">
              <p>未知</p>
            </Form.Item>
          </Collapse.Panel>
          {/* 搜索 */}
          <Collapse.Panel header="搜索" key="search" forceRender>
            {/* 搜索地址 */}
            <Form.Item name="searchUrl" label="搜索地址">
              <Input />
            </Form.Item>
            {/* 处理搜索结果规则 */}
            <Form.List name="ruleSearch">
              {(fields) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key}>
                      {/* 校验关键字 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'checkKeyWord']}
                        label="校验关键字"
                      >
                        <Input />
                      </Form.Item>
                      {/* 书籍列表规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'bookList']}
                        label="书籍列表规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 书名规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        label="书名规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 作者规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'author']}
                        label="作者规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 分类规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'kind']}
                        label="分类规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 字数规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'wordCount']}
                        label="字数规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 最新章节规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'lastChapter']}
                        label="最新章节规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 简介规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'intro']}
                        label="简介规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 封面规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'coverUrl']}
                        label="封面规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 详情页url规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'bookUrl']}
                        label="详情页url规则"
                      >
                        <Input />
                      </Form.Item>
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          </Collapse.Panel>
          {/* 发现 */}
          <Collapse.Panel header="发现" key="explore" forceRender>
            {/* 发现地址规则 */}
            <Form.Item label="发现地址规则">
              {/* <Collapse accordion> */}
              <Form.List name="exploreUrl">
                {(fields, { add, remove }) => (
                  <>
                    <Collapse accordion>
                      {fields.map(({ key, name, ...restField }, index) => (
                        <Collapse.Panel
                          forceRender
                          header={`第${index + 1}项发现地址`}
                          extra={
                            <MinusCircleOutlined onClick={() => remove(name)} />
                          }
                          key={key}
                        >
                          {/* 地址标题 */}
                          <Form.Item
                            {...restField}
                            name={[name, 'title']}
                            label="地址标题"
                          >
                            <Input />
                          </Form.Item>
                          {/* 地址 URL */}
                          <Form.Item
                            {...restField}
                            name={[name, 'url']}
                            label="地址 URL"
                          >
                            <Input />
                          </Form.Item>
                          {/* 放大比例 */}
                          <Form.Item
                            {...restField}
                            name={[name, 'layout_flexGrow']}
                            label="放大比例"
                          >
                            <Input />
                          </Form.Item>
                          {/* 缩小比例 */}
                          <Form.Item
                            {...restField}
                            name={[name, 'layout_flexShrink']}
                            label="缩小比例"
                          >
                            <Input />
                          </Form.Item>
                          {/* 对齐方式 */}
                          <Form.Item
                            {...restField}
                            name={[name, 'layout_alignSelf']}
                            label="对齐方式"
                          >
                            <Select options={layoutAlignSelfOptions} />
                          </Form.Item>
                          {/* 百分比长度(小数) */}
                          <Form.Item
                            {...restField}
                            name={[name, 'layout_flexBasisPercent']}
                            label="百分比长度(小数)"
                          >
                            <Input />
                          </Form.Item>
                          {/* 新一行首元素 */}
                          <Form.Item
                            {...restField}
                            name={[name, 'layout_wrapBefore']}
                            label="新一行首元素"
                            valuePropName="checked"
                          >
                            <Switch />
                          </Form.Item>
                        </Collapse.Panel>
                      ))}
                    </Collapse>
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        新增发现地址规则
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
              {/* </Collapse> */}
            </Form.Item>
            {/* 处理搜索结果规则 */}
            <Form.List name="ruleExplore">
              {(fields) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key}>
                      {/* 书籍列表规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'bookList']}
                        label="书籍列表规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 书名规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        label="书名规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 作者规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'author']}
                        label="作者规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 分类规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'kind']}
                        label="分类规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 字数规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'wordCount']}
                        label="字数规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 最新章节规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'lastChapter']}
                        label="最新章节规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 简介规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'intro']}
                        label="简介规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 封面规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'coverUrl']}
                        label="封面规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 详情页url规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'bookUrl']}
                        label="详情页url规则"
                      >
                        <Input />
                      </Form.Item>
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          </Collapse.Panel>
          {/* 详情 */}
          <Collapse.Panel header="详情" key="detail" forceRender>
            {/* 详情规则 */}
            <Form.List name="ruleBookInfo">
              {(fields) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key}>
                      {/* 预处理规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'init']}
                        label="预处理规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 书名规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        label="书名规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 作者规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'author']}
                        label="作者规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 分类规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'kind']}
                        label="分类规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 字数规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'wordCount']}
                        label="字数规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 最新章节规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'lastChapter']}
                        label="最新章节规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 简介规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'intro']}
                        label="简介规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 封面规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'coverUrl']}
                        label="封面规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 目录url规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'tocUrl']}
                        label="目录url规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 允许修改书名作者 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'canReName']}
                        label="允许修改书名作者"
                      >
                        <Input />
                      </Form.Item>
                      {/* 下载url规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'downloadUrls']}
                        label="下载url规则"
                      >
                        <Input />
                      </Form.Item>
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          </Collapse.Panel>
          {/* 目录 TOC是 Table Of Contents */}
          <Collapse.Panel header="目录" key="toc" forceRender>
            {/* 目录规则 */}
            <Form.List name="ruleToc">
              {(fields) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key}>
                      {/* 更新之前js */}
                      <Form.Item
                        {...restField}
                        name={[name, 'preUpdateJs']}
                        label="更新之前js"
                      >
                        <Input />
                      </Form.Item>
                      {/* 目录列表规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'chapterList']}
                        label="目录列表规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 章节名称规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'chapterName']}
                        label="章节名称规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 章节url规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'chapterUrl']}
                        label="章节url规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* volume标识 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'isVolume']}
                        label="volume标识"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                      {/* 更新时间 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'updateTime']}
                        label="更新时间"
                      >
                        <Input />
                      </Form.Item>
                      {/* vip标识 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'isVip']}
                        label="vip标识"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                      {/* 购买标识 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'isPay']}
                        label="购买标识"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                      {/* 目录下一页规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'nextTocUrl']}
                        label="目录下一页规则"
                      >
                        <Input />
                      </Form.Item>
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          </Collapse.Panel>
          {/* 正文 */}
          <Collapse.Panel header="正文" key="content" forceRender>
            {/* 正文规则 */}
            <Form.List name="ruleContent">
              {(fields) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key}>
                      {/* 正文规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'content']}
                        label="正文规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 正文下一页url规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'nextContentUrl']}
                        label="正文下一页url规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* WebView JS */}
                      <Form.Item
                        {...restField}
                        name={[name, 'webJs']}
                        label="WebView JS"
                      >
                        <Input />
                      </Form.Item>
                      {/* 资源正则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'sourceRegex']}
                        label="资源正则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 替换规则 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'replaceRegex']}
                        label="替换规则"
                      >
                        <Input />
                      </Form.Item>
                      {/* 图片样式 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'imageStyle']}
                        label="图片样式"
                      >
                        <Input />
                      </Form.Item>
                      {/* 图片解密 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'imageDecode']}
                        label="图片解密"
                      >
                        <Input />
                      </Form.Item>
                      {/* 购买操作 */}
                      <Form.Item
                        {...restField}
                        name={[name, 'payAction']}
                        label="购买操作"
                      >
                        <Input />
                      </Form.Item>
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          </Collapse.Panel>
        </Collapse>

        <Button htmlType="submit" type="primary" block className="mt-6">
          提交
        </Button>
      </Form>
    </Spin>
  );
};

export default BookSourceDetail;
