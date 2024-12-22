
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {url} from '../URL/Url'
import { Link, useNavigate, useParams } from 'react-router-dom';
import  Swal  from 'sweetalert2';


const intialobj = {
  Name : "",
  Description : ""
}

const EditRole = () => {
    const [data, SetData]=useState(intialobj);
    const {id} =useParams()
    const Navigate = useNavigate();
// console.log("id",id ,url);

    const GetSingleRoledata = async ()=>{
        try {
            const response = await axios.get(`http://localhost:4000/singleRole/${id}`)
            if(response.status == 200){
              SetData(response.data.data)

            }
            
        } catch (error) {
            console.log(error);
            
        }
    }


const Handlechange = (e)=>{
  SetData({...data , [e.target.name]:e.target.value})
}


const handlesubmit = async (e)=>{
  e.preventDefault();
  try {
    const res = await axios.post(`http://localhost:4000/updateROles/${id}`,data)
    if(res.status == 200){
      Swal.fire({
        title : 'sucess',
        text : 'Data Updated sucessfully',
        icon :"success",
         confirmButtonText: 'OK'
      })
      SetData(" ");
      Navigate('/Role')
    }
  } catch (error) {
    console.log("there is some erorr on handlesubmit unc")
  }
}

    useEffect(()=>{
        GetSingleRoledata();
    },[])
    console.log("data",data);

  return (

    
<>
<Link to='/Role'><i className="fa-solid fa-arrow-left"></i> Back</Link>
<Form className='py-5'>
            <div className="row p-5">
              <div className="col-md-12 mb-3">
                <Form.Group controlId="formFirstName">
                  <Form.Label>Role Name</Form.Label>
                  <Form.Control type="text" value={data.Name}  name="Name" autoFocus onChange={(e)=>Handlechange(e)} />
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
    onChange={(e)=>Handlechange(e)}
    value={data.Description}
   
  />
</div>

              </div>
              <div className="col-md-12">
              <Button variant="primary" onClick={(e)=>handlesubmit(e)} >
           Sumbit
          </Button>
              </div>
            </div>
       
          </Form>
</>
  )
}

export default EditRole