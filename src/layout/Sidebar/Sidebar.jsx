import { useEffect, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarContext } from '../../context/sidebarContext';
import './Sidebar.css'; // Ensure this CSS file includes the necessary styles
import { iconsImgs } from '../../utils/images'; // Update the path according to your project structure

const Sidebar = () => {
  const { toggleSidebar } = useContext(SidebarContext);
  const [isWebSettingSubmenuOpen, setIsWebSettingSubmenuOpen] = useState(false);
  const [isUsersSubmenuOpen, setIsUsersSubmenuOpen] = useState(false);
  const [isLeavessubmenuOpen, setIsLeavesSubmenuOpen]=useState(false)
  const [sidebarClass, setSidebarClass] = useState("");
  const { isSidebarOpen } = useContext(SidebarContext);
  const location = useLocation();

  useEffect(() => {
    setSidebarClass(isSidebarOpen ? 'sidebar-change' : '');
  }, [isSidebarOpen]);

  const toggleWebSettingSubmenu = () => {
    setIsWebSettingSubmenuOpen(!isWebSettingSubmenuOpen);
  };

  const toggleUsersSubmenu = () => {
    setIsUsersSubmenuOpen(!isUsersSubmenuOpen);
  };
  const toggleAttendence = () => {
    setIsLeavesSubmenuOpen(!isLeavessubmenuOpen);
  };

  return (
    <div className={`sidebar ${sidebarClass}`}>
      <div className='text-end sidebarClose-Wrapper'>
        <i className="fa-solid fa-arrow-left text-white" onClick={toggleSidebar}></i>
      </div>
      <div className="user-info">
        <div className="info-img img-fit-cover"></div>
      </div>

      <nav className="navigation">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/admin/Dashboard" className={`Customnav-link ${location.pathname === "/admin/Dashboard" ? 'active' : ''}`}>
            <i className="fa-solid fa-house-chimney"></i>
              <span className="Customnav-link-text">Dashboard</span>
            </Link>
          </li>

          {/* WebSetting menu with submenu */}
          <li className="nav-item">
            <div className="Customnav-link" onClick={toggleWebSettingSubmenu}>
            <i className="fas fa-sign-out-alt"></i>
              <span className="Customnav-link-text">Leaves</span>
              <span className="submenu-indicator">
                {isWebSettingSubmenuOpen ? <i className="fa-solid fa-angle-up"></i> : <i className="fa-solid fa-angle-down"></i>}
              </span>
            </div>
            <ul className={`submenu ${isWebSettingSubmenuOpen ? 'open' : ''}`}>
              <li className="nav-item">
                <Link to="/leaves" className={`Customnav-link common-submenu-text ${location.pathname === "/leaves" ? 'active' : ''}`}>
                <i className="fas fa-file-alt"></i> 
                  <span className="Customnav-link-text">Leaves List</span>
                </Link>
                <Link to="/websetting/vendor-Document" className={`Customnav-link common-submenu-text ${location.pathname === "/websetting/vendor-Document" ? 'active' : ''}`}>
                <i className="fas fa-file-alt"></i> 
                  <span className="Customnav-link-text">Add Leaves</span>
                </Link>
                <Link to="/LeaveType" className={`Customnav-link common-submenu-text ${location.pathname === "/LeaveType" ? 'active' : ''}`}>
                <i className="fas fa-file-alt"></i> 
                  <span className="Customnav-link-text">Leave type</span>
                </Link>
              </li>
            </ul>
          </li>

          {/* Users menu with submenu */}
          <li className="nav-item">
            <div className="Customnav-link" onClick={toggleUsersSubmenu}>
            <i className="fa-solid fa-clipboard-list"></i>

              <span className="Customnav-link-text">Users</span>
              <span className="submenu-indicator">
                {isUsersSubmenuOpen ? <i className="fa-solid fa-angle-up"></i> : <i className="fa-solid fa-angle-down"></i>}
              </span>
            </div>
            <ul className={`submenu ${isUsersSubmenuOpen ? 'open' : ''}`}>
              <li className="nav-item submenu-sidebar">
                <Link to="/Employee" className={`Customnav-link common-submenu-text  submenu-link ${location.pathname === "/Employee" ? 'active' : ''}`}>
                  <i className="fa-solid fa-clipboard-list"></i>
                  <span className="Customnav-link-text downarrow-sublist"> Empolyee List</span>
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link to="/users/departments" className={`Customnav-link ${location.pathname === "/users/departments" ? 'active' : ''}`}>
                  <i className="fa-solid fa-user-tie"></i>
                  <span className="Customnav-link-text">Departments</span>
                </Link>
              </li> */}
            </ul>
          </li>

          {/* Other nav items... */}
          <li className="nav-item">
            <Link to="/department" className={`Customnav-link ${location.pathname === "/department" ? 'active' : ''}`}>
              {/* <img src={iconsImgs.wallet} className="Customnav-link-icon" alt="Sellers" /> */}
              <i className="fa-solid fa-circle-user"></i>
              <span className="Customnav-link-text">Department</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="Role" className={`Customnav-link ${location.pathname === "/Role" ? 'active' : ''}`}>
              {/* <img src={iconsImgs.wallet} className="Customnav-link-icon" alt="Sellers" /> */}
              <i className="fa-solid fa-user-tie"></i>
              <span className="Customnav-link-text">Role</span>
            </Link>
          </li>
     
          {/* <li className="nav-item">
            <Link to="/leaves" className={`Customnav-link ${location.pathname === "/leaves" ? 'active' : ''}`}>
            <i className="fas fa-check-circle"></i>

              <span className="Customnav-link-text">Attendence</span>
            </Link>
          </li> */}
        
       
        <li className="nav-item">
            <div className="Customnav-link" onClick={toggleAttendence}>
            <i className="fas fa-check-circle"></i>


              <span className="Customnav-link-text">Attendence</span>
              <span className="submenu-indicator">
                {isLeavessubmenuOpen ? <i className="fa-solid fa-angle-up"></i> : <i className="fa-solid fa-angle-down"></i>}
              </span>
            </div>
            <ul className={`submenu ${isLeavessubmenuOpen ? 'open' : ''}`}>
              <li className="nav-item submenu-sidebar">
                <Link to="/addAtendence" className={`Customnav-link common-submenu-text  submenu-link ${location.pathname === "/addAtendence" ? 'active' : ''}`}>
                  <i className="fa-solid fa-clipboard-list"></i>
                  <span className="Customnav-link-text downarrow-sublist">Add Attendence</span>
                </Link>
                <Link to="/attendenceRecord" className={`Customnav-link common-submenu-text  submenu-link ${location.pathname === "/attendenceRecord" ? 'active' : ''}`}>
                  <i className="fa-solid fa-clipboard-list"></i>
                  <span className="Customnav-link-text downarrow-sublist">Attendence List</span>

                </Link>
                <Link to="/addAtendenc" className={`Customnav-link common-submenu-text  submenu-link ${location.pathname === "/addAendence" ? 'active' : ''}`}>
                  <i className="fa-solid fa-clipboard-list"></i>
                  <span className="Customnav-link-text downarrow-sublist">Atendence Report</span>

                </Link>
              </li>
   
            </ul>
          </li>

          <li className="nav-item">
            <Link to="/Report" className={`Customnav-link ${location.pathname === "/Report" ? 'active' : ''}`}>
            <i className="fas fa-check-circle"></i>

              <span className="Customnav-link-text">Notice</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/BulkEmail" className={`Customnav-link ${location.pathname === "/admin/BulkEmail" ? 'active' : ''}`}>
            <i className="fa-solid fa-envelope"></i>

              <span className="Customnav-link-text">Bulk Emailing</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/chat" className={`Customnav-link ${location.pathname === "/admin/chat" ? 'active' : ''}`}>
            <i className="fa-brands fa-rocketchat"></i>

              <span className="Customnav-link-text">Chat</span>
            </Link>
          </li>
         
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
