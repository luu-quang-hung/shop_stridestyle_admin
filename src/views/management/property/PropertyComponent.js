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
  CContainer
} from '@coreui/react'
import PaginationCustom from 'src/views/pagination/PaginationCustom';
import propertyService from 'src/views/service/property-service';
import { BsTrash, BsFillPencilFill } from "react-icons/bs";
import { FormControl, InputGroup } from 'react-bootstrap';
import { Table, Pagination, Button, Modal, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from "react-confirm-alert"; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


const getUserRoles = () => {
  const user = localStorage.getItem('userAdmin');
  if (user) {
    return JSON.parse(user).roles;
  }
  return [];
};

const currentUserRoles = getUserRoles();
const isAdmin = currentUserRoles[0] === 'ROLE_ADMIN';
const PropertyComponent = () => {
  const [property, setProperty] = useState([]);
  const [propertySearch, setPropertySearch] = useState({
    page: 0,
    size: 10,
    name: null
  });
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [totalPagesSize, setTotalPagesSize] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(1);

  const [sizeProduct, setSizeProduct] = useState([]);
  const [sizeProductSearch, setSizeProductSearch] = useState({
    page: 0,
    size: 10,
    name: null

  });

  const [showModalCreatePro, setShowModalCreatePro] = useState(false);
  const [showModalCreateSize, setShowModalCreateSize] = useState(false);

  const [showModalUpdatePro, setShowModalUpdatePro] = useState(false);
  const [showModalUpdateSize, setShowModalUpdateSize] = useState(false);

  const [createProperty, setCreateProperty] = useState({
    name: null
  });
  const [createSize, setCreateSize] = useState({
    name: null
  });

  const [updateProperty, setUpdateProperty] = useState({
    idProperty: null,
    name: null
  });
  const [updateSize, setUpdateSize] = useState({
    id: null,
    name: null
  });
  useEffect(() => {
    getAllProperty();
    getAllSizeProduct();
  }, [propertySearch, sizeProductSearch]);

  const getAllProperty = () => {
    propertyService.findAllProperty(propertySearch)
      .then(res => {
        setProperty(res.data.content)
        setTotalPagesSize(res.data.totalPages);
        console.log("Property ", res.data);
      })
      .catch(error => {
        if (error.response.status === 401) {
          navigate("/login")
        }
        console.log("Error load data property", error);
      })
  }

  const getAllSizeProduct = () => {
    propertyService.findAllSize(sizeProductSearch)
      .then(res => {
        setSizeProduct(res.data.content)
        setTotalPages(res.data.totalPages);
        console.log("size", res.data);
      })
      .catch(error => {
        console.log("Error load data Size", error);
      })
  }

  const handlePageChangeProperty = (page) => {
    setPropertySearch({ ...propertySearch, page: page - 1 })
    setCurrentPage(page)
  };

  const handlePageChangeSize = (page) => {
    setSizeProductSearch({ ...sizeProductSearch, page: page - 1 })
    setCurrentPageSize(page)
  };

  const handleAddProperty = () => {
    setShowModalCreatePro(true);
  };

  const handleAddSize = () => {
    setShowModalCreateSize(true);
  };

  const cancelAddProperty = () => {
    setShowModalCreatePro(false);
  };

  const cancelAddSize = () => {
    setShowModalCreateSize(false);
  };

  const handleChangeCreatePro = (event) => {
    const { name, value } = event.target;
    setCreateProperty((prevInfo) => ({ ...prevInfo, [name]: value }));
  };
  const handleChangeCreateSize = (event) => {
    const { name, value } = event.target;
    setCreateSize((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const confirmCreatePro = () => {
    propertyService.createProperty(createProperty)
      .then(res => {
        toast.success("Tạo màu thành công", {
          position: "top-right",
          autoClose: 1000
        })
        setShowModalCreatePro(false)
        getAllProperty()
        setCreateProperty({
          name: "",
          gender: false
        })
      }).catch(err => {
        toast.error("Tạo màu thất bại", {
          position: "top-right",
          autoClose: 1000
        })
      })
  };

  const confirmCreateSize = () => {
    propertyService.createSize(createSize)
      .then(res => {
        toast.success("Tạo kích thước thành công", {
          position: "top-right",
          autoClose: 1000
        })
        setShowModalCreateSize(false)
        getAllSizeProduct()
        setCreateSize({
          name: "",
        })
      }).catch(err => {
        toast.error("Tạo kích thước thất bại", {
          position: "top-right",
          autoClose: 1000
        })
      })
  };

  const handleInputProChange = (field, value) => {
    const nullValue = value === 'null' ? null : value;
    setPropertySearch((prevSearchBill) => ({
      ...prevSearchBill,
      [field]: nullValue,
    }));
  };


  const handleInputSizeChange = (field, value) => {
    const nullValue = value === 'null' ? null : value;
    setSizeProductSearch((prevSearchBill) => ({
      ...prevSearchBill,
      [field]: nullValue,
    }));
  };


  const confirmDeletePro = (idProperty, nameProperty) => {
    if (idProperty) {
      confirmAlert({
        message:
          `Bạn có chắc chắn muốn xóa danh mục ` + nameProperty + ` không ?`,
        buttons: [
          {
            label: "Trở lại",
            className: "stayPage",
          },
          {
            label: "Xác nhận",
            onClick: () => deleteProperty(idProperty),
            className: "leavePage",
          },
        ],
      });
    }
  };
  const deleteProperty = (idProperty) => {
    const json = {
      idProperty: idProperty
    }
    propertyService.deleteProperty(json)
      .then(res => {
        console.log(res);
        toast.success("Xóa màu thành công", {
          position: "top-right",
          autoClose: 3000,
        });
        getAllProperty();
      })
      .catch(error => {
        toast.error("Xóa danh mục thất bại", {
          position: "top-right",
          autoClose: 3000,
        });
        console.log("Error load delete", error);
      })
  }

  const confirmDeleteSize = (idSize, nameSize) => {
    if (idSize) {
      confirmAlert({
        message:
          `Bạn có chắc chắn muốn xóa danh mục ` + nameSize + ` không ?`,
        buttons: [
          {
            label: "Trở lại",
            className: "stayPage",
          },
          {
            label: "Xác nhận",
            onClick: () => deleteSize(idSize),
            className: "leavePage",
          },
        ],
      });
    }
  };
  const deleteSize = (idSize) => {
    const json = {
      id: idSize
    }
    propertyService.deleteSize(json)
      .then(res => {
        toast.success("Xóa màu thành công", {
          position: "top-right",
          autoClose: 3000,
        });
        getAllSizeProduct();
      })
      .catch(error => {
        toast.error("Xóa danh mục thất bại", {
          position: "top-right",
          autoClose: 3000,
        });
        console.log("Error load delete", error);
      })
  }


  const handleUpdatePro = (property) => {
    setUpdateProperty(property);
    setShowModalUpdatePro(true);
  };

  const handleChangeUpdate = (event) => {
    const { name, value } = event.target;
    setUpdateProperty((prevInfo) => ({ ...prevInfo, [name]: value }));
  }

  const confirmUpdatePro = () => {
    propertyService.updateProperty(updateProperty)
      .then(res => {
        console.log(res);
        toast.success("Cập nhật màu thành công", {
          position: "top-right",
          autoClose: 1000
        })
        getAllProperty();;
        setShowModalUpdatePro(false)
      }).catch(err => {
        console.log(err);
        toast.error("Cập nhật màu thất bại", {
          position: "top-right",
          autoClose: 1000
        })
      })
  };

  const cancelUpdatePro = () => {
    setShowModalUpdatePro(false)
  };

  const handleUpdateSize = (size) => {
    setUpdateSize(size);
    setShowModalUpdateSize(true);
  };


  const handleChangeUpdateSize = (event) => {
    const { name, value } = event.target;
    setUpdateSize((prevInfo) => ({ ...prevInfo, [name]: value }));
  }

  const confirmUpdateSize = () => {
    propertyService.updateSize(updateSize)
      .then(res => {
        console.log(res);
        toast.success("Cập nhật size thành công", {
          position: "top-right",
          autoClose: 1000
        })
        getAllSizeProduct();;
        setShowModalUpdateSize(false)
      }).catch(err => {
        console.log(err);
        toast.error("Cập nhật size thất bại", {
          position: "top-right",
          autoClose: 1000
        })
      })
  };

  const cancelUpdateSize = () => {
    setShowModalUpdateSize(false)
  };


  return (
    <CContainer>
      <ToastContainer position="top-right"></ToastContainer>
      <CRow>
        <CCol md="6">
          <CCard >
            <CCardBody>
              <h3>Màu sắc</h3>
              <CForm class="row g-3">
                {isAdmin && (
                  <CCol xs="auto">
                    <CFormLabel htmlFor="staticEmail2" >
                      <Button className="btn-loading"
                        onClick={handleAddProperty}
                      >
                        Thêm mới
                      </Button>
                    </CFormLabel>
                  </CCol>
                )}
                <CCol xs="auto">
                  <CFormInput
                    type="text"
                    id="name"
                    placeholder="Tên màu"
                    onChange={(e) => handleInputProChange('name', e.target.value)}
                  />
                </CCol>
              </CForm>
              <CTable striped bordered hover >
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên</th>
                    {isAdmin && (
                      <th style={{ width: "102px" }}>Hành động</th>

                    )}
                  </tr>
                </thead>
                <tbody>
                  {property.map((property, index) => (
                    <tr key={index}>
                      <td> {currentPage < 2
                        ? index + 1
                        : index + 1 + (currentPage - 1) * 10}
                      </td>
                      <td>{property.name}</td>
                      {isAdmin && (
                        <td>

                          <CRow>
                            <CCol md={4}>
                              <BsFillPencilFill onClick={() => handleUpdatePro(property)}></BsFillPencilFill>
                            </CCol>
                            <CCol md={4}>
                              <BsTrash onClick={() => confirmDeletePro(property.idProperty, property.name)}></BsTrash>
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
                onChange={handlePageChangeProperty}
              />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md="6">
          <CCard>
            <CCardBody>
              <h3>Kích cỡ</h3>
              <CForm class="row g-3">
                {isAdmin && (
                  <CCol xs="auto">
                    <CFormLabel htmlFor="staticEmail2" >
                      <Button className="btn-loading"
                        onClick={handleAddSize}
                      >
                        Thêm mới
                      </Button>
                    </CFormLabel>
                  </CCol>
                )}
                <CCol xs="auto">
                  <CFormInput
                    type="text"
                    id="name"
                    placeholder="Tên kích cỡ"
                    onChange={(e) => handleInputSizeChange('name', e.target.value)}
                  />
                </CCol>
              </CForm>
              <CTable striped bordered hover >
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    {isAdmin && (
                      <th style={{ width: "10%" }}>Hành động</th>

                    )}
                  </tr>
                </thead>
                <tbody>
                  {sizeProduct.map((size, index) => (
                    <tr key={index}>
                      <td> {currentPage < 2
                        ? index + 1
                        : index + 1 + (currentPage - 1) * 10}
                      </td>
                      <td>{size.name}</td>
                      {isAdmin && (
                        <td>
                          <CRow>
                            <CCol md={4}>
                              <BsFillPencilFill onClick={() => handleUpdateSize(size)}></BsFillPencilFill>
                            </CCol>
                            <CCol md={4}>
                              <BsTrash onClick={() => confirmDeleteSize(size.id, size.name)}></BsTrash>
                            </CCol>
                          </CRow>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </CTable>
              <PaginationCustom
                currentPageP={currentPageSize}
                maxPageNumber={5}
                total={totalPagesSize}
                onChange={handlePageChangeSize}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <Modal show={showModalCreatePro} onHide={cancelAddProperty} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thêm mới màu sắc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CRow>
            <CCol md={12} className='mb-3'>
              <CFormInput
                label="Tên màu"
                name="name"
                value={createProperty.name}
                onChange={handleChangeCreatePro}
                placeholder="Nhập tên danh mục"
              />
            </CCol>
          </CRow>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelAddProperty}>
            Hủy
          </Button>
          <Button variant="primary"
            onClick={confirmCreatePro}
          >
            Thêm mới
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalCreateSize} onHide={cancelAddSize} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thêm mới kích cỡ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CRow>
            <CCol md={12} className='mb-3'>
              <CFormInput
                label="Tên kích cỡ"
                name="name"
                value={createSize.name}
                onChange={handleChangeCreateSize}
                placeholder="Nhập tên danh mục"
              />
            </CCol>
          </CRow>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelAddSize}>
            Hủy
          </Button>
          <Button variant="primary"
            onClick={confirmCreateSize}
          >
            Thêm mới
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showModalUpdatePro} onHide={cancelUpdatePro}>
        <Modal.Header >
          <Modal.Title>Cập nhật màu sắc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formId">
              <Form.Label>ID</Form.Label>
              <FormControl
                type="text"
                placeholder="Enter ID"
                value={updateProperty.idProperty || ''} disabled
                onChange={handleChangeUpdate}
              />
            </Form.Group>
            <Form.Group controlId="formName" className='mb-3'>
              <Form.Label>Tên danh mục</Form.Label>
              <FormControl
                type="text"
                name="name"
                value={updateProperty.name}
                onChange={handleChangeUpdate}
                placeholder="Enter name"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelUpdatePro}>
            Hủy
          </Button>
          <Button variant="primary" onClick={confirmUpdatePro}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalUpdateSize} onHide={cancelUpdateSize}>
        <Modal.Header >
          <Modal.Title>Cập nhật màu sắc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formId">
              <Form.Label>ID</Form.Label>
              <FormControl
                type="text"
                placeholder="Enter ID"
                value={updateSize.id || ''} disabled
                onChange={handleChangeUpdateSize}
              />
            </Form.Group>
            <Form.Group controlId="formName" className='mb-3'>
              <Form.Label>Tên danh mục</Form.Label>
              <FormControl
                type="text"
                name="name"
                value={updateSize.name}
                onChange={handleChangeUpdateSize}
                placeholder="Enter name"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelUpdateSize}>
            Hủy
          </Button>
          <Button variant="primary" onClick={confirmUpdateSize}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
    </CContainer>



  )
}

export default PropertyComponent;