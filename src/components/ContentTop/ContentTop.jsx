import { iconsImgs } from "../../utils/images";
import "./ContentTop.css";
import { useContext } from "react";
import { SidebarContext } from "../../context/sidebarContext";
import Dropdown from 'react-bootstrap/Dropdown';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { url } from "../URL/Url";
import axios from "axios";

const ContentTop = () => {
  const { toggleSidebar } = useContext(SidebarContext);
  const navigate = useNavigate(); // Initialize useNavigate
  const profile = sessionStorage.getItem('profile');
  const name = sessionStorage.getItem('name');
  const employeeId = sessionStorage.getItem("id");

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      // Call logout API
    const response=  await axios.post(`${url}/api/userLogin/logout`, { employeeId });
       // Replace with your API endpoint
if(response.status == 200){
      // Clear session storage
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('name');
      sessionStorage.removeItem('profile');

      // Show logout success alert
      Swal.fire({
        title: 'Logged Out',
        text: 'You have been logged out successfully.',
        icon: 'success',
        confirmButtonText: 'Okay',
      }).then(() => {
        // Redirect to the login page after alert is confirmed
        navigate('/Login');
        window.location.reload();
      });
    }
    } catch (error) {
      console.error('Logout error:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to log out. Please try again.',
        icon: 'error',
        confirmButtonText: 'Okay',
      });
    }
  };

  return (
    <div className="main-content-top">
      <div className="content-top-left">
        <button type="button" className="sidebar-toggler" onClick={() => toggleSidebar()}>
          <i className="fa-solid fa-bars"></i>
        </button>
        <h3 className="content-top-title">Home</h3>
      </div>
      <div className="content-top-btns d-flex">
    

        <Dropdown>
          <Dropdown.Toggle id="dropdown-basic" style={{ backgroundColor: "white", border: 'none' }}>
            <img src={profile ? profile : "/person_three.jpg"} id="dropdown-basic" style={{ width: '44px', height: '44px', borderRadius: "50%" }} />
          </Dropdown.Toggle>
          <button type="button" className="btn btn-primary position-relative me-3">
          <i className="fa-solid fa-bell"></i>
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
  5+
  <span className="visually-hidden">unread messages</span>
</span>

</button>
          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1"><i className="fa-solid fa-circle-user"></i>&nbsp; {name ? name : "Profile"}</Dropdown.Item>
            <Dropdown.Item onClick={(e)=>{handleLogout(e)}}><i className="fa-solid fa-power-off"></i>&nbsp;  Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default ContentTop;
