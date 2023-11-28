import React, { useEffect, useState } from "react";
import {
  Select,
  Button,
  message,
  Table,
  DatePicker,
  Form,
  Tag,
  Input,
  Modal,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
// import { v4 as uuidv4 } from "uuid";
// import { Employee } from "../data/Employee";
// import { Items } from "../data/InventoryItem";
// import { Loan } from "../data/Loan";
import http from "../utils/http";
import { useQuery, useMutation, useQueryClient } from "react-query";
// import { Link } from "react-router-dom";
const { Option } = Select;
const { confirm } = Modal;

const AddLoan: React.FC = () => {
  const columns = [
    {
      title: "Loan ID",
      dataIndex: "loanID",
      key: "loanID",
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: " Status",
      dataIndex: "loanStatus",
      key: "loanStatus",
      render: (_text: string, record: any) => (
        <Tag
          bordered={false}
          color={record.loanStatus === "Borrowed" ? "success" : "red"}
          className={
            record.loanStatus === "Borrowed" ? "bg-[#d9f99d]" : "bg-[#fecaca]"
          }
        >
          {record.loanStatus}
        </Tag>
      ),
    },
    {
      title: "Return Date",
      dataIndex: "returnDate",
      key: "returnDate",
    },
    {
      title: "Loan Date",
      dataIndex: "loanDate",
      key: "loanDate",
      // sorter: (a: { loanDate: string }, b: { loanDate: string }) => {
      //   // Parse the date strings into Date objects for comparison
      //   const dateA = new Date(a.loanDate);
      //   const dateB = new Date(b.loanDate);
      //   return dateA.getTime() - dateB.getTime();
      // },
      // // Define sort directions (ascending and descending)
      // defaultSortOrder: "ascend",
    },
    {
      title: "Actions",
      dataIndex: "edit",
      key: "edit",
      render: (_text: string, record: any) => (
        <div className="space-x-4 w-full flex">
          {/* <Link to={`/inventory/edit/${record.key}`}>
          <Button
            icon={<EditOutlined />}
            shape="circle"
            className="bg-blue-500 text-white border hover:border-none  border-none "
            type="primary"
          ></Button>
        </Link> */}

          <Button
            onClick={() => handleStatusChange(record)}
            className="bg-green-400 text-white border hover:border-none border-none hover:text-white"
          >
            {" "}
            Return
          </Button>
          <Button
            icon={<DeleteOutlined />}
            shape="circle"
            className="bg-red-400 text-white border hover:border-none border-none "
            onClick={() => showDeleteConfirm(record)}
          ></Button>
        </div>
      ),
    },
  ];
  const [form] = Form.useForm();

  const [returnDate, setReturnDate] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();

  const fetchInventryData = async () => {
    try {
      const response = await http.get("/product");
      // console.log(response);

      return response.data;
    } catch (error: any) {
      message.error(error.message);
    }
  };
  const { data: product, isLoading: isProductLoading } = useQuery(
    "product",
    fetchInventryData
  );
  // console.log(product);

  const fetchEmployeeData = async () => {
    try {
      const response = await http.get("/employee");
      // console.log(response.data);

      return response.data;
    } catch (error: any) {
      message.error(error.message);
    }
  };
  const { data: employee, isLoading: isEmployeeLoading } = useQuery(
    "employee",
    fetchEmployeeData
  );
  // console.log(employee);

  const sendLoanData = async (formData: any) => {
    try {
      const response = await http.post("/loan", formData);
      return response.data;
    } catch (error: any) {
      message.error(error.message);
      console.log(error);
    }
  };
  const addloanMutation = useMutation(sendLoanData, {
    onSuccess: () => {
      queryClient.invalidateQueries("loan");
    },
  });
  //  const updateSingleLoanData = async (formData: any) => {
  //    try {
  //      const response = await http.put("/supplier", { formData, key });

  //      return response.data;
  //    } catch (error: any) {
  //      message.error(error.message);
  //      console.log(error);
  //    }
  //  };
  //  const updateOrderMutation = useMutation(updateSingleOrderData, {
  //    onSuccess: () => {
  //      queryClient.invalidateQueries("order");
  //    },
  //  });
  const onFinish = (formData: any) => {
    if (isEditing) {
      //  updateSingleSupplierData(formData);
    } else {
      formData.returnDate = returnDate;
      // sendLoanData(formData);
      addloanMutation.mutate(formData);
      // console.log(formData);
      form.resetFields();
    }
  };

  const deleteLoan = async (selectedItem: string) => {
    const response = await http.post(`/loan/delete`, { id: selectedItem });

    return response.data;
  };
  const deleteLoanMutation = useMutation(deleteLoan, {
    onSuccess: () => {
      queryClient.invalidateQueries("loan");
    },
  });

  const showDeleteConfirm = (record: any) => {
    confirm({
      title: `Are you sure you want to delete ${record.loanID}?`,
      icon: <ExclamationCircleFilled />,
      content: "This action cannot be undone!",
      okType: "danger",
      onOk() {
        deleteLoanMutation.mutate(record.key);
      },
    });
  };

  const fetchLoanData = async () => {
    try {
      const response = await http.get("/loan");
      // console.log(response);

      return response.data;
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const { data: loans, isLoading } = useQuery(["loan"], fetchLoanData);
  // console.log(loans);

  const [filteredList, setFilteredList] = useState([]);
  useEffect(() => {
    setFilteredList(loans);
  }, [loans]);

  const handleFilterChange = (value: string, dataIndex: string) => {
    const filtered =
      loans &&
      loans.filter((loan: any) => {
        if (dataIndex === "loanName") {
          const name = loan.employee.firstName + " " + loan.employee.lastName;

          return name.toLowerCase().includes(value.toLowerCase());
        }
        // console.log(filtered);

        return loan[dataIndex as keyof any]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      });
    // console.log(filtered);

    setFilteredList(filtered);
  };

  let dataSourceDB: any[] = [];
  if (loans) {
    dataSourceDB =
      filteredList &&
      filteredList
        .map((loan: any) => {
          const loDate = new Date(loan.loanDate).toLocaleDateString();
          const retDate = new Date(loan.returnDate).toLocaleDateString();
          return {
            key: loan._id,
            loanID: loan.loanID,
            itemName: loan?.product?.productName,
            employeeName:
              loan?.employee?.firstName + " " + loan?.employee?.lastName,
            price: loan.product.price,
            loanStatus: loan.status,
            returnDate: retDate,
            loanDate: loDate,
          };
        })
        .reverse();
  }

  const handleDateChange = (date: Dayjs | null) => {
    // Convert the Day.js object to a string in the desired format
    const dateString = date ? date.format("M/D/YY") : "";
    setReturnDate(dateString);
    console.log(returnDate);
  };
  const addEventMutation = useMutation((id: string) =>
    http.put(`/loan`, { _id: id })
  );
  const handleStatusChange = async (record: any) => {
    loanStatusMutation.mutate(record.key);
  };
  const statusChange = async (id: string) => {
    try {
      const response = await addEventMutation.mutateAsync(id);
      console.log(response?.data);

      // Handle successful mutation
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };
  const loanStatusMutation = useMutation(statusChange, {
    onSuccess: () => {
      queryClient.invalidateQueries("loan");
    },
  });

  return (
    <>
      <div className="flex-col mx-auto w-3/4">
        <div className=" my-10  w-full  rounded-2xl border border-gray-200 shadow-md bg-white pb-4">
          <div className=" p-5">
            <h2 className="text-2xl text-center mb-6">New Loan</h2>

            <div className="steps-content">
              <div className="steps-content-inner">
                <Form
                  name="loan_creation"
                  onFinish={onFinish}
                  className="grid grid-cols-4 gap-x-7"
                  form={form}
                >
                  <Form.Item
                    name="employeeID"
                    rules={[
                      {
                        required: true,
                        message: "Please select Employee",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Select Employee"
                      optionFilterProp="children"
                      className="border-gray-300 border rounded-lg w-full"
                      // size="large"
                    >
                      {!isEmployeeLoading &&
                        employee.map((employee: any) => (
                          <Option key={employee._id} value={employee._id}>
                            {employee.firstName + " " + employee.lastName}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="productID"
                    rules={[
                      {
                        required: true,
                        message: "Please select product",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Select Product"
                      optionFilterProp="children"
                      className="border-gray-300 border rounded-lg w-full"
                      // size="large"
                    >
                      {!isProductLoading &&
                        product.map((product: any) => (
                          <Option key={product.key} value={product._id}>
                            {product.productName}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <DatePicker
                      name="returnDate"
                      onChange={handleDateChange}
                      // value={returnDate ? dayjs(returnDate) : null}
                      placeholder="Return Date"
                      className="border-gray-300 border  rounded-lg w-full"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="border-gray-300 border rounded-lg w-full bg-green-500"
                    >
                      {isEditing ? "Update" : "Add"} Loan
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
        <h2 className="text-xl  mb-3">Loan List</h2>
        <div className="w-full">
          <div className="flex justify-end">
            <div className="flex mb-2">
              <Input
                placeholder="Search Name"
                onChange={(e) => handleFilterChange(e.target.value, "loanName")}
                suffix={<SearchOutlined />}
              />
            </div>
          </div>
          <Table
            className="rounded-lg w-full flex-1"
            dataSource={dataSourceDB}
            columns={columns}
            loading={isLoading}
            pagination={{ position: ["bottomCenter"] }}
            size="small"
          ></Table>
        </div>
      </div>
    </>
  );
};

export default AddLoan;
