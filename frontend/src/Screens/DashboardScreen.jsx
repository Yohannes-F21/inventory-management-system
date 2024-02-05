import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Avatar, Layout, Menu, theme } from "antd";
import { Outlet, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ticktime from '../img/ticktime-banner.png'
import {
  authLogout
} from "../Redux/features/authActions";
import { FetchAdmin, FetchAllAdmins, FetchAllCourses, FetchAllStudents, FetchAllTeachers, FetchStudent, FetchTeacher } from "../Redux/features/dataActions";
import { ToastContainer, toast } from "react-toastify";
const { Header, Content, Footer, Sider } = Layout;

const notify = (text) => toast(text);


const DashboardScreen = () => {
  const { loggedInUser } = useSelector((state) => state.data);
  
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const { role, _id } = useSelector((state) => state.auth.user);
  console.log(role, _id);


  useEffect(() => {
    if (role === "admin") {
      // console.log("here", role, _id);F
      dispatch(FetchAdmin(_id)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          // console.log(res.payload, "payload");
          // setInitialValues({...initialValues, name: res.payload.name});
        } else if (res.meta.requestStatus === "rejected") {
          return notify(res.payload);
        }
      });
      dispatch(FetchAllTeachers())
      dispatch(FetchAllAdmins())
      dispatch(FetchAllStudents())
      dispatch(FetchAllCourses())
    } else if (role === "teacher") {
      dispatch(FetchTeacher(_id)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          // console.log(res.payload, "payload");
          // setInitialValues({...initialValues, name: res.payload.name});
        } else if (res.meta.requestStatus === "rejected") {
          return notify(res.payload);
        }
      });
    } else if (role === "student") {
      dispatch(FetchStudent(_id)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          // console.log(res.payload, "payload");
          // setInitialValues({...initialValues, name: res.payload.name});
        } else if (res.meta.requestStatus === "rejected") {
          return notify(res.payload);
        }
      });
    }
  }, []);


  function getItem(label, key, icon, children, danger, disabled) {
    return {
      key,
      icon,
      children,
      label,
      danger,
      disabled
    };
  }
  const adminItems = [
    getItem(
      <Link to=''>Dashboard</Link>,
      "1",
      <Icon icon='akar-icons:dashboard' />
    ),
    getItem(
      <Link to='teachers-page'>Teachers</Link>,
      "2",
      <Icon icon='ph:chalkboard-teacher-light' />
    ),
    getItem(
      <Link to='students-page'>Students</Link>,
      "3",
      <Icon icon='ph:student-light' />
    ),
    getItem(
      <Link to='admins-page'>Admins</Link>,
      "4",
      <Icon icon='eos-icons:admin-outlined' />
    ),
    getItem(
      <Link to='courses-page'>Courses</Link>,
      "5",
      <Icon icon='tdesign:course' />
    ),
    getItem(
      <Link to='departments-page'>Departments</Link>,
      "6",
      <Icon icon='cil:school' />
    ),
    getItem(
      <Link to='logs-page'>Log</Link>,
      "7",
      <Icon icon='icon-park-outline:log' />
    ),
    getItem(
      <span onClick={() => dispatch(authLogout())}>Logout</span>,
      "8",
      <Icon icon='humbleicons:logout' />,
      null,
      true
    ),
  ];

  const teacherItems = [
    getItem(
      <Link to=''>Dashboard</Link>,
      "1",
      <Icon icon='akar-icons:dashboard' />
    ),
    getItem(
      <Link to='take-attendance'>Take Attendance</Link>,
      "2",
      <Icon icon='mdi:tick-all' />
    ),
    getItem(
      <Link to='my-courses'>My Courses</Link>,
      "3",
      <Icon icon='tdesign:course' />
    ),
    getItem(
      <span onClick={() => dispatch(authLogout())}>Logout</span>,
      "5",
      <Icon icon='humbleicons:logout' />,
      null,
      true
    ),
  ];
  const studentItems = [
    getItem(
      <Link to=''>Dashboard</Link>,
      "1",
      <Icon icon='akar-icons:dashboard' />
    ),
    getItem(
      <Link to='my-courses'>My Courses</Link>,
      "2",
      <Icon icon='tdesign:course' />
    ),
    getItem(
      <span onClick={() => dispatch(authLogout())}>Logout</span>,
      "3",
      <Icon icon='humbleicons:logout' />,
      null,
      true
    ),
  ];
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme='light'>
        <div className='demo-logo-vertical p-4' >
          <img
          src={ticktime}
          alt='Ticktime'
          className=''
          />
        </div>
        <Menu
          theme='light'
          defaultSelectedKeys={["1"]}
          mode='inline'
          items={ 
            loggedInUser?.role === "admin"
              ? adminItems
              : loggedInUser?.role === "teacher"
              ? teacherItems
              : studentItems
          }
        />
      </Sider>
      <Layout>
        <Header
          className='flex justify-between items-center'
          style={{
            padding: 16,
            background: colorBgContainer,
          }}>
          <h1 className='text-2xl'>Hello there, {loggedInUser?.name}</h1>
          <Link to="profile">
            <Avatar
              className='cursor-pointer flex items-center justify-center'
              size='large'
              icon={<Icon icon='ep:user' />}
            />
          </Link>
        </Header>
        <Content
          style={{
            margin: "0 16px",
          }}>
          <ToastContainer/>
          <Outlet />
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}>
          ©{new Date().getFullYear()} Made by Yohannes Teshome
        </Footer>
      </Layout>
    </Layout>
  );
};
export default DashboardScreen;
