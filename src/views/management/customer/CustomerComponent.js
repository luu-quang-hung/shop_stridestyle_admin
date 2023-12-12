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
import PaginationCustom from 'src/views/pagination/PaginationCustom';

const CustomerComponent = () => {
  const [customer, setCustomer] = useState([]);
  const [customerSearch, setCustomerSearch] = useState({
    page: 0,
    size: 10
  });
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    getCustomerList();
  }, []);

  const getCustomerList = () => {
    UserService.getCustomer(customerSearch)
      .then(res => {
        setCustomer(res.data.content);
        console.log(res.data.content);
      })
      .catch(err => {
        if (err.response.status === 401) {
          navigate("/login")
        }
        console.error('Error fetching Customer:', err);
      })
  }

  const handlePageChange = (page) => {
    setCustomerSearch({ ...trandemarkSearch, page: page - 1 })
    setCurrentPage(page)
  };
  return (
    <CContainer>
      <CCard>
        <CCardBody>
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
            <CTable striped bordered hover responsive>
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
                {customer.map((cus, index) => (
                  <tr key={index}>
                    <td> {currentPage < 2
                      ? index + 1
                      : index + 1 + (currentPage - 1) * 10}
                    </td>                       
                    <td>{cus.fullName}</td>
                    <td>{cus.address}</td>
                    <td>{cus.phone}</td>
                    <td>{cus.email || "No email available"}</td>
                    {/* <td>
                      <img src={cus.user?.image} alt={cus.user?.name} style={{ maxWidth: '100px' }} />
                    </td> */}
                    {/* <td>{cus.user?.username}</td> */}
                  </tr>
                ))}
              </tbody>
            </CTable>
            <PaginationCustom
              currentPageP={currentPage}
              maxPageNumber={5}
              total={totalPages}
              onChange={handlePageChange}
            />
            \          </div>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}
export default CustomerComponent;
