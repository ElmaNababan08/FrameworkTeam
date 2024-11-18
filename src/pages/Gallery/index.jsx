import {
  Col,
  Row,
  Typography,
  Card,
  List,
  Input,
  FloatButton,
  Button,
  notification,
  Form,
  Drawer,
  Popconfirm
} from "antd";
import { useState, useEffect } from "react";
import { getData, sendData, deleteData } from "../../utils/api";
import { PlusCircleOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const dataDummy = [
  { key: 1, title: "Jhon", description: "The boy with blue hat" },
  { key: 2, title: "Jean", description: "The girl with red hat" },
  { key: 3, title: "Foo", description: "The mysterious person in the class" },
  { key: 4, title: "Romeo", description: "The boy with golden hairs" },
  { key: 5, title: "Juliet", description: "The girl with golden hair" },
];

const Gallery = () => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [dataSource, setDataSource] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [searchTextList, setSearchTextList] = useState("");
  const [searchTextGallery, setSearchTextGallery] = useState("");
  const [isDrawer, setIsDrawer] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [idSelected, setIdSelected] = useState(null);

  useEffect(() => {
    getDataGallery();
    getDataDummmy();
  }, []);

  const getDataDummmy = () => {
    setDataList(dataDummy);
  };

  const showAlert = (status, title, description) => {
    api[status]({
      message: title,
      description: description,
    });
  };

  const getDataGallery = () => {
    getData("/api/natures")
      .then((resp) => {
        if (resp) {
          setDataSource(resp);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSearchList = (e) => {
    setSearchTextList(e.toLowerCase());
  };

  const handleSearchGallery = (value) => {
    setSearchTextGallery(value.toLowerCase());
  };

  let dataListFiltered = dataList.filter((item) => {
    return (
      item?.title.toLowerCase().includes(searchTextList) ||
      item?.description.toLowerCase().includes(searchTextList)
    );
  });

  let dataSourceFiltered = dataSource.filter((item) => {
    return (
      item?.name_natures.toLowerCase().includes(searchTextGallery) ||
      item?.description.toLowerCase().includes(searchTextGallery)
    );
  });

  const handleDrawer = () => {
    setIsDrawer(true);
  };

  const onCloseDrawer = () => {
    if (isEdit) {
      form.resetFields();
      setIsEdit(false);
      setIdSelected(null);
    }
    setIsDrawer(false);
  };

  const handleSubmit = () => {
    const nameNatures = form.getFieldValue("name_natures");
    const description = form.getFieldValue("description");

    if (!nameNatures || !description) {
      showAlert("error", "Incomplete Data", "Please fill in all required fields");
      return;
    }

    let formData = new FormData();
    formData.append("name_natures", nameNatures);
    formData.append("description", description);

    const url = isEdit ? `/api/natures/${idSelected}` : "/api/natures";
    sendData(url, formData)
      .then((resp) => {
        if (resp?.datas) {
          showAlert("success", "Data Sent", "Data berhasil tersimpan");
          form.resetFields();
          getDataGallery();
          onCloseDrawer();
        } else {
          showAlert("error", "Submission Failed", "Data tidak berhasil dikirim");
        }
      })
      .catch((err) => {
        console.error(err);
        showAlert("error", "Submission Failed", "Data tidak berhasil dikirim");
      });
  };

  const renderDrawer = () => {
    return (
      <Drawer
        title="Add Data"
        onClose={onCloseDrawer}
        open={isDrawer}
        extra={<Button type="primary" onClick={() => handleSubmit()}>Submit</Button>}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Name of Natures" name="name_natures" required>
            <Input />
          </Form.Item>
          <Form.Item label="Descriptions" name="description" required>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Drawer>
    );
  };

  const handleDrawerEdit = (record) => {
    setIsDrawer(true);
    setIsEdit(true);
    setIdSelected(record?.id);
    form.setFieldsValue({
      name_natures: record?.name_natures,
      description: record?.description,
    });
  };

  const confirmDelete = (record_id) => {
    const url = `/api/natures/${record_id}`;
    deleteData(url)
      .then((resp) => {
        if (resp?.status === 200) {
          showAlert("success", "Data deleted", "Data berhasil terhapus");
          getDataGallery();
          form.resetFields();
          onCloseDrawer();
        } else {
          showAlert("error", "Failed", "Data gagal terhapus");
        }
      })
      .catch((err) => {
        console.error(err);
        showAlert("error", "Failed", "Data gagal terhapus");
      });
  };

  return (
    <div className="layout-content">
      {contextHolder}
      <Row gutter={[24, 0]}>
        <Col xs={22} className="mb-24">
          <Card bordered={false} className="criclebox h-full w-full">
            <Title>Natures of Gallery</Title>

            <FloatButton
              type="primary"
              icon={<PlusCircleOutlined />}
              tooltip={<div> Add gallery</div>}
              onClick={() => handleDrawer()}
            />
            {renderDrawer()}

            {/* Input Pencarian untuk data dummy */}
            <Input
              size="large"
              placeholder="Search by name in dummy data"
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearchList(e.target.value)}
            />

            {/* List untuk data dummy */}
            <List
              header={<div>Header</div>}
              footer={<div>Footer</div>}
              bordered
              dataSource={dataListFiltered}
              renderItem={(item) => (
                <List.Item>
                  <div>{item?.title}</div>
                  <Text>{item?.description}</Text>
                </List.Item>
              )}
            />

            <Text style={{ fontSize: "12pt" }}>Gallery Content</Text>

            {/* Input Pencarian untuk data gallery dari API */}
            <Input
              size="large"
              placeholder="Search by name in gallery content"
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearchGallery(e.target.value)}
            />

            {/* List untuk data dari API (Gallery Content) */}
            <List
              grid={{
                gutter: 16,
                column: 3,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 3,
                xl: 3,
              }}
              dataSource={dataSourceFiltered}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    hoverable
                    cover={<img alt="example" src={item?.url_photo} />}
                    actions={[
                      <EditOutlined key={item?.id} onClick={() => handleDrawerEdit(item)} />,
                      <Popconfirm
                        key={item?.id}
                        title="Delete the task"
                        description={`Are you sure to delete ${item?.name_natures}?`}
                        okText="Yes"
                        onConfirm={() => confirmDelete(item?.id)}
                        cancelText="No"
                      >
                        <DeleteOutlined key={item?.id} />
                      </Popconfirm>,
                    ]}
                  >
                    <Card.Meta
                      title={item?.name_natures}
                      description={item?.description}
                    />
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Gallery;
