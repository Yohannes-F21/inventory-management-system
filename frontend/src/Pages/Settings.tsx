import { Link } from 'react-router-dom';

const Settings = () => {

    return (

        <div className="rounded-3xl bg-white w-full  lg:w-1/3 lg:m-auto p-16" >
          <h1 className="text-3xl font-semibold text-center my-7 text-primary">Profile</h1>
          <form className="flex flex-col gap-4">
    
            <input
              type="text"
              placeholder="username"
             
              id="username"
              className="border p-3 rounded-lg"
             
            />
            <input
              type="email"
              placeholder="email"
              id="email"
             
              className="border p-3 rounded-lg"
             
            />
            <input
              type="password"
              placeholder="password"
            
              id="password"
              className="border p-3 rounded-lg"
            />
          
            <Link
             to='/dashboard'
              className="transition-colors duration-300 border border-primary opacity-75 text-primary rounded-lg p-3 uppercase hover:bg-primary hover:text-white disabled:opacity-80 text-center"
            >
             Update
            </Link>
     
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
