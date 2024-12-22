import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { url } from '../../URL/Url';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const initialData = {
  LeaveName: '',
  startDate: '',
  endDate: '',
  Days: '',
  status : ''
};
const itemsPerPage = 4;

const LeaveType = () => {
  const [show, setShow] = useState(false);
  const [formdata, setFormData] = useState(initialData);
const [LeaveTypeData,SetLeaveTypeData] =useState([])
const [currentPage, setCurrentPage] = useState(1);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Update the form data state on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formdata, [name]: value });
  };



  // Handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log('Form Data:', formdata);
    try {
     const response= await axios.post(`${url}/api/leavetype/AddLeaveType`,formdata)
     if(response.status == 201){
      Swal.fire({
        text:"success",
        icon : "success",
        confirmButtonText:'OK'
      }).then(()=>{
        window.location.reload();
        setFormData(" ")
        handleClose()
      })
     }
    } catch (error) {
      
    }

  
  
  };
  const GetLeaveType = async ()=>{
    const response  = await axios.get(`${url}/api/leavetype/getLeaveType`)
    console.log(response);
    SetLeaveTypeData(response.data.LeaveTypeData)
   }
    const totalPages = Math.ceil(LeaveTypeData.length / itemsPerPage);

    // Get the current data for the page
    const currentData = LeaveTypeData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );


useEffect(()=>{
  GetLeaveType()
},[])
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap mb-3 box-shadow-common-strip p-3">
        <h5>Leave Type</h5>
        <Button
          style={{ backgroundColor: '#e3273A', border: 'none' }}
          className="text-white"
          onClick={handleShow}
        >
          <i className="fa-solid fa-plus"></i> Add Leave Type
        </Button>
      </div>

      <div className='p-5 box-shadow-common'>
        <Table responsive striped bordered hover>
          <thead className='text-center'>
            <tr>
              <th>LeaveName</th>
              <th>startDate</th>
              <th>endDate</th>
              <th>Days</th>
              <th>status</th>
              <th>Edit</th>
              <th>Delete</th>
             
           
         
            </tr>
          </thead>
          <tbody className='text-center'>
  {
  LeaveTypeData && LeaveTypeData.length > 0 ? (
    LeaveTypeData.map((val, i) => (
      <tr key={val._id}>
        <td colSpan="">{val.LeaveName}</td>
        <td>{val.startDate}</td>
        <td colSpan="">{val.endDate}</td>
        <td colSpan="">{val.Days}</td>
        <td colSpan="">{val.status}</td>
        <td>
          <Link>
            <i className="fa-regular fa-pen-to-square"></i>
          </Link>
        </td>
        <td>
          <Link>
            <i className="fa-solid fa-trash-can-arrow-up"></i>
          </Link>
        </td>

      
      </tr>
    ))  
  ) : (
    <tr>
      <td colSpan="5" className="text-center">
        No Data Available
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

      </div>
      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Attendance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Group controlId="formLeaveName">
                  <Form.Label>Leave Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="LeaveName"
                    value={formdata.LeaveName}
                    onChange={handleChange}
                    required
                    autoFocus
                  />
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group controlId="formStartDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formdata.startDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group controlId="formEndDate">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={formdata.endDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group controlId="formDays">
                  <Form.Label>Days</Form.Label>
                  <Form.Control
                    type="text"
                    name="Days"
                    value={formdata.Days}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
     
              </div>
              <div className="col-md-6 mb-3">
          <Form.Group controlId="formStatus">
            <Form.Label>Status</Form.Label>
            <Form.Control as="select" name="status"   value={formdata.status} required onChange={handleChange}>
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </Form.Control>
          </Form.Group>
        </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" className="button-red" onClick={(e)=>handleSubmit(e)}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeaveType;
