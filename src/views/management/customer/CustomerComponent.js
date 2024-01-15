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

import { Table, Pagination, Button, Modal, Form, FormControl } from 'react-bootstrap';
import PaginationCustom from 'src/views/pagination/PaginationCustom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import userService from 'src/views/service/user.service';

const getUserRoles = () => {
  const user = localStorage.getItem('userAdmin');
  if (user) {
    return JSON.parse(user).roles;
  }
  return [];
};

const currentUserRoles = getUserRoles();
const isAdmin = currentUserRoles[0] === 'ROLE_ADMIN';

const CustomerComponent = () => {
  const [customer, setCustomer] = useState([]);
  const [customerSearch, setCustomerSearch] = useState({
    page: 0,
    size: 10
  });
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [trademarkToUpdate, setTrademarkToUpdate] = useState({});


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
        if (error.response.status === 401) {
          navigate("/login")
        }
        console.error('Error fetching Customer:', err);
      })
  }

  const handlePageChange = (page) => {
    setCustomerSearch({ ...trandemarkSearch, page: page - 1 })
    setCurrentPage(page)
  };


  const handleUpdateTrademark = (trademark) => {
    setTrademarkToUpdate(trademark);
    setShowModal(true);
  };

  const cancelUpdateTrademark = () => {
    setShowModal(false);
  };

  const handleChangeUpdate = (event) => {
    const { name, value } = event.target;
    setTrademarkToUpdate((prevInfo) => ({ ...prevInfo, [name]: value }));
  }

  const confirmUpdateTrademark = () => {
    userService.updateCustomer(trademarkToUpdate)
      .then(res => {
        toast.success("Cập nhật tài khoản thành công", {
          position: "top-right",
          autoClose: 1000
        })
        getCustomerList();
        setShowModal(false)
        return
      }).catch(err => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
        toast.error("Cập nhật tài khoản thất bại", {
          position: "top-right",
          autoClose: 1000
        })
      })
  };

  const confirmDeleteCategory = (idCate, nameCate) => {
    if (idCate) {
      confirmAlert({
        message:
          `Bạn có chắc chắn muốn xóa danh mục ` + nameCate + ` không ?`,
        buttons: [
          {
            label: "Trở lại",
            className: "stayPage",
          },
          {
            label: "Xác nhận",
            onClick: () => deleteCategory(idCate),
            className: "leavePage",
          },
        ],
      });
    }
  };
  const deleteCategory = (idCate) => {
    const json = {
      id: idCate
    }
    categoryService.deleteCategory(json)
      .then(res => {
        toast.success("Xóa danh mục thành công", {
          position: "top-right",
          autoClose: 3000,
        });
        getTradeMarkList();
      })
      .catch(error => {
        toast.error("Xóa danh mục thất bại", {
          position: "top-right",
          autoClose: 3000,
        });
        console.log("Error load delete", error);
      })
  }

  return (
    <CContainer>
      <ToastContainer position="top-right"></ToastContainer>

      <CCard>
        <CCardBody>
          <div class="nav">
            <CForm class="row g-3">
              <CCol xs="auto">
                <CFormInput type="text" id="nameProduct" placeholder="Email" />
              </CCol>
              <CCol xs="auto">
              </CCol>
              <CCol xs="auto">
                <CFormInput type="text" id="nameProduct" placeholder="Họ và tên" />
              </CCol>
              <CCol xs="auto">
              </CCol>
              <CCol xs="auto">
                <CButton type="submit" className="mb-3">
                  Tìm kiếm
                </CButton>
              </CCol>
            </CForm>
          </div>
          <div class="table">
            <CTable striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Họ và tên</th>
                  <th>Địa chỉ</th>
                  <th>Số điện thoại</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {customer.map((cus, index) => (
                  <tr key={index}>
                    <td> {currentPage < 2
                      ? index + 1
                      : index + 1 + (currentPage - 1) * 10}
                    </td>
                    <td>{cus.userEntity?.username}</td>

                    <td>{cus.fullName}</td>
                    <td>{cus.address}</td>
                    <td>{cus.phone}</td>
                    <td>{cus.email || "No email available"}</td>
                    <td>{cus.userEntity?.roles[0].name}</td>

                    {isAdmin && (
                      <td>
                        <CRow>
                          <CCol md={4}>
                            <BsFillPencilFill onClick={() => handleUpdateTrademark(cus)}></BsFillPencilFill>
                          </CCol>
                          <CCol md={4}>
                          <BsTrash onClick={() => confirmDeleteCategory(cus.id, cus.username)}></BsTrash>
                          </CCol>
                        </CRow>
                      </td>
                    )}
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
          </div>
        </CCardBody>
      </CCard>

      <Modal show={showModal} onHide={cancelUpdateTrademark}>
        <Modal.Header >
          <Modal.Title>Cập nhật danh mục</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formId">
              <Form.Label>ID</Form.Label>
              <FormControl
                type="text"
                placeholder="Enter ID"
                value={trademarkToUpdate.id || ''} disabled
                onChange={handleChangeUpdate}
              />
            </Form.Group>
            <Form.Group controlId="formName" className='mb-3'>
              <Form.Label>Họ và tên</Form.Label>
              <FormControl
                type="text"
                name="fullName"
                value={trademarkToUpdate.fullName}
                onChange={handleChangeUpdate}
                placeholder="Họ và tên"
              />
            </Form.Group>
            <Form.Group controlId="formName" className='mb-3'>
              <Form.Label>Email</Form.Label>
              <FormControl
                type="text"
                name="email"
                value={trademarkToUpdate.email}
                onChange={handleChangeUpdate}
                placeholder="email"
              />
            </Form.Group>
            <Form.Group controlId="formName" className='mb-3'>
              <Form.Label>Số điện thoại</Form.Label>
              <FormControl
                type="text"
                name="phone"
                value={trademarkToUpdate.phone}
                onChange={handleChangeUpdate}
                placeholder="Số điện thoại"
              />
            </Form.Group>
          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelUpdateTrademark}>
            Hủy
          </Button>
          <Button variant="primary" onClick={confirmUpdateTrademark}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
    </CContainer>
  )
}
export default CustomerComponent;
