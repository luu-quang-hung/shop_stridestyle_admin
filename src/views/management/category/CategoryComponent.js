import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormLabel,
  CTable,
  CContainer,
  CFormSelect
} from '@coreui/react'
import { BsTrash, BsFillPencilFill } from "react-icons/bs";
import { FormControl, InputGroup } from 'react-bootstrap';
import categoryService from 'src/views/service/category-service';
import { Table, Pagination, Button, Modal, Form } from 'react-bootstrap';
import PaginationCustom from 'src/views/pagination/PaginationCustom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from "react-confirm-alert"; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const CategoryComponent = () => {

  const [trademark, setTrademark] = useState([]);
  const [searchTrademark, setSearchTrademark] = useState({
    page: 0,
    size: 10,
    name: null
  });

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [newTrademark, setNewTrademark] = useState({
    gender: false,
    name: null
  });
  const [showModal, setShowModal] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);

  const [trademarkIdToDelete, setTrademarkIdToDelete] = useState(null);
  const [trademarkToUpdate, setTrademarkToUpdate] = useState({});


  useEffect(() => {
    getTradeMarkList();
  }, [searchTrademark]);

  const getTradeMarkList = () => {
    categoryService.findAllCategory(searchTrademark)
      .then(res => {
        setTrademark(res.data.content)
        setTotalPages(res.data.totalPages);
        console.log(res.data);
      })
      .catch(error => {
        if (err.response.status === 401) {
          navigate("/login")
        }
        console.log("Error load data Trademark", error);
      })
  }

  const handlePageChange = (page) => {
    setSearchTrademark({ ...searchTrademark, page: page - 1 })
    setCurrentPage(page)
  };

  //add
  const handleAddTrademark = () => {
    setShowModalAdd(true);
  };
  const confirmAddTradeMark = () => {
    categoryService.createCategory(newTrademark)
      .then(res => {
        console.log(res);
        toast.success("Tạo sản danh mục thành công", {
          position: "top-right",
          autoClose: 1000
        })
        setShowModalAdd(false)
        getTradeMarkList()
        setNewTrademark({
          name: "",
          gender: false
        })
      }).catch(err => {
        console.log(err);
        toast.error("Tạo sản danh mục thất bại", {
          position: "top-right",
          autoClose: 1000
        })
      })
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewTrademark((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleInputChange = (field, value) => {
    const nullValue = value === 'null' ? null : value;
    setSearchTrademark((prevSearchBill) => ({
      ...prevSearchBill,
      [field]: nullValue,
    }));
  };

  const cancelAddTradeMark = () => {
    setShowModalAdd(false);
  };

  // Xử lý cập nhật sản phẩm
  const handleUpdateTrademark = (trademark) => {
    setTrademarkToUpdate(trademark);
    setShowModal(true);
  };

  const confirmUpdateTrademark = () => {
    categoryService.updateCategory(trademarkToUpdate)
      .then(res => {
        console.log(res);
        toast.success("Cập nhật danh mục thành công", {
          position: "top-right",
          autoClose: 1000
        })
        getTradeMarkList();;
        setShowModal(false)

      }).catch(err => {
        console.log(err);
        toast.error("Cập nhật danh mục thất bại", {
          position: "top-right",
          autoClose: 1000
        })
      })
  };

  const cancelUpdateTrademark = () => {
    setShowModal(false);
  };

  const handleChangeUpdate = (event) => {
    const { name, value } = event.target;
    setTrademarkToUpdate((prevInfo) => ({ ...prevInfo, [name]: value }));
  }

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
      <div class="nav">
        <CForm class="row g-3">
          <CCol xs="auto">
            <CFormLabel htmlFor="staticEmail2" >
              <Button className="btn-loading" onClick={handleAddTrademark} >
                Thêm mới
              </Button>
            </CFormLabel>
          </CCol>
          <CCol xs="auto">
            <CFormInput
              type="text"
              id="name"
              placeholder="Tên danh mục"
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </CCol>
        </CForm>
      </div>
      <CCard>
        <CCardBody>

          <div class="table">
            <CTable bordered hover responsive>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên danh mục</th>
                  <th>Giới tính</th>
                  <th style={{ width: "10%" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {trademark.map((trademark, index) => (
                  <tr key={index}>
                    <td> {currentPage < 2
                      ? index + 1
                      : index + 1 + (currentPage - 1) * 10}
                    </td>
                    <td>{trademark.name}</td>
                    <td>{trademark.gender ? "Nữ" : "Nam"}</td>
                    <td>
                      <CRow>
                        <CCol md={4}>
                          <BsFillPencilFill onClick={() => handleUpdateTrademark(trademark)}></BsFillPencilFill>
                        </CCol>
                        <CCol md={4}>
                          <BsTrash onClick={() => confirmDeleteCategory(trademark.id, trademark.name)}></BsTrash>
                        </CCol>
                      </CRow>
                    </td>
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
          <Modal show={showModalAdd} onHide={cancelAddTradeMark} centered>
            <Modal.Header closeButton>
              <Modal.Title>Thêm mới danh mục</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <CRow>
                <CCol md={12} className='mb-3'>
                  <CFormInput
                    label="Tên danh mục"
                    name="name"
                    value={newTrademark.name}
                    onChange={handleChange}
                    placeholder="Nhập tên danh mục"
                  />
                </CCol>
                <CCol md={12}>
                  <CFormSelect
                    label="Giới tính"
                    name="gender"
                    onChange={handleChange}
                    value={newTrademark.gender}
                    options={[
                      'Chọn giới tính',
                      { label: 'Nam', value: false },
                      { label: 'Nữ', value: true },

                    ]}
                  />
                </CCol>
              </CRow>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={cancelAddTradeMark}>
                Hủy
              </Button>
              <Button variant="primary" onClick={confirmAddTradeMark}>
                Thêm mới
              </Button>
            </Modal.Footer>
          </Modal>

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
                  <Form.Label>Tên danh mục</Form.Label>
                  <FormControl
                    type="text"
                    name="name"
                    value={trademarkToUpdate.name}
                    onChange={handleChangeUpdate}
                    placeholder="Enter name"
                  />
                </Form.Group>
                <CFormSelect
                  name="gender"
                  label="Giới tính"
                  onChange={handleChangeUpdate}
                  value={trademarkToUpdate.gender}
                  options={[
                    { label: 'Nam', value: false },
                    { label: 'Nữ', value: true },

                  ]}
                />
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
        </CCardBody>
      </CCard>
    </CContainer>
  )
}
export default CategoryComponent;
