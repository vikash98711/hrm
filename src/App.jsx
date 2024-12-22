import './App.css';
import Sidebar from './layout/Sidebar/Sidebar';
import Content from './layout/Content/Content';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ContentMain from './components/ContentMain/ContentMain';
import Page1 from './components/Pages/Page1';
import VendorDocument from './components/Pages/VendorDocument';
import DepartMent from './components/Pages/DepartMent';
import Login from './components/Login/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Role from './components/Pages/Role';
import Employee from './components/Pages/Employee';
import EditRole from './components/Pages/EditRole';
import DepartmentEdit from './components/Pages/DepartmentEdit';
import Leaves from './components/Pages/Leaves';
import { useContext, useEffect } from 'react';
import { GetAlldepartment, GetAllEmployee, GetAllRole } from './components/Config/GetApi';
import { SidebarContext } from './context/sidebarContext';
import EmployeeView from './components/Pages/EmployeeView';
import AddAtendence from './components/Pages/Attendence/AddAtendence';
import LeaveType from './components/Pages/Leaves/LeaveType';
import { url } from './components/URL/Url';
import axios from 'axios';
import Chat from './components/Pages/Chat/Chat';
import AttendenceRecord from './components/Pages/Attendence/AttendenceRecord';
import BulkEmail from './components/Pages/BulkMail/BulkEmail';

function App() {
  const { SetDepartment, SetRole, UserData } = useContext(SidebarContext);
  const Navigate = useNavigate();

  const LoginAuthFunc = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const Response = await axios.get(
        `${url}/api/userLogin/checkLogin`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (Response.status === 200) {
        console.log("User is authenticated.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired, redirecting to login...");
        sessionStorage.clear(); // Clear session storage to remove invalid token
        Navigate("/login"); // Redirect to login page
      } else {
        console.error("Authentication error:", error.message);
      }
    }
  };

  const AllServerFunc = async () => {
    try {
      const departmentData = await GetAlldepartment();
      SetDepartment(departmentData);

      const RoleData = await GetAllRole();
      SetRole(RoleData);

      const Users = await GetAllEmployee();
      UserData(Users);
    } catch (error) {
      console.error("Error in AllServerFunc:", error);
    }
  };

  useEffect(() => {
    LoginAuthFunc();
    AllServerFunc();
  }, []);

  const token = sessionStorage.getItem('token'); // Check if token exists

  return (
    <div className="app">
      {/* Show Sidebar only if the user is logged in */}
      {token && <Sidebar />}

      <div className="content">
        <Routes>
          <Route path="/Login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Content />}>
              <Route index element={<ContentMain />} />
              <Route path="/admin/Dashboard" element={<ContentMain />} />
              <Route path="/department" element={<DepartMent />} />
              <Route path="/departmentedit/:id" element={<DepartmentEdit />} />
              <Route path="/Role" element={<Role />} />
              <Route path="/editrole/:id" element={<EditRole />} />
              <Route path="/leaves" element={<Leaves />} />
              <Route path="/LeaveType" element={<LeaveType />} />
              <Route path="/Employee" element={<Employee />} />
              <Route path="/attendenceRecord" element={<AttendenceRecord />} />
              <Route path="/admin/chat" element={<Chat />} />
              <Route path="/admin/BulkEmail" element={<BulkEmail />} />
              <Route path="/admin/employeeview/:id" element={<EmployeeView />} />
              <Route path="/addAtendence" element={<AddAtendence />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
