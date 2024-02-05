import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
    UserSendOTP
} from "../Redux/features/authActions"
import { useNavigate } from "react-router-dom";



function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const notify = (text) => toast(text);



const OTPScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const query = useQuery();
    const [formvalue, setFormvalue] = useState({
        email: query.get("email") || "",
        otp: "",
    });

    const Handlechange = (e) => {
        setFormvalue({ ...formvalue, [e.target.name]: e.target.value });
    };
    
    const [Loading, setLoading] = useState(false);

    const HandleSubmit = (e) => {
        setLoading(true);
            dispatch(UserSendOTP(formvalue)).then((res) => {
                if (res.meta.requestStatus === "fulfilled") {
                    notify("Login Successful");
                    setLoading(false);
                    return navigate("/dashboard");
                }
                if (res.meta.requestStatus === "rejected") {
                    // console.log(res.payload.message);
                    setLoading(false);
                    notify("Please Input Correct OTP value!");
                }
            })
        
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-screen gap-4">
            <ToastContainer/>
      <Form
        className='flex flex-col items-center justify-center w-full'
        layout='vertical'
        onFinish={HandleSubmit}>
        <Form.Item
          className='w-1/2 flex flex-col gap-2 items-center justify-center'
          name='otp'
          label="Enter your OTP (One Time Password) sent to your email:"
          rules={[
            {
              required: true,
              message: "Please input your OTP code!",
            },
          ]}>
          <Input
            name='otp'
            className='w-full'
            value={formvalue.otp}
            onChange={Handlechange}
            required
          />
        </Form.Item>
        
        <Form.Item
          label=' '
          colon={false}>
          <Button
            type='default'
            className='bg-blue-500 text-white hover:text-blue-500 hover:bg-white text-lg flex items-center justify-center px-12 py-5 rounded-3xl'
            htmlType='submit'>
            {Loading ? "Loading..." : " Verify OTP "}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
export default OTPScreen