
import  { useEffect, useState ,useContext} from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';
import axios from 'axios';
import {Link} from 'react-router-dom';

import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import { SidebarContext } from '../../context/sidebarContext';
import { url } from '../URL/Url';

const itemsPerPage = 4;


const intialdata = {
  Name : '',
  Description : ''
}
const Role = () => {
    const [show, setShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    // const [data , Setdata] = useState([])
  const { role , SetRole } = useContext(SidebarContext);

    const [formdata, Setfromdata] = useState(intialdata)
    
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);


const HandleChnage = (e)=>{
  
  
  Setfromdata({...formdata , [e.target.name]: e.target.value})
}

    
     const handleSubmit = async(e)=>{
    e.preventDefault();
      try {
       
        const response = await axios.post(`${url}/roles`,formdata);
        if(response.status == 201){
          Swal.fire({
            title : 'sucess',
            text : 'Role Add sucessfully',
            icon :"success",
             confirmButtonText: 'OK'
          }).then(()=>{
            window.location.reload()
          })
          handleClose();
          Setfromdata(" ")
        }
      } catch (error) {
        console.log("There is some error on handleSumbit",error);
        
      }
     }


     const HandleDelete = async (e , id)=>{
      e.preventDefault();
      try {
        const res = await axios.delete(`${url}/roleClear/${id}`)
        if (res.status == 200){
          Swal.fire({
            title : 'sucess',
            text : 'Data Deleted sucessfully',
            icon :"success",
             confirmButtonText: 'OK'
          }).then(()=>{
            window.location.reload()
          })
        }
      } catch (error) {
        console.log('there is some error',error)
      }
     }
      
        // Calculate the number of pages
        const totalPages = Math.ceil(role.length / itemsPerPage);
    
        // Get the current data for the page
        const currentData = role.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );

  
  return (
    <>
  <div className='d-flex justify-content-between flex-wrap mb-3 box-shadow-common-strip p-3'>
        <h5>Role</h5>
        <Button
          style={{ backgroundColor: '#e3273A', border: 'none' }}
          className='text-white'
          onClick={handleShow}
        >
          <i className="fa-solid fa-plus"></i> Add Role
        </Button>
      </div>
      <div className='p-5 box-shadow-common'>
        <Table responsive striped bordered hover>
          <thead className='text-center'>
            <tr>
              <th>#</th>
              <th>Role</th>
              <th>Discription</th>
              <th>Edit</th>
              <th>Delete</th>
         
            </tr>
          </thead>
          <tbody className='text-center'>
          
          {
          role.length > 0 ? (
            role.map((val, i) => (
              <tr key={val._id}>
              <td>{val._id}</td>
                <td>{val.Name}</td>
                <td>{val.Description}</td>
             
                <td>
                  <Link to={`/editrole/${val._id}`}>
                  <i className="fa-regular fa-pen-to-square"></i>
                  </Link>&nbsp;&nbsp;
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
              <td colSpan="5" className='text-center'>no data found</td>
            </tr>
          )
          }
         
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
          <Modal.Title>Add Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-12 mb-3">
                <Form.Group controlId="formFirstName">
                  <Form.Label>Role Name</Form.Label>
                  <Form.Control type="text"  name="Name" autoFocus  onChange={(e)=>HandleChnage(e)}/>
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
    name="Description"
    onChange={(e)=>HandleChnage(e)}
  />
</div>

              </div>
            </div>
       
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={(e)=>handleSubmit(e)}>
           Sumbit
          </Button>
        </Modal.Footer>
      </Modal>
 </>
  )
}

export default Role