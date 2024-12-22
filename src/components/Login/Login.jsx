import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import apiUrls from '../apiConfig.json'; // Adjust the path as necessary
import { url } from '../URL/Url';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`${url}/api/userLogin/userLogin`, {
        email,
        password,
      });
  console.log("login",response);
  
      // Save token to session storage
      sessionStorage.setItem('token', response.data.token); 
      sessionStorage.setItem('name', response.data.user.name);
      sessionStorage.setItem('role', response.data.user.role);
      sessionStorage.setItem('id', response.data.user.id);
      sessionStorage.setItem('profile', response.data.user.profile);
  
      // Clear input fields
      setEmail('');
      setPassword('');
  
    // if (response.data.user.role == 'Admin'  ){
      navigate('/admin/Dashboard');
    // }
    // if (response.data.user.role == 'Employee'){
    //   navigate('/employee/Dashboard')
    // }
    
  
      // Show success alert
      Swal.fire({
        title: 'Success!',
        text: 'Login successful!',
        icon: 'success',
        confirmButtonText: 'Okay',
      }).then(()=>{
        window.location.reload();
      })
    } catch (error) {
      // Show error alert
      Swal.fire({
        title: 'Error!',
        text: error.response ? error.response.data.message : 'Login failed!',
        icon: 'error',
        confirmButtonText: 'Okay',
      });
    }
  };
  

  return (
    <>
      <div className="wrapper-login box-shadow-common">
        <div className="loginbox">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAA8FBMVEX7JSX////6Hh77TU38IiL7GRn8///7T0/8GBjv///8Hh30///6EhL9gIDs///9IiH3goP9Dg30YmT49PX/BgTwg4byd3nb1+PlipHXJzP8z9D1ExXytbe+///4+fvRzdj+eXnu0NPMz9/fu8TfXWb+xcXxU1b9mZnkQ0v4MjPuMjSnXHPuyM3vISThtL30bnDfqLL1nqDrnKHmd3753t7p6/PZcXzo1t3rUFTqODzphYzknaXGboDoFRzY///gOUDDfZDv4uTcanTl5OzUcH/ZfonmICf6rKzUi5nTl6Xc8vjRpK/aJC7FvdDKq7n66utAKbomAAAD80lEQVR4nO3aa1faMBgH8KampZQMFqhMrWPiBS8T8a7omHPe5mXz+3+bFZxSRwvJ6FkePP/fK4+HF/mf9kmepLEsAAAAAAAAAAAAAAAAAAAAAAAAAAAAgDeC216PXTI9knHYQl5PXV6dzFxdTj1IYZsez78peUF7+8J1WY/rXpy2A4ebHpU2Lq6ni+wvxVbHm7AoXjgYoyvfsh3TY9MhlytJMboqa9L06NQFt25ajsiPwPT4VAXzQ2JEbiYjCZeLw3MwtjQRScIRz6NrawLqxGmNzsHYzAQkGVbnfW3f9DhHkKnz7msF4mXivVPLwdiuMD3WYXgnrxokb1FuVrwF1RxRvXumR5uOh/vqQR5Duo/EP1bPwdgx3YnLW9UJckq33MO6TpB9skG4VdAJUmxSLRJu6eRg7IxqkdhtvSDfqU7Aznu9IO+o7nod5f4EQf4P3VerSjXImyl23em3TfUMlds1nRyEG3n5qBPknO6+3TvRCbJKtUR0i4RwG2+FyjvdqGckvLGynLJ6kDLdN6v7VUTtVCuSvyb9MU79keyR3VY9UZ2Bi8QP6JTbFPJHppZoqZTJCd3F8IVQOErZIV4gPXz0Ofa8JLyE9HG5M+J5TEaOiKwOqRO3NQH18UxsHKTluNuYhPp44dvTiYd1hdYD5c4kARcP1YGnclcOPdKNyQsu+u9NyRNn9/VusfQKxq3vrIexSzVSEK54x9n/FcTG5wvZaTbKjXK50elci9jD4MHPI4fqIYol2tEKciNeNR+c+z2cxx+AIzaj/jdHtOxl9ameN0a9NFyu9WaCwjTFBYUHL8vgajhsZuIi3H7+5Ra9XSIXS/3ZqdZKvStXEuFV7CbXB0FsFuPi06uJtlYNhT+QhTtydub1hTRqSQZb3sp8QwjH/1PjvBTNxp61vDSwTC6ServkdNIyXqkvNKxmKCOd2fUvt5uJtwNPCe0VRTVphD1uoVY5P6/Uiult5DcyTaTdVD47Scy6QWRl1LrvkORrh0bBy93xcjB2T2KJ9zU/7yQorFE4U5FjvlhdRwQeic5xb7pD89stqXEAn65gfAr2DrPIwdie6UcSaH02TJc33Kn4jWxyGP9+JY+yClI3WiV8vOYkzjV6eyu7N8vwDCwULvSr2jT4bmne/Ruu0DTXOupdjx1l2Vw3743d98YZvC0vMugX+w5CUzm4yLBEukViagL2z7LMwZixXYmfSQffVzYVxJvJNsiJqSUx20mLsW1T05ZYyTbIylsJUn8rQeaMBZljbla6Xxo/mmob/XJuSlsuF/8jF/t37rOpWYuvczsrvu03zTWNlL5sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH2/AZfgR0yptKr4AAAAAElFTkSuQmCC"
            className="avatar"
          />

          <h1 className='text-black'>Login Here</h1>
          <form onSubmit={handleLogin} className='form-wrapper-login'>
      
             <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email ID"
            
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
           
             <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
            />
          </Form.Group>
            <input type="submit" value="Login" />
            {/* <a href="#"> Lost your password</a>
            <br />
            <a href="#"> Don't have an account?</a> */}
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
