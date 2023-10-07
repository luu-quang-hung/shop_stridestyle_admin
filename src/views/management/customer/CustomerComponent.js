import React, { useEffect, useState } from 'react'
import UserService from 'src/views/service/user.service';
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
  CFormLabel,
  CTable
} from '@coreui/react'
import { BsTrash, BsFillPencilFill } from "react-icons/bs";

import { Table, Pagination, Button, Modal, Form } from 'react-bootstrap';
const CustomerComponent = () => {
  const [customer, setCustomer] = useState([]);


  useEffect(() => {
    getCustomerList();
  }, []);

  const getCustomerList = () => {
    UserService.getCustomer()
      .then(res => {
        setCustomer(res.data.data);
      })
      .catch(err => {
        console.error('Error fetching Customer:', err);
      })
  }
  console.log(customer)
  return (
    <div class="container">
      <div class="nav">
        <CForm class="row g-3">
          <CCol xs="auto">
            <CFormInput type="text" id="nameProduct" placeholder="Phone or Email" />
          </CCol>
          <CCol xs="auto">
          </CCol>
          <CCol xs="auto">
            <CFormInput type="text" id="nameProduct" placeholder="Name" />
          </CCol>
          <CCol xs="auto">

          </CCol>
          <CCol xs="auto">
            <CButton type="submit" className="mb-3">
              Search
            </CButton>
          </CCol>
        </CForm>
      </div>

      <div class="table">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Phone number</th>
              <th>Email</th>
              <th>Image</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {customer.map((cus) => (
              <tr key={cus.idCustomer}>
                <td>{cus.idCustomer}</td>
                <td>{cus.nameCustomer}</td>
                <td>{cus.address}</td>
                <td>{cus.phoneNumber}</td>
                <td>{cus.user?.email || "No email available"}</td>
                <td>
                  <img src={cus.user?.image} alt={cus.user?.name} style={{ maxWidth: '100px' }} />
                </td>
                <td>{cus.user?.username}</td>
              </tr>
            ))}
          </tbody>
        </Table>

      </div>
    </div>
  )
}
export default CustomerComponent;
