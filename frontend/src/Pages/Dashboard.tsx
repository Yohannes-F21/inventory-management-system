import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Space, Statistic, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { getCustomers, getInventory, getOrders, getRevenue } from "../../API";
import TransactionChart from "../Components/TransactionChart.tsx";
// import { Employee } from "../data/Employee";
// import { Items } from "../data/InventoryItem";
// import { Loan } from "../data/Loan";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Bar } from "react-chartjs-2";
// import TransactionChart from "../Components/TransactionChart";
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );
function Dashboard() {
  const [orders, setOrders] = useState(0);
  const [inventory, setInventory] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    getOrders().then((res) => {
      setOrders(res.total);
      setRevenue(res.discountedTotal);
    });
    getInventory().then((res) => {
      setInventory(res.total);
    });
    getCustomers().then((res) => {
      setCustomers(res.total);
    });
  }, []);

  return (
    <div className="w-full p-8">
      <Typography.Title level={4}>Dashboard</Typography.Title>
      <div className="flex justify-center gap-4">
        <DashboardCard
          icon={
            <ShoppingCartOutlined
              style={{
                color: "green",
                backgroundColor: "rgba(0,255,0,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Loans"}
          value={orders}
        />
        <DashboardCard
          icon={
            <ShoppingOutlined
              style={{
                color: "blue",
                backgroundColor: "rgba(0,0,255,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Inventory"}
          value={inventory}
        />
        <DashboardCard
          icon={
            <UserOutlined
              style={{
                color: "purple",
                backgroundColor: "rgba(0,255,255,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Customer"}
          value={customers}
        />
        <DashboardCard
          icon={
            <DollarCircleOutlined
              style={{
                color: "red",
                backgroundColor: "rgba(255,0,0,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Total Price"}
          value={revenue}
        />
      </div>
      <div className="mt-10">
        <TransactionChart />
      </div>
    </div>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <Card className="w-1/4 shadow-xl">
      <Space direction="horizontal" size={30}>
        {icon}
        <Statistic title={title} value={value} />
      </Space>
    </Card>
  );
}
// function RecentOrders() {
//   const [dataSource, setDataSource] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     getOrders().then((res) => {
//       setDataSource(res.products.splice(0, 5));
//       setLoading(false);
//     });
//   }, []);

//   return (
//     <div className="flex justify-center">
//       <div className="w-2/3 mt-2">
//         <Typography.Title level={4}>Recent Orders</Typography.Title>
//         <Table
//           className="mx-auto"
//           columns={[
//             {
//               title: "Title",
//               dataIndex: "title",
//             },
//             {
//               title: "Quantity",
//               dataIndex: "quantity",
//             },
//             {
//               title: "Price",
//               dataIndex: "discountedPrice",
//             },
//           ]}
//           loading={loading}
//           dataSource={dataSource}
//           pagination={false}
//         ></Table>
//       </div>
//     </div>
//   );
// }

// function RecentOrders() {
//   const [employeeList] = useState<Employee[]>(() => {
//     const storedEmployees = localStorage.getItem("employees");
//     return storedEmployees ? JSON.parse(storedEmployees) : [];
//   });
//   const [itemList] = useState<Items[]>(() => {
//     const storedItems = localStorage.getItem("Items");
//     return storedItems ? JSON.parse(storedItems) : [];
//   });

//   const [orderdLists] = useState<Loan[]>(() => {
//     const orderList = employeeList
//       .map((employee) => employee.orderdItems)
//       .flat(1);
//     // console.log(orderList);
//     return orderList;
//   });
//   const [dataColumns] = useState<Loan[]>(() => {
//     return orderdLists.map((entry) => {
//       const fname = employeeList.find((employee) => {
//         return employee.key === entry.employeeId;
//       })?.firstName;
//       const Lname = employeeList.find((employee) => {
//         return employee.key === entry.employeeId;
//       })?.lastName;

//       // setEmpName(fname + " " + Lname);

//       const it = itemList.find((item) => {
//         return item.key === entry.itemId;
//       })?.productName;

//       return {
//         key: entry.key,
//         itemId: entry.itemId,
//         employeeId: entry.employeeId,
//         loanDate: entry.loanDate,
//         itemName: it,
//         employeeName: fname + " " + Lname,
//         price: entry.price,
//         loanStatus: entry.loanStatus,
//         returnDate: entry.returnDate,
//       } as Loan;
//     });
//   });
//   const [dataSource] = useState<Loan[]>(dataColumns.splice(0, 5));

//   return (
//     <div className="flex justify-center">
//       <div className="w-[80%] my-3">
//         <Typography.Title level={4}>Recent Loans</Typography.Title>
//         <Table
//           className="rounded-lg w-full flex-1"
//           dataSource={dataSource}
//           columns={[
//             {
//               title: "Employee Name",
//               dataIndex: "employeeName",
//               key: "employeeName",
//             },
//             {
//               title: "Item Name",
//               dataIndex: "itemName",
//               key: "itemName",
//             },

//             {
//               title: "Price",
//               dataIndex: "price",
//               key: "price",
//             },
//             {
//               title: " Status",
//               dataIndex: "loanStatus",
//               key: "loanStatus",
//               render: (_text: string, record: any) => (
//                 <Tag
//                   bordered={false}
//                   color={record.loanStatus === "Borrowed" ? "success" : "red"}
//                   className={
//                     record.loanStatus === "Borrowed"
//                       ? "bg-[#d9f99d]"
//                       : "bg-[#fecaca]"
//                   }
//                 >
//                   {record.loanStatus}
//                 </Tag>
//               ),
//             },
//             {
//               title: "Return Date",
//               dataIndex: "returnDate",
//               key: "returnDate",
//             },
//             {
//               title: "Loan Date",
//               dataIndex: "loanDate",
//               key: "loanDate",
//               sorter: (a: { loanDate: string }, b: { loanDate: string }) => {
//                 // Parse the date strings into Date objects for comparison
//                 const dateA = new Date(a.loanDate);
//                 const dateB = new Date(b.loanDate);
//                 return dateA.getTime() - dateB.getTime();
//               },
//               // Define sort directions (ascending and descending)
//               defaultSortOrder: "ascend",
//             },
//           ]}
//           pagination={false}
//         ></Table>
//       </div>
//     </div>
//   );
// }

// function DashboardChart() {
//   const [reveneuData, setReveneuData] = useState({
//     labels: [],
//     datasets: [],
//   });

//   useEffect(() => {
//     getRevenue().then((res) => {
//       const labels = res.carts.map((cart) => {
//         return `User-${cart.userId}`;
//       });
//       const data = res.carts.map((cart) => {
//         return cart.discountedTotal;
//       });

//       const dataSource = {
//         labels,
//         datasets: [
//           {
//             label: "Revenue",
//             data: data,
//             backgroundColor: "rgba(255, 0, 0, 1)",
//           },
//         ],
//       };

//       setReveneuData(dataSource);
//     });
//   }, []);

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "bottom",
//       },
//       title: {
//         display: true,
//         text: "Order Revenue",
//       },
//     },
//   };

//   return (
//     <Card style={{ width: 500, height: 250 }}>
//       <Bar options={options} data={reveneuData} />
//     </Card>
//   );}

export default Dashboard;
