import React, { useEffect, useState } from "react";
import { Drawer, Form, Input, Button } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import banner from "../img/banner.png";
import ticktime from "../img/ticktime-banner.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserLogin, UserForgetPassword } from "../Redux/features/authActions";
import FormItem from "antd/es/form/FormItem";

const notify = (text) => toast(text);

const LoginScreen = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [Loading, setLoading] = useState(false);
  const [formvalue, setFormvalue] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();

  const Handlechange = (e) => {
    setFormvalue({ ...formvalue, [e.target.name]: e.target.value });
  };

  const HandleSubmit = (e) => {
    // e.preventDefault();
    setLoading(true);
    if (formvalue.email !== "" && formvalue.password !== "") {
      let data = {
        ...formvalue,
        email: formvalue.email,
      };
      dispatch(UserLogin(data)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          notify("Login Successful");
          setLoading(false);
          return navigate("/verify-otp?email=" + formvalue.email);
        }
        if (res.meta.requestStatus === "rejected") {
          // console.log(res.payload.message);
          setLoading(false);
          notify("Wrong credentials!");
        }
        if (res.payload.message === "Error") {
          setLoading(false);
          notify("Something went Wrong, Please Try Again");
        }
      });
    }
  };

  const [ForgetPassword, setForgetPassword] = useState({
    email: "",
  });

  const HandleForgetPassword = (e) => {
    setForgetPassword({ ...ForgetPassword, [e.target.name]: e.target.value });
  };

  const [forgetLoading, setforgetLoading] = useState(false);

  const HandleChangePassword = () => {
    console.log(ForgetPassword.email);
    if (ForgetPassword.email === "") {
      return notify("Please Fill all Details");
    }
    setforgetLoading(true);
    dispatch(UserForgetPassword({ email: ForgetPassword.email })).then(
      (res) => {
        console.log(ForgetPassword.email, "email");
        if (res.meta.requestStatus === "rejected") {
          setforgetLoading(false);
          return notify("User Not Found");
        }
        setForgetPassword({
          email: "",
        });
        onClose();
        setforgetLoading(false);
        return notify("Please check your email for reset password link!");
      }
    );
  };

  return (
    <>
      <ToastContainer />

      <div className='mainLoginPage flex w-full h-screen bg-[#F5F5F5]'>
        <div className='leftside w-full flex items-center justify-center bg-white'>
          <img
            className='w-full'
            src={banner}
            alt='banner'
          />
        </div>
        <div className='rightside flex flex-col items-center justify-center w-full'>
          <div className='flex flex-col items-center gap-2'>
            <h1 className='text-3xl font-bold'>Login</h1>
            <div className='w-full flex flex-col items-center justify-center'>
              <Form
                className='flex flex-col items-center justify-center w-full'
                layout='vertical'
                onFinish={HandleSubmit}>
                <Form.Item
                  className='w-1/2'
                  name='email'
                  label={"Email"}
                  rules={[
                    {
                      type: "email",
                      message: "The input is not valid E-mail!",
                    },
                    {
                      required: true,
                      message: "Please input your E-mail!",
                    },
                  ]}>
                  <Input
                    type='email'
                    name='email'
                    className='w-full'
                    value={formvalue.email}
                    onChange={Handlechange}
                    required
                  />
                </Form.Item>
                <FormItem
                  className='w-1/2'
                  name='password'
                  label='Password'
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}>
                  <Input
                    type='password'
                    name='password'
                    value={formvalue.password}
                    onChange={Handlechange}
                    required
                  />
                </FormItem>
                <Form.Item
                  label=' '
                  colon={false}>
                  <Button
                    type='default'
                    className='bg-blue-500 text-white hover:text-blue-500 hover:bg-white text-lg flex items-center justify-center px-12 py-5 rounded-3xl'
                    htmlType='submit'>
                    {Loading ? "Loading..." : " Login"}
                  </Button>
                  <Button
                    type='default'
                    className='border border-blue-500 text-white hover:text-blue-500 hover:bg-white text-lg flex items-center justify-center px-12 py-5 rounded-3xl'
                    htmlType='submit'>
                    {Loading ? "Loading..." : " Login using Google"}
                  </Button>
                </Form.Item>
              </Form>
              <p style={{ marginTop: "10px" }}>
                Forget Password?{" "}
                <span
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={showDrawer}>
                  Get it on Email !
                </span>
              </p>
              {/* Forgot Password Drawer */}
              <Drawer
                title='Forget Password'
                placement='left'
                onClose={onClose}
                open={open}>
                <Form
                  onFinish={HandleChangePassword}
                  className='flex flex-col gap-4'
                  layout='vertical'>
                  <Form.Item
                    name='email'
                    label='Email'
                    onChange={HandleForgetPassword}
                    rules={[
                      {
                        required: true,
                        message: "Email is required",
                      },
                    ]}>
                    <Input
                      placeholder='Input your Email'
                      value={ForgetPassword.email}
                      name='email'
                    />
                  </Form.Item>

                  <Form.Item colon={false}>
                    <Button
                      type='default'
                      className='bg-blue-500 text-white hover:text-blue-500 hover:bg-white text-md flex items-center justify-center px-8 py-4 rounded-3xl'
                      htmlType='submit'>
                      {forgetLoading ? "Loading..." : " Send Mail"}
                    </Button>
                  </Form.Item>
                </Form>
              </Drawer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginScreen;
