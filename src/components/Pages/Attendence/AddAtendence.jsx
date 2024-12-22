import React, { useContext, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';
import Modal from 'react-bootstrap/Modal';
import { SidebarContext } from '../../../context/sidebarContext';

const intialdata = {
    Name : '',
    Description : ''
  }
const AddAtendence = () => {
    const [show, setShow] = useState(false);
    const [formdata, Setfromdata] = useState(intialdata)
  const {department ,role, user, UserData} = useContext(SidebarContext);
   
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const HandleChnage = (e)=>{
  
  
        Setfromdata({...formdata , [e.target.name]: e.target.value})
      }
  return (
  <>
   <div className='d-flex justify-content-between flex-wrap mb-3 box-shadow-common-strip p-3'>
        <h5>Attendence</h5>
        <Button
          style={{ backgroundColor: '#e3273A', border: 'none' }}
          className='text-white'
          onClick={handleShow}
        >
          <i className="fa-solid fa-plus"></i> Add Attendence
        </Button>
      </div>
  <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Attendence</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
            <div className="col-md-4 mb-3">
          <Form.Group controlId="formRole">
            <Form.Label>Employee</Form.Label>
            <Form.Control as="select" onChange={HandleChnage}>
              <option value="">Select Employee</option>
              {user?.length > 0
                ? user.map((val, i) => <option key={i}>{val.firstName} {val.lastName}</option>)
                : <option disabled>No roles available</option>}
            </Form.Control>
          </Form.Group>
        </div>
        <div className="col-md-4 mb-3">
          <Form.Group controlId="formJoiningDate">
            <Form.Label>Select Date</Form.Label>
            <Form.Control
              type="date"
              name="AttendenceDate"
             
              onChange={HandleChnage}
            />
          </Form.Group>
        </div>
        <div className="col-md-4 mb-3">
  <Form.Group controlId="signInTime">
    <Form.Label>Sign In Time</Form.Label>
    <Form.Control
      type="time"
      name="SignInTime"
      onChange={HandleChnage}
    />
  </Form.Group>
</div>
<div className="col-md-4 mb-3">
  <Form.Group controlId="signOutTime">
    <Form.Label>Sign Out Time</Form.Label>
    <Form.Control
      type="time"
      name="SignOutTime"
      onChange={HandleChnage}
    />
  </Form.Group>
</div>

     
            </div>
       
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary">
           Sumbit
          </Button>
        </Modal.Footer>
      </Modal>
  </>
  )
}

export default AddAtendence