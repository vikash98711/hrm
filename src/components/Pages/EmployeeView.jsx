import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import { useParams } from 'react-router-dom';
import { url } from '../URL/Url';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { SidebarContext } from '../../context/sidebarContext';
import Swal from 'sweetalert2';


const EmployeeView = () => {
  const {department ,role} = useContext(SidebarContext);

    const {id} = useParams();
    const [data, Setdata]=useState([])
    const [formData, setFormData] = useState({
        employeeCode: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
        department: "",
        // password: "",
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
    console.log("data",formData);
    
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        const data = new FormData();
      
        Object.keys(formData).forEach((key) => {
          if (key !== "profileImage" && formData[key]) {
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
          const response = await axios.put(`http://localhost:4000/api/user/edituser/${id}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
      
          if (response.status === 200) {
            Swal.fire({
              text: "Employee updated successfully!",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              handleClose(); // Close the modal
              window.location.reload(); // Reload to reflect changes
            });
          }
        } catch (error) {
          console.error("Error:", error);
          Swal.fire({
            text: error.response?.data?.message || "An error occurred while updating the employee.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      };
      

    
    const [activeTab, setActiveTab] = useState("/Profile");

    const GetSingleUser = async ()=>{
        try {
            const response = await axios.get(`${url}/api/user/getSingleUser/${id}`)
            if(response.status == 200){
                setFormData(response.data.data)
            }
            
        } catch (error) {
            
        }
    }
    console.log("view",data);

useEffect(()=>{
    GetSingleUser() 
},[])
  return (
    <>
        <h3>User Profile</h3>

       <div className=" container Main-leaves-wrapper wrapper-employee-view">
                {/* Navigation Tabs */}
                <Nav
                    // justify
                    variant="tabs"
                    activeKey={activeTab}
                    onSelect={(selectedKey) => setActiveTab(selectedKey)} // Update active tab
                
                >
                    <Nav.Item>
                        <Nav.Link eventKey="/Profile"><i className="fa-solid fa-user"></i> Profile</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="link-1"> <i className="fa-solid fa-user-pen"></i> Update Profile </Nav.Link>
                    </Nav.Item>
               
                </Nav>

                {/* Tab Content */}
                <div className="tab-content">
                {activeTab === "/Profile" && (
  formData ? ( // Check if data is truthy
    <div className="card mt-2" style={{ width: "35rem", padding:"10px 25",margin:'0 auto' }}>
      <img 
      style={{width:'125px', height:'125px', borderRadius:'50px'}}
        src={formData.profileImage?.url} 
        className="card-img-top text-center" 
        alt={`${formData.firstName} ${data.lastName}`
    
    } 
      />
      <div className="card-body">
        <div className="row">
            <div className="col-lg-6">

         
        <p className="fw-600">Name :<span className='fw-600'> {formData.firstName} {formData.lastName}</span></p>
        </div>
        <div className="col-lg-6">

        <p className="card-text fw-600">
            Employee Code :
        <span className='fw-400'>  {formData.employeeCode || "No department information available."}</span>
        </p>
        </div>
        <div className="col-lg-6">

        <p className="card-text fw-600">
            Account :
        <span className='badge fw-400 rounded-pill bg-success'>  {formData.status || "No department information available."}</span>
        </p>
        </div>
        <div className="col-lg-6">

        <p className="card-text fw-600">
            Department :
        <span className='fw-400'>  {formData.department || "No department information available."}</span>
        </p>
        </div>
        <div className="col-lg-6">

        <p className="card-text fw-600">
        Designation :
        <span className='fw-400'>  {formData.designation || "No department information available."}</span>
        </p>
        </div>
        <div className="col-lg-6">

        <p className="card-text fw-600">
        Role :
        <span className='fw-400'>  {formData.role || "No department information available."}</span>
        </p>
        </div>
     
        <div className="col-lg-6">

        <p className="card-text fw-600">
        Dob :
        <span className='fw-400'>  {formData.dob || "No department information available."}</span>
        </p>
        </div>
        <div className="col-lg-6">

        <p className="card-text fw-600">
        Blood Group :
        <span className='fw-400'>  {formData.bloodGroup || "No department information available."}</span>
        </p>
        </div>
        <div className="col-lg-12">


        <p className="card-text fw-600">
        Address :
        <span className='fw-400'>  {formData.address || "No department information available."}</span>
        </p>
        </div>
        <div className="col-lg-12">

<p className="card-text fw-600">
Joining Date :
<span className='fw-400'>  {formData.joiningDate || "No department information available."}</span>
</p>
</div>

        </div>
      </div>
    </div>
  ) : (
    <div className="card" style={{ width: "18rem", textAlign: "center", padding: "20px" }}>
      <h5 className="card-title">Oops!</h5>
      <p className="card-text">There is no data available.</p>
    </div>
  )
)}


                    {activeTab === "link-1" && (
                       <Form onSubmit={handleSubmit} className='p-3 employeeEdit-wrapper'>
                        <div className="text-end">
                        <button type="submit" className="btn btn-primary mt-2 mb-2 text-end">
                        <i className="fa-solid fa-user-pen"></i>  Edit user
                       </button>
                        </div>
                       
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
                         {/* <div className="col-md-4 mb-3">
                        

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

                         </div> */}
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
                         <div className="col-md-4 mb-3">
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
                         <div className="col-md-4">
                           <Form.Group controlId="formProfileImage">
                             <Form.Label>Profile Image</Form.Label>
                             <Form.Control type="file" onChange={handleFileChange} />
                             <img 
      style={{width:'125px',margin:'0 auto'}}
        src={formData.profileImage?.url} 
        className="card-img-top text-center" 
        alt={`${formData.firstName} ${data.lastName}`
    
    } 
      />
                           </Form.Group>
                         </div>
                    
                      
                       </div>
                     
                     </Form>
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
  )
}

export default EmployeeView