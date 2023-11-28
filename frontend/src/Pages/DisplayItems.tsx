import {
  EyeFilled,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { Avatar, Button, Input, Modal, Table, message } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Items } from "../data/InventoryItem";
import http from "../utils/http";
import { useMutation, useQuery, useQueryClient } from "react-query";
const { confirm } = Modal;

const DisplayItems: React.FC = () => {
  const navigate = useNavigate();

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",

      render: (_text: string, record: any) => <Avatar src={record.image} />,
    },
    {
      title: " Item Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Item ID",
      dataIndex: "itemID",
      key: "itemID",
    },
    {
      title: "Quantity",
      dataIndex: "quantityOnHand",
      key: "quantityOnHand",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Category",
      dataIndex: "catagoryName",
      key: "catagoryName",
    },
    {
      title: "Supplier",
      dataIndex: "supplierName",
      key: "supplierName",
    },
    {
      title: "Register Date",
      dataIndex: "registerDate",
      key: "registerDate",
      // sorter: (a: { registerDate: string }, b: { registerDate: string }) => {
      //   // Parse the date strings into Date objects for comparison
      //   const dateA = new Date(a.registerDate);
      //   const dateB = new Date(b.registerDate);
      //   return dateA.getTime() - dateB.getTime();
      // },
      // // Define sort directions (ascending and descending)
      // defaultSortOrder: "descend",
    },

    {
      title: "Actions",
      dataIndex: "edit",
      key: "edit",
      render: (_text: string, record: Items) => (
        <div className="space-x-4 w-full flex">
          <Button
            icon={<EyeFilled />}
            shape="circle"
            className="bg-green-500 text-white border hover:border-none border-none "
            onClick={() => handleShowDetails(record.itemID)}
          ></Button>

          <Button
            icon={<EditOutlined />}
            shape="circle"
            className="bg-blue-500 text-white border hover:border-none  border-none "
            type="primary"
            onClick={() => handleUpdate(record)}
          ></Button>

          <Button
            icon={<DeleteOutlined />}
            shape="circle"
            className="bg-red-500 text-white border hover:border-none border-none "
            onClick={() => showDeleteConfirm(record)}
          ></Button>
        </div>
      ),
    },
  ];
  // const [deleted, setDeleted] = useState(false);
  const fetchInventryData = async () => {
    try {
      const response = await http.get("/product");
      // console.log(response);

      return response.data;
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const { data: products, isLoading } = useQuery(
    ["product"],
    fetchInventryData
  );
  // console.log(products);

  const [filteredList, setFilteredList] = useState([]);
  useEffect(() => {
    setFilteredList(products);
  }, [products]);

  const handleFilterChange = (value: string, dataIndex: string) => {
    const filtered =
      products &&
      products.filter((item: any) => {
        if (dataIndex === "productName") {
          const name = item.productName;

          return name.toLowerCase().includes(value.toLowerCase());
        } else {
          const id = item.itemID;
          return id.toLowerCase().includes(value.toLowerCase());
        }
        // console.log(filtered);

        return item[dataIndex as keyof any]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      });
    // console.log(filtered);

    setFilteredList(filtered);
  };
  console.log(filteredList);

  // const dataSource = filteredList.map((item) => {
  //   return {
  //     key: item.key,
  //     name: item.name,
  //     id: item.id,
  //     quantity: item.quantity,
  //     price: item.price,
  //     registerDate: item.registerDate,
  //     imgUrl: item.image,
  //     supplier: item.supplier,
  //     category: item.category,
  //   };
  // });
  let dataSourceDB: any[] = [];

  dataSourceDB =
    filteredList &&
    filteredList
      .map((item: any) => {
        const date = new Date(item.registerDate).toLocaleDateString();
        return {
          key: item._id,
          productName: item.productName,
          itemID: item.itemID,
          quantityOnHand: item.quantityOnHand,
          price: item.price,
          registerDate: date,
          image: item.image,
          supplierName: item?.supplier?.supplierName,
          catagoryName: item?.catagory?.catagoryName,
          description: item.description,
          catagoryID: item.catagory?._id,
          supplierID: item.supplier?._id,
        };
      })
      .reverse();

  const handleUpdate = (record: any) => {
    // console.log(record);
    navigate("edit/", { state: record });
  };

  // console.log(filteredList);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const [delItem, setDelItem] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>({} as any);
  const queryClient = useQueryClient();

  const deleteProduct = async (selectedItem: string) => {
    const response = await http.post(`/product/delete`, { id: selectedItem });

    return response.data;
  };
  const deleteProductMutation = useMutation(deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries("product");
    },
  });

  const showDeleteConfirm = (record: any) => {
    confirm({
      title: `Are you sure you want to delete ${record.productName}?`,
      icon: <ExclamationCircleFilled />,
      content: "This action cannot be undone!",
      okType: "danger",
      onOk() {
        deleteProductMutation.mutate(record.key);
      },
    });
  };
  const handleShowDetails = (id: string) => {
    setIsViewModalOpen(true);

    console.log(id);

    const initialData = products.find((Items: any) => Items.itemID === id);
    console.log(initialData);

    if (initialData) {
      setSelectedItem(initialData);
    }
  };

  const handleCancel = () => {
    setIsViewModalOpen(false);
    // setIsDeleteModalOpen(false);
  };

  // const handleDeleteModal = async (id: any) => {
  //   setIsDeleteModalOpen(true);
  //   console.log(id);
  //   setDelItem(id);
  //   console.log(selectedItem);
  // };
  // const handleOk = async () => {
  //   // const response = await http.post(`/product/delete`, { id: delItem });
  //   // console.log(response);
  //   setDeleted((prev) => !prev);

  //   setIsDeleteModalOpen(false);
  // };

  return (
    <div className="w-4/5 mx-auto mt-10">
      <h1 className="text-2xl text-center mb-6">Items List</h1>
      <div>
        <div className="flex justify-between mb-2">
          <Link to={`/inventory/add`}>
            <Button className="bg-blue-500 text-white" type="primary">
              Add New Product
            </Button>
          </Link>
          <div className="flex gap-2">
            <Input
              placeholder="Search Name"
              onChange={(e) =>
                handleFilterChange(e.target.value, "productName")
              }
              suffix={<SearchOutlined />}
            />
            <Input
              placeholder="Search ID"
              onChange={(e) => handleFilterChange(e.target.value, "id")}
              suffix={<SearchOutlined />}
            />
          </div>
        </div>
      </div>

      <Table
        className="rounded-lg"
        dataSource={dataSourceDB}
        loading={isLoading}
        columns={columns}
        pagination={{ position: ["bottomCenter"] }}
        size="small"
      ></Table>

      <Modal
        title="Item Details"
        open={isViewModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="modal-content">
          <img
            src={selectedItem.image}
            alt={selectedItem.name}
            className="item-image"
          />
          <h3 className="item-name">{selectedItem.productName}</h3>
          <p className="item-description">{selectedItem.description}</p>
          <p className="item-price">Price: ${selectedItem.price}</p>
        </div>
      </Modal>

      {/* <Modal
        title="Warning"
        open={isDeleteModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="No"
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to remove{" "}
          <span className="text-red-500 italic">
            {selectedItem.productName}
          </span>{" "}
          ?
        </p>
      </Modal> */}
    </div>
  );
};

export default DisplayItems;
