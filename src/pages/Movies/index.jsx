import {
    Col,
    Row,
    Typography,
    Card,
    Input,
    FloatButton,
    Button,
    notification,
    Form,
    Drawer,
    Popconfirm,
    List,
  } from "antd";
  import { useState, useEffect, useCallback } from "react";
  import {
    PlusCircleOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
  } from "@ant-design/icons";
  import { getData, sendData, deleteData } from "../../utils/api";
  
  const { Title } = Typography;
  
  const Movies = () => {
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const [dataSource, setDataSource] = useState([]);
    const [searchTextGallery, setSearchTextGallery] = useState("");
    const [isDrawer, setIsDrawer] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [idSelected, setIdSelected] = useState(null);
  
    const showAlert = useCallback((status, title, description) => {
      api[status]({
        message: title,
        description,
      });
    }, [api]);
  
        const getDataGallery = useCallback(() => {
        getData("/api/playlist/3")
            .then((resp) => {
            if (resp) {
                setDataSource(resp);
            } else {
                showAlert("warning", "No Data", "Tidak ada data yang tersedia.");
            }
            })
            .catch((err) => {
            console.error("Error fetching gallery data:", err);
            showAlert("error", "Fetch Failed", "Gagal mengambil data.");
            });
        }, [showAlert]);

    // const getDataGallery = () => {
    //     getData("/api/playlist/3")
    //       .then((resp) => {
    //         if (resp) {
    //           setDataSource(resp);
    //         }
    //       })
    //       .catch((err) => {
    //         console.error(err);
    //       });
    //   };
  
    useEffect(() => {
      getDataGallery();
    }, [getDataGallery]);
  
    const handleSearchGallery = (value) => {
      setSearchTextGallery(value.toLowerCase());
    };
  
    const dataSourceFiltered = dataSource.filter((item) => {
      try {
        return (
          item?.play_name?.toLowerCase()?.includes(searchTextGallery) ||
          item?.play_description?.toLowerCase()?.includes(searchTextGallery)
        );
      } catch {
        return false;
      }
    });
  
    const handleDrawer = () => {
      setIsDrawer(true);
    };
  
    const onCloseDrawer = () => {
      form.resetFields();
      setIsEdit(false);
      setIdSelected(null);
      setIsDrawer(false);
    };
  
    const handleSubmit = () => {
      form
        .validateFields()
        .then((values) => {
          const { play_name, play_description, play_genre, play_url, play_thumbnail } = values;
  
          const formData = new FormData();
          formData.append("play_name", play_name);
          formData.append("play_description", play_description);
          formData.append("play_genre", play_genre);
          formData.append("play_url", play_url);
          formData.append("play_thumbnail", play_thumbnail);
  
          const url = isEdit
            ? `/api/playlist/update/${idSelected}`
            : "/api/playlist/3";
  
          sendData(url, formData)
            .then((resp) => {
              if (resp?.datas) {
                showAlert("success", "Data Sent", "Data berhasil tersimpan.");
                form.resetFields();
                getDataGallery();
                onCloseDrawer();
              } else {
                throw new Error("Failed to save data.");
              }
            })
            .catch((err) => {
              console.error("Error submitting data:", err);
              showAlert("error", "Submission Failed", "Data tidak berhasil dikirim.");
            });
        })
        .catch((err) => {
          console.error("Validation failed:", err);
        });
    };
  
    const handleDrawerEdit = (record) => {
      setIsDrawer(true);
      setIsEdit(true);
      setIdSelected(record?.id_play);
      form.setFieldsValue(record);
    };
  
    const confirmDelete = (record_id) => {
      const url = `/api/playlist/${record_id}`;
      deleteData(url)
        .then((resp) => {
          if (resp?.status === 200) {
            showAlert("success", "Data Deleted", "Data berhasil terhapus.");
            getDataGallery();
          } else {
            throw new Error("Failed to delete data.");
          }
        })
        .catch((err) => {
          console.error("Error deleting data:", err);
          showAlert("error", "Failed", "Data gagal terhapus.");
        });
    };
  
    const renderDrawer = () => (
      <Drawer
        title={isEdit ? "Edit Data" : "Add Data"}
        onClose={onCloseDrawer}
        open={isDrawer}
        extra={
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        }
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Nama Playlist"
            name="play_name"
            rules={[{ required: true, message: "Nama playlist wajib diisi!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Deskripsi"
            name="play_description"
            rules={[{ required: true, message: "Deskripsi wajib diisi!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Genre"
            name="play_genre"
            rules={[{ required: true, message: "Genre wajib diisi!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="URL Playlist"
            name="play_url"
            rules={[{ required: true, message: "URL wajib diisi!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Thumbnail"
            name="play_thumbnail"
            rules={[{ required: true, message: "Thumbnail wajib diisi!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Drawer>
    );
  
    return (
      <div className="layout-content">
        {contextHolder}
        <Row gutter={[24, 0]}>
          <Col xs={24}>
            <Card bordered={false}>
              <Title>Gallery Playlist</Title>
              <FloatButton
                type="primary"
                icon={<PlusCircleOutlined />}
                tooltip={<div>Add Playlist</div>}
                onClick={handleDrawer}
              />
              {renderDrawer()}
              <Input
                size="large"
                placeholder="Search by name or description"
                prefix={<SearchOutlined />}
                onChange={(e) => handleSearchGallery(e.target.value)}
              />
              <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={dataSourceFiltered}
                renderItem={(item) => (
                  <List.Item>
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={item?.play_name || "No Name"}
                          src={item?.play_thumbnail || "default-thumbnail.jpg"}
                        />
                      }
                      onClick={() => window.open(item?.play_url, "_blank")}
                      actions={[
                        <EditOutlined key="edit" onClick={() => handleDrawerEdit(item)} />,
                        <Popconfirm
                          title="Delete Playlist"
                          onConfirm={() => confirmDelete(item?.id_play)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <DeleteOutlined key="delete" />
                        </Popconfirm>,
                      ]}
                    >
                      <Card.Meta
                        title={item?.play_name || "Unknown"}
                        description={item?.play_description || "No Description"}
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
  
  export default Movies;
  