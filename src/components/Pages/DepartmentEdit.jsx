import React, { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import Swal from 'sweetalert2';
const intialdata = {
    name :'',
    Discription : ''
}
const DepartmentEdit = () => {
    const navigate = useNavigate()
    const [data, SetData]=useState(intialdata)
    const {id} = useParams();

    const getSingleDepartment = async()=>{
        try {
            const res = await axios.get(`https://backfile-h9t9.onrender.com/singleDepartment/${id}`)
            if(res.status == 200){
                SetData(res.data.singledepartment)
            }
        } catch (error) {
            
        }
    }

const Handlechange = (e)=>{
    SetData({...data, [e.target.name]:e.target.value})
}


    console.log("data",data);
    useEffect(()=>{
        getSingleDepartment()
    },[])

    const HandleSumbit = async(e)=>{
        e.preventDefault()
        try {
            const res = await axios.post(`https://backfile-h9t9.onrender.com/deparmentUpdate/${id}`,data)
            if(res.status == 200){
Swal.fire({
    text : 'success',
    icon : 'success',
    confirmButtonText: "OK"
})
navigate('/department')
      SetData(" ")
            }
        } catch (error) {
            console.log(error);
            
        }
    }
  return (
  <>
  
  <Link to='/Role'><i className="fa-solid fa-arrow-left"></i> Back</Link>
<Form className='py-5'>
            <div className="row p-5">
              <div className="col-md-12 mb-3">
                <Form.Group controlId="formFirstName">
                  <Form.Label>Department Name</Form.Label>
                  <Form.Control type="text" name="name" value={data.name} autoFocus  onChange={(e)=>Handlechange(e)} />
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
    name= "Discription"
    value={data.Discription}
    onChange={(e)=>Handlechange(e)}
   
  />
</div>

              </div>
              <div className="col-md-12">
              <Button variant="primary" onClick={(e)=>HandleSumbit(e)}>
           Edit
          </Button>
              </div>
            </div>
       
          </Form>
  </>
  )
}

export default DepartmentEdit