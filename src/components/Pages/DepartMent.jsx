import React, { useEffect } from 'react';
import  { useState,useContext } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';

import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { SidebarContext } from '../../context/sidebarContext';
import { url } from '../URL/Url';

const itemsPerPage = 4;
const intialdata = {
  name : "",
  Discription: ""
}
const DepartMent = () => {
  const [show, setShow] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
// const [department, SetDepartment] = useState([])
const {department, SetDepartment} = useContext(SidebarContext);

const [formdata , SetFormData] =useState(intialdata)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
    // Calculate the number of pages
    const totalPages = Math.ceil(department.length / itemsPerPage);

    // Get the current data for the page
    const currentData = department.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

const HandleChange = (e)=>{
  SetFormData({...formdata, [e.target.name]:e.target.value})
}
// const GetAlldepartment = async ()=>{
//   try {
//     const res = await axios.get('http://localhost:4000/getAlldepartment')
 
    
//     if(res.status == 200){
//       SetDepartment(res.data.resultdata)
//     }
//   } catch (error) {
//     console.log(error)
//   }
// }

const HandleSumbit = async(e)=>{
  e.preventDefault()
  try {
    const res = await axios.post(`${url}/department`,formdata)
    if(res.status == 200){
      Swal.fire({
        title : 'success',
        icon : 'success',
        confirmButtonText : 'OK'
      }).then(()=>{
        window.location.reload()
      })
    }
    SetFormData(" ");
    handleClose()
 
  } catch (error) {
    console.log(error)
  }
}

const HandleDelete = async (e, id)=>{
  e.preventDefault()
  try {
      const res = await axios.delete(`${url}/departmentdelete/${id}`)
      if(res.status == 200){
          Swal.fire({
              text : 'Data Deleted',
              icon :'success',
              confirmButtonText:'OK'

          }).then(()=>{
            window.location.reload()
          })
      }
  } catch (error) {
      console.log(error);
      
  }
}


// useEffect(()=>{
//   GetAlldepartment()
// },[])
  return (
 <>
  <div className='d-flex justify-content-between flex-wrap box-shadow-common-strip p-3 mb-3'>
        <h5>Department</h5>
        <Button
          style={{ backgroundColor: '#e3273A', border: 'none' }}
          className='text-white'
          onClick={handleShow}
        >
          <i className="fa-solid fa-plus"></i> Add Department
        </Button>
      </div>
      <div className='p-5 box-shadow-common'>
        <Table responsive striped bordered hover>
          <thead className='text-center'>
            <tr>
              <th>#</th>
              <th>Department</th>
              <th>Discription</th>
              <th>Edit</th>
              <th>Delete</th>
         
            </tr>
          </thead>
          <tbody className='text-center'>
  {department && department.length > 0 ? (
    department.map((val, i) => (
      <tr key={val._id}>
        <td colSpan="">{val._id}</td>
        <td>{val.name}</td>
        <td colSpan="">{val.Discription}</td>
        <td>
          <Link to={`/departmentedit/${val._id}`}>
            <i className="fa-regular fa-pen-to-square"></i>
          </Link>
        </td>
        <td>
          <Link onClick={(e)=>HandleDelete(e, val._id)}>
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
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-12 mb-3">
                <Form.Group controlId="formFirstName">
                  <Form.Label>Department Name</Form.Label>
                  <Form.Control type="text" name="name"  autoFocus onChange={(e)=>HandleChange(e)} />
                </Form.Group>
              </div>
              <div className="col-md-12 mb-3">
              <div className="mb-3">
  <label htmlFor="exampleFormControlTextarea1" className="form-label">
    Description
  </label>
  <textarea
    className="form-control"
    id="exampleFormControlTextarea1"
    rows={3}
    defaultValue={""}
    name="Discription"
    onChange={(e)=>HandleChange(e)}
  />
</div>

              </div>
            </div>
       
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={(e)=>HandleSumbit(e)}>
           Sumbit
          </Button>
        </Modal.Footer>
      </Modal>
 </>
  )
}

export default DepartMent
