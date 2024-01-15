import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import AuthService from 'src/views/service/auth.service';
import { cilLockLocked, cilUser } from '@coreui/icons'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    setMessage('');
    setLoading(true);

    AuthService.login(username, password)
      .then((res) => {
        console.log(res.roles)

         if (res.data == "Tài Khoản mật khẩu không chính xác") {
          setMessage(res.data)
          setLoading(false);
        } else if (res.roles.indexOf('ROLE_USER') !== -1){
          setMessage("Bạn không có quền vào")
          setLoading(false);
        }
         else {
          // Login success
          window.location.href = '/sale-counter';
        }
      })
      .catch((error) => {
        // Login failed
        setLoading(false);
        const resMessage = "Tài Khoản mật khẩu không chính xác"
        setMessage(resMessage);
      });
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center" style={{  backgroundImage: `url("https://lh4.googleusercontent.com/s2LwPGcIefoHufjsLXHRzOpNxxqrZDXI0PscISwZp364ym9ZFb4bu1yAQe3I1e2BiTVHFAY4FEVC2P0CuoXFZA-yfRJ4y2SUUyMmL5rAPAi1NLUHPfrc-exr_2x2PeTk741eNM54")`,backgroundSize: 'cover',}}>
      <CContainer >
        <CRow className="justify-content-center" >
          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-4" style={{backgroundColor:"rgba(255, 255, 255, 0.5)" , color:"white"}}> 
             
                <CCardBody>
                  <CForm>
                    <h1 >Login</h1>
                    <br/>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={12} style={{textAlign:"center"}}>
                        <CButton  color="light" style={{width:"200px"}} onClick={handleLogin}>
                          Login
                        </CButton>
                        {/* Display a loading spinner or message if loading */}
                        {loading && <div>Loading...</div>}
                        {/* Display error message if login fails */}
                        {message && <div style={{ color: 'red' }}>{message}</div>}
                      </CCol>
                      
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
