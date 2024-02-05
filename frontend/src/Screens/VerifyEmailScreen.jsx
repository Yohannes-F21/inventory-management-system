import { useLocation } from "react-router-dom";
import { Button } from "antd";
import ticktime from '../img/ticktime-banner.png'
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
    UserVerifyEmail
} from "../Redux/features/authActions"
import { useNavigate } from "react-router-dom";



function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const notify = (text) => toast(text);

const VerifyEmailScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  const query = useQuery();
  
  const verifyEmail = () => {
      dispatch(UserVerifyEmail({ email: query.get("email"), verificationToken: query.get("token") })).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          notify("Email Verified");
          return navigate("/dashboard");
        }
        if (res.meta.requestStatus === "rejected") {
          notify(res.payload.message);
        }
      });
    
  }
    
    return (
      <div className='flex flex-col items-center justify-center w-full h-screen gap-4'>
        <ToastContainer />
        <img
          src={ticktime}
          alt='TickTime Logo'
          className='w-[20%]'
          />
        <h1 className="font-bold text-2xl">Please Verify your Email</h1>
        <p>Welcome to TickTime, please verify your email using this link and change the inital password given to you to secure your account.</p>
        <Button className="bg-blue-500 text-white hover:bg-white hover:text-blue-500" onClick={verifyEmail}>Verify Email</Button>
      </div>
    );
}
export default VerifyEmailScreen