import {
  AppstoreOutlined,
  DashboardOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SettingOutlined,
  ContainerOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Avatar } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
const { Sider } = Layout;

const menuItems = [
  {
    key: "1",
    title: "Dashboard",
    icon: <DashboardOutlined />,
    path: "",
    subItems: [],
  },
  {
    key: "2",
    title: "Inventory",
    icon: <ShopOutlined />,
    path: "/inventory",
    subItems: [],
  },
  {
    key: "3",
    title: "Category",
    icon: <UnorderedListOutlined />,
    path: "/categorys",
    subItems: [],
  },
  {
    key: "4",
    title: "Suppliers",
    icon: <AppstoreOutlined />,
    path: "/suppliers",
    subItems: [],
  },
  {
    key: "5",
    title: "Loans",
    icon: <ContainerOutlined />,
    path: "/loans",
    subItems: [],
  },
  {
    key: "6",
    title: "Orders",
    icon: <ShoppingCartOutlined />,
    path: "/orders",
    subItems: [],
  },
  {
    key: "7",
    title: "Customers",
    icon: <UserOutlined />,
    path: "/customers",
    subItems: [],
  },
  {
    key: "8",
    title: "Settings",
    icon: <SettingOutlined />,
    path: "/settings",
    subItems: [],
  },
];

function SideMenu() {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/");
  const [collapsed, setCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  return (
    <div className="SideMenu ">
      {/* <Menu
        className="SideMenuVertical  "
        mode="vertical"
        onClick={(item) => {
          //item.key
          navigate(item.key);
        }}
        selectedKeys={[selectedKeys]}
        items={[
          {
            label: "Dashbaord",
            icon: <AppstoreOutlined />,
            key: "/",
          },
          {
            label: "Inventory",
            key: "/inventory",
            icon: <ShopOutlined />,
          },
          {
            label: "Orders",
            key: "/orders/list",
            icon: <ShoppingCartOutlined />,
          },
          {
            label: "Customers",
            key: "/customers",
            icon: <UserOutlined />,
          },
        ]}
      ></Menu> */}
      <Sider
        className="h-full border-r-2 border-r-gray-300 bg-[#001529] "
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
      >
        <div className="logo flex items-center gap-4 mx-auto w-fit mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 70 56"
            fill="none"
          >
            <path
              d="M47.9044 0C43.4624 0 39.63 2.43673 37.2783 6.12663C41.1978 9.88615 43.5495 15.0381 43.5495 20.9559C43.5495 22.9749 43.2882 24.785 42.7656 26.5951C44.4205 27.361 46.0753 27.9179 47.9044 27.9179C55.1336 27.9179 60.9693 21.6521 60.9693 13.9938C60.9693 6.33549 55.1336 0.0696208 47.9044 0.0696208V0ZM21.7747 6.96208C14.5455 6.96208 8.70989 13.2279 8.70989 20.8862C8.70989 28.5445 14.5455 34.8104 21.7747 34.8104C29.0039 34.8104 34.8396 28.5445 34.8396 20.8862C34.8396 13.2279 29.0039 6.96208 21.7747 6.96208ZM63.1467 28.9622C59.4015 32.5129 54.2626 34.6711 48.427 34.8104C50.7787 37.456 52.2594 40.6585 52.2594 44.1396V48.7345H69.6791V37.1775C69.6791 33.5572 66.9791 30.4243 63.1467 28.8926V28.9622ZM6.53242 35.9243C2.70007 37.456 0 40.5889 0 44.2092V55.7662H43.5495V44.2092C43.5495 40.5889 40.8494 37.456 37.017 35.9243C33.0976 39.6142 27.7846 41.7725 21.7747 41.7725C15.7649 41.7725 10.4519 39.5446 6.53242 35.9243Z"
              fill="#0084D0"
            />
          </svg>
          <span
            className={` font-semibold text-white  ${
              collapsed ? "hidden" : ""
            }`}
          >
            HRMS
          </span>
        </div>
        <div className="flex items-center justify-center gap-4 border mx-4 p-2 rounded-md hover:bg-[#1677FF] transition">
          <Avatar
            size={collapsed ? 24 : 32}
            className="grid place-items-center bg-white"
            icon={<UserOutlined className="text-gray-900" />}
          />
          <div
            className={`text-gray-900 font-semibold ${
              collapsed ? "hidden" : ""
            }`}
          >
            <p className="font-semibold text-white">Yohannes</p>
            <span className="text-xs text-white">Admin</span>
          </div>
        </div>
        <div className={`border mt-4 ${collapsed ? "" : "hidden"}`}></div>
        <Menu mode="inline" className="h-full" theme="dark">
          {menuItems.map((menuItem) => (
            // Check if menuItem has subItems
            // Render a regular menu item
            <Menu.Item key={menuItem.key} icon={menuItem.icon}>
              <Link to={menuItem.path}>{menuItem.title}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
    </div>
  );
}
export default SideMenu;
