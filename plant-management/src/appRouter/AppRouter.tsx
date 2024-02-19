import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../components/Login";
import Signup from "../components/Signup";
import Plants from "../components/Plants";
import AddPlant from "../components/AddPlant";
import EditPlant from "../components/EditPlant";
import ForgotPassword from "../components/ForgotPassword";
import EnterOTP from "../components/EnterOTP";
import ChangePassword from "../components/ChangePassword";
import XLSXDataDisplay from "../components/XLSXDataDisplay";



const AppRouter=createBrowserRouter([{
    path:"/",
    element:<App/>,
    children:[
        {
            index:true,
            element:<Login/>
        },
        {
            path:"/signup",
            element:<Signup/>
        },
        {
            path:'/plants',
            element:<Plants/>
        }
        ,
        {
            path:'/forgotpassword',
            element:<ForgotPassword/>
        }
        ,
        {
            path:'/login',
            element:<Login/>
        },
        {
            path:'/addplant',
            element:<AddPlant/>
        },
        {
            path:'editplant',
            element:<EditPlant/>
        }
        ,
        {
            path:'/enterotp',
            element:<EnterOTP/>
        }
        ,
        {
            path:'/changepassword',
            element :<ChangePassword/>
        },
        {
            path:'xlsxData',
            element:<XLSXDataDisplay/>
        }


    ]
}])

export default AppRouter