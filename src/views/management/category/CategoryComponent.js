import React, { useEffect, useState } from 'react'
import UserService from 'src/views/service/user.service';
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
  CTable
} from '@coreui/react'
import { BsTrash, BsFillPencilFill } from "react-icons/bs";
import { FormControl, InputGroup } from 'react-bootstrap';

import { Table, Pagination, Button, Modal, Form } from 'react-bootstrap';
const CategoryComponent = () => {

  const [trademarks, setTrademark] = useState([]);
  const [newTrademark, setNewTrademark] = useState({
    name: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [trademarkIdToDelete, setTrademarkIdToDelete] = useState(null);
  const [trademarkToUpdate, setTrademarkToUpdate] = useState({});


  useEffect(() => {
    getTradeMarkList();
  }, []);

  const getTradeMarkList = () => {
    UserService.getTradeMark()
      .then(res => {
        setTrademark(res.data.data)
      })
      .catch(error => {
        console.log("Error load data Trademark", error);
      })
  }

  const handleAddTrademark = () => {
    setShowModal(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewTrademark((prevInfo) => ({ ...prevInfo, [name]: value }));
  };



  // Xác nhận thêm mới sản phẩm
  const confirmAddTradeMark = () => {
    UserService.createTrademark(newTrademark)
      .then(res => {
        console.log(res);
        getTradeMarkList();
        setShowModal(false);
      }).catch(error => {
        console.log(error);
      })
  };

  // Hủy thêm mới sản phẩm
  const cancelAddTradeMark = () => {
    setShowModal(false);
  };

  const handleDeleteTrademark = (id) => {
    setTrademarkIdToDelete(id);
    setShowModal(true);
  };

  const confirmDeleteTrademark = () => {
    UserService.deleteTrademark(trademarkIdToDelete)
      .then(res => {
        console.log(res);
        getTradeMarkList();
        setShowModal(false);

      }).catch(error => {
        console.log(error);
      })
  };

  // Hủy xóa sản phẩm
  const cancelDeleteTrademark = () => {
    setShowModal(false);
  };


  // Xử lý cập nhật sản phẩm
  const handleUpdateTrademark = (Trademark) => {
    setTrademarkToUpdate(Trademark);
    setShowModal(true);
  };

  // Xác nhận cập nhật sản phẩm
  const confirmUpdateTrademark = () => {
    UserService.updateTrademark(trademarkToUpdate)
    .then(res => {
      console.log(res);
      getTradeMarkList();
      setShowModal(false);

    }).catch(error => {
      console.log(error);
    })
  };

  // Hủy cập nhật sản phẩm
  const cancelUpdateTrademark = () => {
    setShowModal(false);
  };

  const handleChangeUpdate = (event) => {
    const { name, value } = event.target;
    setTrademarkToUpdate((prevInfo) => ({ ...prevInfo, [name]: value }));
  }
  return (
    <div class="container">
      <div class="nav">
        <CForm class="row g-3">
          <CCol xs="auto">
            <CFormLabel htmlFor="staticEmail2" >
              <Button variant="outline-primary" className="btn-loading" onClick={handleAddTrademark} >
                Thêm mới
              </Button>
            </CFormLabel>
          </CCol>
          <CCol xs="auto">
            <CFormInput type="text" id="nameTrademark" placeholder="Name Trademark" />
          </CCol>
          <CCol xs="auto">
            <CButton type="submit" className="mb-3">
              Tìm kiếm
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
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {trademarks.map((trademark) => (
              <tr key={trademark.idTrademark}>
                <td>{trademark.idTrademark}</td>
                <td>{trademark.nameTrademark}</td>
                <td>
                  <Button variant="primary" onClick={() => handleUpdateTrademark(trademark)}>
                    <BsFillPencilFill></BsFillPencilFill>
                  </Button>
                </td>
                <td>
                  <Button variant="danger" onClick={() => handleDeleteTrademark(trademark.idTrademark)}>
                    <BsTrash></BsTrash>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>


      <Modal show={showModal} onHide={cancelAddTradeMark}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm mới nhà sản xuất</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="nameTrademark"
                value={newTrademark.nameTrademark}
                onChange={handleChange}
                placeholder="Enter name"
              /></Form.Group>
            <Form.Control
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </Form>
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

      {/* Modal xác nhận xóa sản phẩm */}
      <Modal show={showModal} onHide={cancelDeleteTrademark}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa sản phẩm này không?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDeleteTrademark}>
            Hủy
          </Button>
          <Button variant="danger" onClick={confirmDeleteTrademark}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal cập nhật sản phẩm */}
      <Modal show={showModal} onHide={cancelUpdateTrademark}>
        <Modal.Header >
          <Modal.Title>Cập nhật sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formId">
              <Form.Label>ID</Form.Label>
              <FormControl
                type="text"
                placeholder="Enter ID"
                value={trademarkToUpdate?.idTrademark || ''} disabled
                onChange={handleChangeUpdate}
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <FormControl
                type="text"
                name="nameTrademark"
                value={trademarkToUpdate.nameTrademark}
                onChange={handleChangeUpdate}
                placeholder="Enter name"
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
    </div>
  )
}
export default CategoryComponent;
