import { Link } from 'react-router-dom';
import { Button,Input,Avatar  } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const Settings = () => {

    return (

        <div className="rounded-3xl bg-white w-full  lg:w-1/3 lg:m-auto p-12" >
          <h1 className="text-3xl font-semibold text-center my-7 text-primary">Profile</h1>
          <div className='flex justify-center align-center'>
          <Avatar size={64} icon={<UserOutlined />} className='mb-8 text-c'/>

          </div>
          <form className="flex flex-col gap-4">
    
          <Input placeholder="Name" />
          <Input placeholder="Email" />
          <Input placeholder="Password" />
          
          <Button>Update</Button>
          </form>
          <div className="flex justify-between mt-5">
            <span
             
              className="text-red-700 cursor-pointer"
            >
              Delete account
            </span>
            <span  className="text-red-700 cursor-pointer">
              Sign out
            </span>
          </div>
  
       
        
        </div>
      
    
    );
};
export default Settings;
