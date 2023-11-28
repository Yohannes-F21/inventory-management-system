import { Avatar, Button, Input, Modal, Table, message } from "antd";
import { useEffect, useState } from "react";
import { Employee } from "../data/Employee";
import { EyeFilled, SearchOutlined } from "@ant-design/icons";
import { Items } from "../data/InventoryItem";
import { Loan } from "../data/Loan";
import http from "../utils/http";
import { useQuery } from "react-query";

// import { Link } from "react-router-dom";

const EmployeeDisplay: React.FC = () => {
  const columns = [
    {
      title: "Profile",
      dataIndex: "image",
      key: "image",
      render: (_text: string, record: any) => <Avatar src={record.image} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "ID Number",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },

    {
      title: "Hired Date",
      dataIndex: "registerDate",
      key: "registerDate",
    },
    {
      title: "Actions",
      dataIndex: "edit",
      key: "edit",
      render: (_text: string, record: Employee) => (
        <div className="space-x-4 w-full flex">
          <Button
            icon={<EyeFilled />}
            shape="circle"
            className="bg-green-500 text-white border hover:border-none border-none "
            onClick={() => handleShowDetails(record.key)}
          ></Button>
        </div>
      ),
    },
  ];
  const modalColumns = [
    {
      title: "Item Id",
      dataIndex: "itemId",
      key: "itemId",
    },
    {
      title: "Item name",
      dataIndex: "itemName",
      key: "itemName",
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Return Date",
      dataIndex: "returnDate",
      key: "returnDate",
    },
  ];

  let count: number = 0;

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
  console.log(employee);

  const [filteredList, setFilteredList] = useState([]);
  useEffect(() => {
    setFilteredList(employee);
  }, [employee]);

  const handleFilterChange = (value: string, dataIndex: string) => {
    const filtered =
      employee &&
      employee.filter((employee: any) => {
        if (dataIndex === "name") {
          const name = employee.firstName + " " + employee.lastName;

          return name.toLowerCase().includes(value.toLowerCase());
        } else {
          const id = employee.employeeID;
          return id.toLowerCase().includes(value.toLowerCase());
        }
        // console.log(filtered);

        return employee[dataIndex as keyof any]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      });
    // console.log(filtered);

    setFilteredList(filtered);
  };
  // console.log(filteredList);
  let dataSourceDB: any[] = [];

  dataSourceDB =
    filteredList &&
    filteredList.map((employee: any) => {
      const date = new Date(employee.hiredDate).toLocaleDateString();
      count = count + 1;
      return {
        key: employee._id,
        name: employee.firstName + " " + employee.lastName,
        id: employee.employeeID,
        gender: employee.gender,
        email: employee.email,
        phone: employee.phone,
        registerDate: date,
      };
    });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>({} as any);

  const handleShowDetails = (key: string) => {
    setIsModalOpen(true);
    // const storedData = localStorage.getItem("employees");
    // let currentEmployee: Employee[] = [];
    // if (storedData) {
    //   currentEmployee = JSON.parse(storedData);
    // }

    const initialData = employee.find((employee: any) => employee._id === key);
    // console.log(initialData);

    if (initialData) {
      setSelectedEmployee(initialData);
    }

    console.log(selectedEmployee);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const employeeOrderdItems = selectedEmployee.loans?.map((entry: any) => {
    const date = new Date(entry.returnDate).toLocaleDateString();
    return {
      itemId: entry.loanID,
      loanDate: entry.loanDate,
      // itemName: it,
      itemName: entry.employeeID,
      price: entry.price,
      loanStatus: entry.status,
      returnDate: date,
    } as any;
  });

  return (
    <div className="w-4/5 mx-auto mt-10">
      <div className="w-[163px] h-[35px] text-black text-[32px] font-normal">
        Employees
      </div>
      <div className="flex justify-between mt-6">
        <div className="w-[155px] h-[35px] text-zinc-500 text-base font-normal">
          Total Employees
          <span className="text-black text-base font-normal px-1">{count}</span>
        </div>
        <div className="flex justify-end mb-3">
          <div className="flex gap-2">
            <Input
              placeholder="Search Name"
              onChange={(e) => handleFilterChange(e.target.value, "name")}
              suffix={<SearchOutlined />}
              // addonAfter={<SearchOutlined />}
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
        pagination={{ position: ["bottomCenter"] }}
        size="small"
      ></Table>
      <Modal
        title={selectedEmployee.firstName + " " + selectedEmployee.lastName}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Table
          className="rounded-lg"
          bordered
          dataSource={employeeOrderdItems}
          columns={modalColumns}
          loading={isEmployeeLoading}
          size="small"
        ></Table>
      </Modal>
    </div>
  );
};

export default EmployeeDisplay;
