import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { Button, Input, Modal, Table, message } from "antd";

import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { Suppliers } from "../data/Suppliers";
import http from "../utils/http";
import { useMutation, useQuery, useQueryClient } from "react-query";
// import { Rule } from "antd/es/form";
import AddCategory from "./AddCategory";
const { confirm } = Modal;

const DisplaySuppliers = () => {
  const columns = [
    {
      title: " Category ID",
      dataIndex: "catagoryID",
      key: "catagoryID",
    },
    {
      title: "Category Name",
      dataIndex: "catagoryName",
      key: "catagoryName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
        <div className='space-x-4 w-full flex'>
          <Button
            icon={<EditOutlined />}
            shape='circle'
            className='bg-blue-500 text-white border hover:border-none  border-none '
            type='primary'
            onClick={() => handleEditModal(record)}></Button>

          <Button
            icon={<DeleteOutlined />}
            shape='circle'
            className='bg-red-500 text-white border hover:border-none border-none '
            // onClick={() => showDeleteConfirm(record)}
            disabled></Button>
        </div>
      ),
    },
  ];

  // const [supplierList] = useState<Suppliers[]>(() => {
  //   const storedSuppliers = localStorage.getItem("Suppliers");
  //   return storedSuppliers ? JSON.parse(storedSuppliers) : [];
  // });

  // const [filteredList, setFilteredList] = useState<Suppliers[]>([]);
  // useEffect(() => {
  //   setFilteredList([...supplierList]);
  // }, [supplierList]);

  // const handleFilterChange = (value: string, dataIndex: string) => {
  //   if (value === "all") {
  //     setFilteredList([...supplierList]);
  //     return;
  //   }
  //   const filtered = supplierList.filter((supplier) => {
  //     if (dataIndex === "name") {
  //       const name = supplier.name;
  //       return name.toLowerCase().includes(value.toLowerCase());
  //     }
  //     return supplier[dataIndex as keyof Suppliers]
  //       .toString()
  //       .toLowerCase()
  //       .includes(value.toLowerCase());
  //   });
  //   setFilteredList(filtered);
  // };

  const [deleted, setDeleted] = useState(false);
  const fetchCategoryData = async () => {
    try {
      const response = await http.get("/catagory");
      console.log(response);

      return response.data;
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const { data: categorys, isLoading } = useQuery(
    ["catagory"],
    fetchCategoryData
  );
  const [filteredList, setFilteredList] = useState([]);
  useEffect(() => {
    setFilteredList(categorys);
  }, [categorys]);

  const handleFilterChange = (value: string, dataIndex: string) => {
    const filtered =
      categorys &&
      categorys.filter((category: any) => {
        if (dataIndex === "catagoryName") {
          const name = category.catagoryName;

          return name.toLowerCase().includes(value.toLowerCase());
        } else {
          const id = category.catagoryID;
          return id.toLowerCase().includes(value.toLowerCase());
        }
        // console.log(filtered);

        return category[dataIndex as keyof any]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      });
    // console.log(filtered);

    setFilteredList(filtered);
  };
  let dataSourceDB: any[] = [];
  if (categorys) {
    dataSourceDB =
      filteredList &&
      filteredList.map((cat: any) => {
        const date = new Date(cat.registerDate).toLocaleDateString();

        return {
          key: cat._id,
          catagoryName: cat.catagoryName,
          catagoryID: cat.catagoryID,
          description: cat.description,
          registerDate: date,
        };
      });
  }
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const [selectedItem, setSelectedItem] = useState("");
  const [editItem, setEditItem] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const queryClient = useQueryClient();
  // const deleteCategory = async (selectedItem: string) => {
  //   const response = await http.post(`/catagory/delete`, { id: selectedItem });
  //   // console.log(selectedItem);

  //   return response.data;
  // };
  // // const deleteCategoryMutation = useMutation(deleteCategory, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries("catagory");
  //   },
  // });

  const showDeleteConfirm = (record: any) => {
    confirm({
      title: `Are you sure you want to delete ${record.catagoryName}?`,
      icon: <ExclamationCircleFilled />,
      content: "This action cannot be undone!",
      okType: "danger",
      onOk() {
        // deleteCategoryMutation.mutate(record.key);
      },
    });
  };
  // const handleCancel = () => {
  //   setIsDeleteModalOpen(false);
  // };
  // const handleDeleteModal = (id: any) => {
  //   setIsDeleteModalOpen(true);

  //   // console.log(typeof id);
  //   setSelectedItem(id);
  //   console.log(selectedItem);
  // };
  // const handleOk = async () => {
  //   const response = await http.post(`/catagory/delete`, { id: selectedItem });
  //   // console.log(response);

  //   setDeleted((prev) => !prev);
  //   setIsDeleteModalOpen(false);
  // };
  const handleAddModal = () => {
    setIsAddModalOpen(true);
  };
  useEffect(() => {
    console.log(editItem);
  }, [editItem]);
  const handleEditModal = (record: any) => {
    setEditItem(record);
    setIsAddModalOpen(true);
  };

  useEffect(() => {
    if (isAddModalOpen) {
      // The Modal is visible, update data if needed
    }
  }, [isAddModalOpen]);

  // console.log(editItem);
  // const key = "somthing;";

  return (
    <>
      <div className='w-4/5 mx-auto mt-10'>
        <h1 className='text-2xl text-center mb-6'>Category List</h1>
        <div>
          <div className='flex justify-between mb-2'>
            <Button
              className='bg-blue-500 text-white'
              type='primary'
              onClick={handleAddModal}>
              Add New Category
            </Button>

            <div className='flex gap-2'>
              <Input
                placeholder='Search Name'
                onChange={(e) =>
                  handleFilterChange(e.target.value, "catagoryName")
                }
                suffix={<SearchOutlined />}
              />
              <Input
                placeholder='Search ID'
                onChange={(e) => handleFilterChange(e.target.value, "id")}
                suffix={<SearchOutlined />}
              />
            </div>
          </div>
        </div>
        <Table
          className='rounded-lg'
          dataSource={dataSourceDB}
          columns={columns}
          loading={isLoading}
          pagination={{ position: ["bottomCenter"] }}
          size='small'></Table>

        <Modal
          title='Category Registration'
          open={isAddModalOpen}
          onCancel={setIsAddModalOpen.bind(this, false)}>
          <AddCategory record={editItem}></AddCategory>
        </Modal>
      </div>
    </>
  );
};
export default DisplaySuppliers;
