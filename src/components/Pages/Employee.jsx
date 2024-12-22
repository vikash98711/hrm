import React, { useContext, useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { SidebarContext } from '../../context/sidebarContext';
import Swal from 'sweetalert2';
import { url } from '../URL/Url';
import { Link } from 'react-router-dom';

const vendorData = [
  { id: 1, active: 'Yes', Name: 'Madhav', Role: 'Administrator', EmailId: 'madhavsingh.singh25@gmail.com', Phone: '7011004598' },
  { id: 2, active: 'No', Name: 'Anjali', Role: 'QAC Department', EmailId: 'anjali@example.com', Phone: '7011004599' },
  { id: 3, active: 'Yes', Name: 'Ravi', Role: 'Moderator', EmailId: 'ravi@example.com', Phone: '7011004600' },
  { id: 4, active: 'Yes', Name: 'Sita', Role: 'Administrator', EmailId: 'sita@example.com', Phone: '7011004601' },
  { id: 5, active: 'No', Name: 'Rahul', Role: 'Account Department', EmailId: 'rahul@example.com', Phone: '7011004602' },
  { id: 6, active: 'Yes', Name: 'Priya', Role: 'Marketing Department', EmailId: 'priya@example.com', Phone: '7011004603' },
  { id: 7, active: 'Yes', Name: 'Vikram', Role: 'QAC Department', EmailId: 'vikram@example.com', Phone: '7011004604' },
  { id: 8, active: 'No', Name: 'Geeta', Role: 'Account Department', EmailId: 'geeta@example.com', Phone: '7011004605' },
];

const itemsPerPage = 4;

const Employee = () => {
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const {department ,role, user, UserData} = useContext(SidebarContext);
// const [user, UserData] =useState([])
  const [formData, setFormData] = useState({
    employeeCode: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    password: "",
    joiningDate: "",
    dob: "",
    bloodGroup: "",
    designation: "",
    status: "",
    address: "",
    profileImage: null, // For storing profile image file
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, profileImage: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    
    Object.keys(formData).forEach((key) => {
      if (key !== 'profileImage' && formData[key]) { 
        data.append(key, formData[key]);
      }
    });
    
    if (formData.profileImage) {
      const file = formData.profileImage;
      const maxSize = 5 * 1024 * 1024; // 5MB limit
      if (file.size > maxSize) {
        alert("File size should not exceed 5MB");
        return;
      }
      data.append("profileImage", file);
    }
    
    try {
      const response = await axios.post("http://localhost:4000/api/user/employees", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.status === 201) {
        Swal.fire({
          text: "Employee created successfully!",
          icon: "success",
          confirmButtonText: "OK"
        }).then(() => {
          handleClose(); // Close the modal
          window.location.reload(); // Reload to reflect changes
          setFormData({
            employeeCode: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            role: "",
            department: "",
            password: "",
            joiningDate: "",
            dob: "",
            bloodGroup: "",
            designation: "",
            status: "",
            address: "",
            profileImage: null, // Reset the profile image
          });
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        text: "An error occurred while submitting the form.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };
  
  
  

  const HandleDelete = async(e, id)=>{
    e.preventDefault();
    console.log("id",id);
    
    try {
const response = await axios.delete(`${url}/api/user/employeedelete/${id}`)
if(response.status == 200){
  Swal.fire({
    text :"Success",
    icon : "success",
    confirmButtonText:"ok"
  }).then(()=>{
    window.location.reload()
  })
}
      
    } catch (error) {
      
    }
  }
  


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
      <div className='d-flex justify-content-between flex-wrap mb-3 box-shadow-common-strip p-3'>
        <h5>User</h5>
        <Button
          style={{ backgroundColor: '#e3273A', border: 'none' }}
          className='text-white'
          onClick={handleShow}
        >
          <i className="fa-solid fa-plus"></i> Add User
        </Button>
      </div>
      <div className='p-5 box-shadow-common'>
     <Table responsive striped bordered hover>
      <thead className='text-center'>
        <tr>
          <th>#</th>
          <th>Profile Image</th>
          <th>Emp Code</th>

          <th>Name</th>
          <th>Role</th>
          <th>Email ID</th>
          <th>Phone</th>
          <th>Designation</th>
          <th>Joining Date</th>
          <th>Status</th>
          <th>View</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody className='text-center'>
      {user && user.length > 0 ? (
  user.map((employee, index) => (
    <tr key={employee._id}>
      <td>{index + 1}</td>
      <td>
        {employee.profileImage?.url ? (
          <img
            src={employee.profileImage.url}
            alt="Profile"
            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          />
        ) : (
          <span>No Image</span>
        )}
      </td>
      <td>{employee.employeeCode}</td>
      <td>{employee.firstName} {employee.lastName}</td>
      <td>{employee.role}</td>
      <td>{employee.email}</td>
      <td>{employee.phone}</td>
      <td>{employee.designation}</td>
      <td>{new Date(employee.joiningDate).toLocaleDateString()}</td>
      <td>{employee.status}</td>
      <td>
        <Link to={`/admin/employeeview/${employee._id}`}><i className="fa-solid fa-eye"></i></Link>
      </td>
      <td>
        <i className="fa-regular fa-pen-to-square"></i>
      </td>
      <td>
        <Link onClick={(e) => HandleDelete(e, employee._id)}>
          <i className="fa-solid fa-trash-can-arrow-up"></i>
        </Link>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="12" className="text-center">
      Oops, there is no data available.
    </td>
  </tr>
)}

      </tbody>
    </Table>

        <div className='d-flex justify-content-center mb-3'>
          <Pagination>
            <Pagination.First
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              disabled={currentPage === 1}
            />
            {Array.from({ length: totalPages }).map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>

        <div className='d-flex justify-content-between mb-3'>
          <Button onClick={exportToExcel} variant="success">
            <i className="fa-solid fa-file-arrow-down"></i> Export to Excel
          </Button>
          <Button onClick={exportToCSV} variant="primary">
            <i className="fa-solid fa-file-arrow-down"></i> Export to CSV
          </Button>
        </div>
      </div>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-4 mb-3">
          <Form.Group controlId="formEmployeeCode">
            <Form.Label>Employee Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Employee code"
              name="employeeCode"
              value={formData.employeeCode}
              onChange={handleChange}
              autoFocus
            />
          </Form.Group>
        </div>
        <div className="col-md-4 mb-3">
          <Form.Group controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </Form.Group>
        </div>
        <div className="col-md-4 mb-3">
          <Form.Group controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </Form.Group>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 mb-3">
          <Form.Group controlId="formEmail">
            <Form.Label>Email ID</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email ID"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>
        </div>
        <div className="col-md-4 mb-3">
          <Form.Group controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group controlId="formProfileImage">
            <Form.Label>Profile Image</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 mb-3">
          <Form.Group controlId="formRole">
            <Form.Label>Role</Form.Label>
            <Form.Control as="select" name="role" value={formData.role} onChange={handleChange}>
              <option value="">Select Role</option>
              {role?.length > 0
                ? role.map((val, i) => <option key={i}>{val.Name}</option>)
                : <option disabled>No roles available</option>}
            </Form.Control>
          </Form.Group>
        </div>
        <div className="col-md-4 mb-3">
          <Form.Group controlId="formDepartment">
            <Form.Label>Department</Form.Label>
            <Form.Control as="select" name="department" value={formData.department} onChange={handleChange}>
              <option value="">Select Department</option>
              {department?.length > 0
                ? department.map((val, i) => <option key={i}>{val.name}</option>)
                : <option disabled>No departments available</option>}
            </Form.Control>
          </Form.Group>
        </div>
        <div className="col-md-4 mb-3">
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Group>
        </div>
        <div className="col-md-4 mb-3">
          <Form.Group controlId="formJoiningDate">
            <Form.Label>Joining Date</Form.Label>
            <Form.Control
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
            />
          </Form.Group>
        </div>
        <div className="col-md-4 mb-3">
          <Form.Group controlId="formDOB">
            <Form.Label>Date of Birth (DOB)</Form.Label>
            <Form.Control
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </Form.Group>
        </div>
        <div className="col-md-4 mb-3">
          <Form.Group controlId="formBloodGroup">
            <Form.Label>Blood Group</Form.Label>
            <Form.Control as="select" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </Form.Control>
          </Form.Group>
        </div>
        <div className="col-md-4 mb-3">
          <Form.Group controlId="formDesignation">
            <Form.Label>Designation</Form.Label>
            <Form.Control as="select" name="designation" value={formData.designation} onChange={handleChange}>
              <option value="">Select Designation</option>
              <option value="Frontend-developer">Frontend-developer</option>
              <option value="BackendDeveloper">Backend Developer</option>
              <option value="Ui/Ux Designer">Ui/Ux Designer</option>
              <option value="mernstack">MERN Stack</option>
            </Form.Control>
          </Form.Group>
        </div>
        <div className="col-md-6 mb-3">
          <Form.Group controlId="formStatus">
            <Form.Label>Status</Form.Label>
            <Form.Control as="select" name="status" value={formData.status} onChange={handleChange}>
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </Form.Control>
          </Form.Group>
        </div>
        <div className="col-md-12">
          <Form.Group controlId="formAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </Form.Group>
        </div>
     
      </div>
      <button type="submit" className="btn btn-primary mt-3 button-red">
        Submit
      </button>
    </Form>

        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
           Sumbit
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
}

export default Employee;
