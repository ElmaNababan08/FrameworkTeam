import { Col, Row, Typography, Card, Table } from "antd";
import { useLocation } from "react-router-dom";

const { Title, Text } = Typography;
const dataSource = [
  {
    key: '1',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John',
    age: 42,
    address: '10 Downing Street',
  },
];

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];

const Blank = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  return (
    <div className="layout-content">
      <Row gutter={[24, 0]}>
        <Col xs={22} className="mb-24">
          <Card bordered={false} className="criclebox h-full w-full">
            <Title>Blank Page {lastSegment}</Title>
            <Text style={{ fontSize: "12pt" }}>Add content here</Text>
            <Table dataSource={dataSource} columns={columns}/>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Blank;
