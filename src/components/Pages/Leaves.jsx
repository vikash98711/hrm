import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';

import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';

const itemsPerPage = 4;

const vendorData = [
    { id: 1, active: 'Yes', Name: 'Madhav', Role: 'Administrator', startdate:"10-11-2024",enddate:"20-12-2024",totaldays:"40 Days", EmailId: 'madhavsingh.singh25@gmail.com', Phone: '7011004598' },
    { id: 2, active: 'No', Name: 'Anjali', Role: 'QAC Department',startdate:"10-11-2024",enddate:"20-12-2024",totaldays:"40 Days", EmailId: 'anjali@example.com', Phone: '7011004599' },
    { id: 3, active: 'Yes', Name: 'Ravi', Role: 'Moderator',startdate:"10-11-2024",enddate:"20-12-2024",totaldays:"40 Days", EmailId: 'ravi@example.com', Phone: '7011004600' },
    { id: 4, active: 'Yes', Name: 'Sita', Role: 'Administrator', startdate:"10-11-2024",enddate:"20-12-2024",totaldays:"40 Days", EmailId: 'sita@example.com', Phone: '7011004601' },
    { id: 5, active: 'No', Name: 'Rahul', Role: 'Account Department',  startdate:"10-11-2024",enddate:"20-12-2024",totaldays:"40 Days", EmailId: 'rahul@example.com', Phone: '7011004602' },
    { id: 6, active: 'Yes', Name: 'Priya', Role: 'Marketing Department',startdate:"10-11-2024",enddate:"20-12-2024",totaldays:"40 Days",  EmailId: 'priya@example.com', Phone: '7011004603' },
    { id: 7, active: 'Yes', Name: 'Vikram', Role: 'QAC Department', startdate:"10-11-2024",enddate:"20-12-2024",totaldays:"40 Days", EmailId: 'vikram@example.com', Phone: '7011004604' },
    { id: 8, active: 'No', Name: 'Geeta', Role: 'Account Department',startdate:"10-11-2024",enddate:"20-12-2024",totaldays:"40 Days",  EmailId: 'geeta@example.com', Phone: '7011004605' },
  ];
const Leaves = () => {
    // State to track the active tab
    const [activeTab, setActiveTab] = useState("/home");
    const [show, setShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    // Calculate the number of pages
    const totalPages = Math.ceil(vendorData.length / itemsPerPage);
  
    // Get the current data for the page
    const currentData = vendorData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  
    // Function to export to Excel
    const exportToExcel = () => {
      const ws = XLSX.utils.json_to_sheet(vendorData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'VendorData');
      XLSX.writeFile(wb, 'VendorData.xlsx');
    };
  
    // Function to export to CSV
    const exportToCSV = () => {
      const csv = Papa.unparse(vendorData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'VendorData.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    return (
        <>
            <div className=" container Main-leaves-wrapper p-5">
                {/* Navigation Tabs */}
                <Nav
                    // justify
                    variant="tabs"
                    activeKey={activeTab}
                    onSelect={(selectedKey) => setActiveTab(selectedKey)} // Update active tab
                
                >
                    <Nav.Item>
                        <Nav.Link eventKey="/home">Total Emp Leaves</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="link-1">Pending Leaves <i className="fa-solid fa-hourglass-half"></i></Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="link-2">Approved Leaves <i className="fa-solid fa-check"></i></Nav.Link>
                    </Nav.Item>
                </Nav>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === "/home" && (
                        <div>
                            <div className="container mt-2">
                                <div className="row">
                                    <div className="col-lg-3">
                                    <div className="mb-3">
                                    <div className="input-group mb-3">
  <input
    type="text"
    className="form-control"
    placeholder="Search"
    aria-label="Recipient's username"
    aria-describedby="basic-addon2"
  />
  <span className="input-group-text" id="basic-addon2">
  <i className="fa-solid fa-magnifying-glass"></i>
  </span>
</div>


</div>
                                    </div>
                                </div>
                            </div>


                           <Table responsive striped bordered hover>
                            
          <thead className='text-center'>
            <tr>
              <th>Emp Id</th>

              <th>Name</th>
              <th>Role</th>
              <th>start Date</th>
              <th>End Date</th>
              <th>Total Days</th>
              <th>Email ID</th>
              <th>Phone</th>
              <th>Active</th>
              <th>#</th>

            </tr>
          </thead>
          <tbody className='text-center'>
            {currentData.map((vendor) => (
              <tr key={vendor.id}>
                <td>{vendor.id}</td>
              
                <td>{vendor.Name}</td>
                <td>{vendor.Role}</td>
                <td>{vendor.startdate}</td>
                <td>{vendor.enddate}</td>
                <td>{vendor.totaldays}</td>
                <td>{vendor.EmailId}</td>
                <td>{vendor.Phone}</td>
              
                <td>
                  <Form>
                    <Form.Check
                      type="switch"
                      id={`custom-switch-${vendor.id}`}
                      checked={vendor.active === 'Yes'}
                      readOnly
                      className={vendor.active === 'Yes' ? 'switch-active' : 'switch-inactive'}
                    />
                  </Form>
                </td>
                <td>
                  <i className="fa-regular fa-pen-to-square"></i>&nbsp;&nbsp;
                  {/* <i className="fa-solid fa-trash-can-arrow-up"></i> */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
                        </div>
                    )}
                    {activeTab === "link-1" && (
                        <div>
                            <h3>Loooonger NavLink Content</h3>
                            <p>This is the content for the Loooonger NavLink tab.</p>
                        </div>
                    )}
                    {activeTab === "link-2" && (
                        <div>
                            <h3>Link Tab Content</h3>
                            <p>This is the content for the Link tab.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Leaves;
