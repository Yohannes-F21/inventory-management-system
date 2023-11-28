import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { Button, Input, Modal, Table, message } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Suppliers } from "../data/Suppliers";
import http from "../utils/http";
import { QueryClient, useMutation, useQuery } from "react-query";
const { confirm } = Modal;

const DisplaySuppliers = () => {
  const navigate = useNavigate();

  const columns = [
    {
      title: " Supplier Name",
      dataIndex: "supplierName",
      key: "supplierName",
    },
    {
      title: "Supplier ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Adderss",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Register Date",
      dataIndex: "registerDate",
      key: "registerDate",
    },

    {
      title: "Actions",
      dataIndex: "edit",
      key: "edit",
      render: (_text: string, record: Suppliers) => (
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

  const queryClient = new QueryClient();
  const fetchSupplierData = async () => {
    try {
      const response = await http.get("/supplier");
      // console.log(response);

      return response.data;
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const { data: suppliers, isLoading } = useQuery(
    ["supplier"],
    fetchSupplierData
  );
  // console.log(suppliers);

  const deleteSupplier = async (selectedItem: string) => {
    const response = await http.post(`/supplier/delete`, { id: selectedItem });

    return response.data;
  };
  const deleteSupplierMutation = useMutation(deleteSupplier, {
    onSuccess: () => {
      queryClient.invalidateQueries("supplier");
    },
  });

  const showDeleteConfirm = (record: any) => {
    confirm({
      title: `Are you sure you want to delete ${record.supplierName}?`,
      icon: <ExclamationCircleFilled />,
      content: "This action cannot be undone!",
      okType: "danger",
      onOk() {
        deleteSupplierMutation.mutate(record.key);
      },
    });
  };

  const handleUpdate = (record: any) => {
    // console.log(record);
    navigate(`/supplier/edit/`, { state: record });
  };

  const [filteredList, setFilteredList] = useState([]);
  useEffect(() => {
    setFilteredList(suppliers);
  }, [suppliers]);

  const handleFilterChange = (value: string, dataIndex: string) => {
    const filtered =
      suppliers &&
      suppliers.filter((supplier: any) => {
        if (dataIndex === "supplierName") {
          const name = supplier.supplierName;

          return name.toLowerCase().includes(value.toLowerCase());
        } else {
          const id = supplier.supplierID;
          return id.toLowerCase().includes(value.toLowerCase());
        }
        // console.log(filtered);

        return supplier[dataIndex as keyof any]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      });
    // console.log(filtered);

    setFilteredList(filtered);
  };
  // console.log(filteredList.reverse());
  let dataSourceDB: any[] = [];
  if (suppliers) {
    dataSourceDB =
      filteredList &&
      filteredList
        .map((supplier: any) => {
          const date = new Date(supplier.registerDate).toLocaleDateString();

          return {
            key: supplier._id,
            supplierName: supplier.supplierName,
            id: supplier.supplierID,
            email: supplier.email,
            address: supplier.address,
            phone: supplier.phone,
            registerDate: date,
          };
        })
        .reverse();
  }

  return (
    <>
      <div className="w-4/5 mx-auto mt-10">
        <h1 className="text-2xl text-center mb-6">Suppliers List</h1>
        <div>
          <div className="flex justify-between mb-2">
            <Link to={`/supplier/add`}>
              <Button className="bg-blue-500 text-white" type="primary">
                Add New Supplier
              </Button>
            </Link>
            <div className="flex gap-2">
              <Input
                placeholder="Search Name"
                onChange={(e) =>
                  handleFilterChange(e.target.value, "supplierName")
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
          columns={columns}
          loading={isLoading}
          pagination={{ position: ["bottomCenter"] }}
          size="small"
        ></Table>
      </div>
    </>
  );
};
export default DisplaySuppliers;
