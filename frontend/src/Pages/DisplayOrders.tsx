import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { Button, Input, Modal, Table, message } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { Suppliers } from "../data/Suppliers";
// import { Items } from "../data/InventoryItem";
import { Orders } from "../data/Orders";
import http from "../utils/http";
import { useMutation, useQuery, useQueryClient } from "react-query";
const { confirm } = Modal;

const DisplayOrders = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderID",
      key: "orderID",
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
    },
    {
      title: " Supplier Name",
      dataIndex: "supplierName",
      key: "supplierName",
    },

    {
      title: "Orderd Quantity",
      dataIndex: "quantityOrdered",
      key: "quantityOrdered",
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Deliverd Date",
      dataIndex: "deliverdDate",
      key: "deliverdDate",
    },
    {
      title: "Orderd Date",
      dataIndex: "orderDate",
      key: "orderDate",
    },

    {
      title: "Actions",
      dataIndex: "edit",
      key: "edit",
      render: (_text: string, record: Orders) => (
        <div className="space-x-4 w-full flex">
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

  const fetchOrderData = async () => {
    try {
      const response = await http.get("/order");
      console.log(response);

      return response.data;
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const { data: orders, isLoading } = useQuery(["order"], fetchOrderData);
  const handleUpdate = (record: any) => {
    // console.log(record);
    navigate(`/order/edit/`, { state: record });
  };
  const deleteOrder = async (selectedItem: string) => {
    const response = await http.post(`/order/delete`, { id: selectedItem });

    return response.data;
  };
  const deleteOrderMutation = useMutation(deleteOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries("order");
    },
  });

  const showDeleteConfirm = (record: any) => {
    confirm({
      title: `Are you sure you want to delete ${record.orderID}?`,
      icon: <ExclamationCircleFilled />,
      content: "This action cannot be undone!",
      okType: "danger",
      onOk() {
        deleteOrderMutation.mutate(record.key);
      },
    });
  };

  const [filteredList, setFilteredList] = useState([]);
  useEffect(() => {
    setFilteredList(orders);
  }, [orders]);

  const handleFilterChange = (value: string, dataIndex: string) => {
    const filtered =
      orders &&
      orders.filter((order: any) => {
        if (dataIndex === "id") {
          const id = order.orderID;

          return id.toLowerCase().includes(value.toLowerCase());
        }
        // console.log(filtered);

        return order[dataIndex as keyof any]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      });
    // console.log(filtered);

    setFilteredList(filtered);
  };

  let dataSourceDB: any[] = [];
  if (orders) {
    dataSourceDB =
      filteredList &&
      filteredList
        .map((order: any) => {
          const ordDate = new Date(order.orderDate).toLocaleDateString();
          const delDate = new Date(order.orderDate).toLocaleDateString();
          return {
            key: order._id,
            orderID: order.orderID,
            itemName: order?.product?.productName,
            supplierName: order?.supplier?.supplierName,
            quantityOrdered: order.quantityOrdered,
            unitPrice: order.unitPrice,
            status: order.status,
            deliverdDate: delDate,
            orderDate: ordDate,
            supplierID: order.supplier._id,
            productID: order.product._id,
          };
        })
        .reverse();
  }

  return (
    <>
      <div className="w-4/5 mx-auto mt-10">
        <h1 className="text-2xl text-center mb-6">Orders List</h1>
        <div>
          <div className="flex justify-between mb-2">
            <Link to={`/order/add`}>
              <Button className="bg-blue-500 text-white" type="primary">
                Add New Order
              </Button>
            </Link>
            <div className="flex gap-2">
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
          columns={columns}
          loading={isLoading}
          pagination={{ position: ["bottomCenter"] }}
          size="small"
        ></Table>
      </div>
    </>
  );
};
export default DisplayOrders;
