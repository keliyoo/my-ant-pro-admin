import { Link } from '@umijs/max';
import { useModel } from '@umijs/max';
import { List } from 'antd';

// export type BookSourceProps = {};

const BookSource: React.FC = () => {
  const { loading, data } = useModel('legado');

  return (
    <List
      className="demo-loadmore-list"
      loading={loading}
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Link key="list-loadmore-edit" to={`${item.id}`}>
              编辑
            </Link>,
          ]}
        >
          <List.Item.Meta
            title={<a href={item.bookSourceUrl}>{item.bookSourceName}</a>}
            description={item.bookSourceComment || item.bookSourceName}
          />
          {/* <div>content</div> */}
        </List.Item>
      )}
    />
  );
};

export default BookSource;
