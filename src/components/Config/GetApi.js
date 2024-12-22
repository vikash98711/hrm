import axios from "axios"
import { url } from "../URL/Url"
import { useContext } from "react";
import { SidebarContext } from "../../context/sidebarContext";





export const GetAlldepartment = async()=>{
    // const {department, SetDepartment} = useContext(SidebarContext);

    try {
        const token = sessionStorage.getItem('token');
        // const res = await axios.get(`${url}/getAlldepartment`);
        const res = await axios.get(`${url}/getAlldepartment`, {
            headers: {
              Authorization: token, // Add the token to the Authorization header
            },
          });
       
        return res.data.resultdata;
    } catch (error) {
        console.error("Error fetching departments:", error);
    }
}


export const GetAllRole = async()=>{
    try {


        const token = sessionStorage.getItem('token');
     
        
        // const res = await axios.get(`${url}/getAlldepartment`);
      
        // return res.data.resultdata;
        const res = await axios.get(`${url}/getrole`, {
            headers: {
              Authorization: token, // Add the token to the Authorization header
            },
          });




        // const res = await axios.get(`${url}/getrole`)
        // console.log("roledata",res);
        return res.data.result
    } catch (error) {
        console.error("Error fetching departments:", error);
        
    }
   
    
}

export const GetAllEmployee = async ()=>{
    try {
        const res = await axios.get('http://localhost:4000/api/user/employees')
       
        // UserData(res.data.employees)
        return res.data.employees
    } catch (error) {
        console.error("Error fetching departments:", error);
        
    }
  
    
  }