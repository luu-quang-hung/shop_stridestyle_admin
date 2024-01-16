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
import { BsTrash, BsFillPencilFill } from "react-icons/bs";
import { Container, FormControl, InputGroup } from 'react-bootstrap';
import categoryService from 'src/views/service/category-service';
import { Table, Pagination, Button, Modal, Form } from 'react-bootstrap';
import PaginationCustom from 'src/views/pagination/PaginationCustom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from "react-confirm-alert"; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import eventService from 'src/views/service/event-service';

const getUserRoles = () => {
  const user = localStorage.getItem('userAdmin');
  if (user) {
    return JSON.parse(user).roles;
  }
  return [];
};

const currentUserRoles = getUserRoles();
const isAdmin = currentUserRoles[0] === 'ROLE_ADMIN';
const EvenComponent = () => {
  const [event, setEvent] = useState([]);
  const [eventSearch, setEventSearch] = useState({
    page: 0,
    size: 10
  });
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [totalPagesSize, setTotalPagesSize] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(1);

  const [voucher, setVoucher] = useState([]);
  const [voucherSearch, setVoucherSearch] = useState({
    page: 0,
    size: 10
  });

  const [showModalCreateEven, setShowModalCreateEven] = useState(false);
  const [showModalCreateVoucher, setShowModalCreateVoucher] = useState(false);

  const [showModalUpdateEven, setShowModalUpdateEven] = useState(false);
  const [showModalUpdateVoucher, setShowModalUpdateVoucher] = useState(false);

  const [createEvent, setCreateEvent] = useState({
    endDay: null,
    name: null,
    startDay: null
  });
  const [createVoucher, setCreateVoucher] = useState({
    amount: null,
    discount: null,
    idEvent: null,
    minimumValue: null,
    name: null
  });

  const [updateEvent, setUpdateEvent] = useState({
    idProperty: null,
    name: null
  });
  const [updateVoucher, setUpdateVoucher] = useState({
    id: null,
    name: null
  });

  useEffect(() => {
    getAllEvent();
    getAllVoucher();
  }, [eventSearch, voucherSearch]);

  const getAllEvent = () => {
    eventService.findAllEvent(eventSearch)
      .then(res => {
        setEvent(res.data.content)
        setTotalPagesSize(res.data.totalPages);
      })
      .catch(error => {
        if (error.response.status === 401) {
          navigate("/login")
        }
        console.log("Error load data event", error);
      })
  }

  const getAllVoucher = () => {
    eventService.findAllVoucher(eventSearch)
      .then(res => {
        setVoucher(res.data.content)
        setTotalPages(res.data.totalPages);
      })
      .catch(error => {
        console.log("Error load data Size", error);
      })
  }

  const handlePageChangeEvent = (page) => {
    setEventSearch({ ...eventSearch, page: page - 1 })
    setCurrentPage(page)
  };

  const handlePageChangeSize = (page) => {
    setVoucherSearch({ ...voucherSearch, page: page - 1 })
    setCurrentPageSize(page)
  };

  const handleAddEvent = () => {
    setShowModalCreateEven(true);
  };

  const handleAddVoucher = () => {
    setShowModalCreateVoucher(true);
  };

  const cancelAddEvent = () => {
    setShowModalCreateEven(false);
  };

  const cancelAddVoucher = () => {
    setShowModalCreateVoucher(false);
  };

  const handleChangeCreateEvent = (event) => {
    const { name, value } = event.target;
    setCreateEvent((prevInfo) => ({ ...prevInfo, [name]: value }));
  };
  const handleChangeCreateVoucher = (event) => {
    const { name, value } = event.target;
    setCreateVoucher((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const confirmCreateEvent = () => {
    eventService.createEvent(createEvent)
      .then(res => {
        console.log(res);
        if (res.data.edesc === "The end day cannot be less than the start day !!!") {
          toast.error("Ngày bắt đâu không được nhỏ hơn ngày kết thúc", {
            position: "top-right",
            autoClose: 1000
          })
          return;
        }
        toast.success("Tạo event thành công", {
          position: "top-right",
          autoClose: 1000
        })
        setShowModalCreateEven(false)
        getAllEvent()
        setCreateEvent({
          endDay: "",
          name: "",
          startDay: ""
        })
      }).catch(err => {
        toast.error("Tạo màu thất bại", {
          position: "top-right",
          autoClose: 1000
        })
      })
  };

  const confirmCreateVoucher = () => {
    eventService.createVoucher(createVoucher)
      .then(res => {
        toast.success("Tạo event thành công", {
          position: "top-right",
          autoClose: 1000
        })
        setShowModalCreateVoucher(false)
        getAllVoucher()
        setCreateVoucher({
          amount: "",
          discount: "",
          idEvent: "",
          minimumValue: "",
          name: ""
        })
      }).catch(err => {
        toast.error("Tạo màu thất bại", {
          position: "top-right",
          autoClose: 1000
        })
      })
  };

  const confirmDeleteEvent = (idEvent, nameEvent) => {
    if (idEvent) {
      confirmAlert({
        message:
          `Bạn có chắc chắn muốn xóa Sự Kiện :  ` + nameEvent + ` không ?`,
        buttons: [
          {
            label: "Trở lại",
            className: "stayPage",
          },
          {
            label: "Xác nhận",
            onClick: () => deleteEvent(idEvent),
            className: "leavePage",
          },
        ],
      });
    }
  };
  const deleteEvent = (idEvent) => {
    const json = {
      id_event: idEvent
    }
    eventService.deleteEvent(json)
      .then(res => {
        toast.success("Xóa sự kiện thành công", {
          position: "top-right",
          autoClose: 3000,
        });
        getAllEvent();
      })
      .catch(error => {
        toast.error("Xóa Sự kiện thất bại", {
          position: "top-right",
          autoClose: 3000,
        });
        console.log("Error load delete", error);
      })
  }

  const confirmDeleteVoucher = (idVoucher, nameVoucher) => {
    if (idVoucher) {
      confirmAlert({
        message:
          `Bạn có chắc chắn muốn xóa mã giám giá ` + nameVoucher + ` không ?`,
        buttons: [
          {
            label: "Trở lại",
            className: "stayPage",
          },
          {
            label: "Xác nhận",
            onClick: () => deleteVoucher(idVoucher),
            className: "leavePage",
          },
        ],
      });
    }
  };
  const deleteVoucher = (idVoucher) => {
    const json = {
      id: idVoucher
    }
    eventService.deleteVoucher(json)
      .then(res => {
        toast.success("Xóa mã giảm giá thành công", {
          position: "top-right",
          autoClose: 3000,
        });
        getAllVoucher();
      })
      .catch(error => {
        toast.error("Xóa danh mục thất bại", {
          position: "top-right",
          autoClose: 3000,
        });
        console.log("Error load delete", error);
      })
  }

  const handleInputEventChange = (field, value) => {
    const nullValue = value === 'null' ? null : value;
    setEventSearch((prevSearch) => ({
      ...prevSearch,
      [field]: nullValue,
    }));
  };


  const handleInputVoucherChange = (field, value) => {
    const nullValue = value === 'null' ? null : value;
    setVoucherSearch((prevSearch) => ({
      ...prevSearch,
      [field]: nullValue,
    }));
  };

  return (
    <CContainer>
      <ToastContainer position="top-right"></ToastContainer>
      <CRow>
        <CCol md="5">
          <div class="nav">
            <CForm class="row g-3">
              {isAdmin && (
                <CCol xs="auto">
                  <CFormLabel htmlFor="staticEmail2" >
                    <Button className="btn-loading"
                      onClick={handleAddEvent}
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
                  placeholder="Tìm kiếm tên Sự Kiện"
                  onChange={(e) => handleInputEventChange('name', e.target.value)}

                />
              </CCol>
            </CForm>
          </div>
          <CCard >
            <CCardBody>
              <h3>Event</h3>
              <CTable bordered hover >
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên</th>
                    <th>Ngày bắt đầu</th>
                    <th>Ngày kết thúc</th>
                    {isAdmin && (
                      <th>Hành động</th>
                    )}

                  </tr>
                </thead>
                <tbody>
                  {event.map((event, index) => (
                    <tr key={index}>
                      <td> {currentPage < 2
                        ? index + 1
                        : index + 1 + (currentPage - 1) * 10}
                      </td>
                      <td>{event.name}</td>
                      <td>{event.startDay}</td>
                      <td>{event.endDay}</td>
                      {isAdmin && (
                        <td>
                          <CRow>
                            <BsTrash onClick={() => confirmDeleteEvent(event.id_event, event.name)}></BsTrash>
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
                onChange={handlePageChangeEvent}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md="7">
          <div class="nav">
            <CForm class="row g-3">
              <CCol xs="auto">
                <CFormLabel htmlFor="staticEmail2" >
                  {isAdmin && (
                    <Button className="btn-loading"
                      onClick={handleAddVoucher}
                    >
                      Thêm mới
                    </Button>
                  )}
                </CFormLabel>
              </CCol>
              <CCol xs="auto">
                <CFormInput
                  type="text"
                  id="name"
                  placeholder="Tìm kiếm tên voucher"
                  onChange={(e) => handleInputVoucherChange('name', e.target.value)}
                />
              </CCol>
            </CForm>
          </div>
          <CCard>
            <CCardBody>
              <h3>Voucher</h3>
              <CTable striped bordered hover >
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã giảm giá</th>
                    <th>Tên mã gg</th>
                    <th>Số lượng </th>
                    <th>Số tiền giảm</th>
                    <th>Giá trị đơn hàng tối thiểu</th>
                    <th>Sự kiện</th>
                    {isAdmin && (
                      <th style={{ width: "10%" }}>Actions</th>
                    )}

                  </tr>
                </thead>
                <tbody>
                  {voucher.map((voucher, index) => (
                    <tr key={index}>
                      <td> {currentPage < 2
                        ? index + 1
                        : index + 1 + (currentPage - 1) * 10}
                      </td>
                      <td>{voucher.id}</td>

                      <td>{voucher.name}</td>
                      <td>{voucher.amount}</td>
                      <td>{voucher.discount}</td>
                      <td>{voucher.minimumValue}</td>
                      <td>{voucher.eventEntity.name}</td>
                      {isAdmin && (
                        <td>
                          <CRow>
                            <BsTrash onClick={() => confirmDeleteVoucher(voucher.id, voucher.name)}></BsTrash>
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

      <Modal show={showModalCreateEven} onHide={cancelAddEvent} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thêm mới sự kiện</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CRow>
            <CCol md={12} className='mb-3'>
              <CFormInput
                label="Tên sự kiện"
                name="name"
                value={createEvent.name}
                onChange={handleChangeCreateEvent}
                placeholder="Nhập tên sự kiện"
              />
            </CCol>
            <CCol md={12} className='mb-3'>
              <CFormInput
                label="Ngày Bắt đầu"
                name="startDay"
                value={createEvent.startDay}
                onChange={handleChangeCreateEvent}
                placeholder="Nhập ngày bắt đầu"
              />
            </CCol>
            <CCol md={12} className='mb-3'>
              <CFormInput
                label="Ngày Kết thúc"
                name="endDay"
                value={createEvent.endDay}
                onChange={handleChangeCreateEvent}
                placeholder="Nhập ngày kết thúc"
              />
            </CCol>
          </CRow>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelAddEvent}>
            Hủy
          </Button>
          <Button variant="primary"
            onClick={confirmCreateEvent}
          >
            Thêm mới
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalCreateVoucher} onHide={cancelAddVoucher} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thêm mới mã giảm giá</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CRow>
            <CCol md={12}>
              <Form.Label>Event</Form.Label>
              <Form.Control
                as="select"
                name="idEvent"
                value={createVoucher.idEvent}
                onChange={handleChangeCreateVoucher}
              >
                {event.map((item) => (
                  <option key={item.id_event} value={item.id_event}>
                    {item.name}
                  </option>
                ))}
              </Form.Control>
            </CCol>
            <CCol md={12} className='mb-3'>
              <CFormInput
                label="Tên mã giảm giá"
                name="name"
                value={createVoucher.name}
                onChange={handleChangeCreateVoucher}
                placeholder="Tên giảm giá"
              />
            </CCol>
            <CCol md={12} className='mb-3'>
              <CFormInput
                label="Số tiền được giảm"
                name="amount"
                value={createVoucher.amount}
                onChange={handleChangeCreateVoucher}
                placeholder="Nhập số tiền"
              />
            </CCol>
            <CCol md={12} className='mb-3'>
              <CFormInput
                label="Số tiền giảm"
                name="discount"
                value={createVoucher.discount}
                onChange={handleChangeCreateVoucher}
                placeholder="Nhập số tiền giảm"
              />
            </CCol>
            <CCol md={12} className='mb-3'>
              <CFormInput
                label="Giá trị đơn hàng tối thiểu"
                name="minimumValue"
                value={createVoucher.minimumValue}
                onChange={handleChangeCreateVoucher}
                placeholder="Nhập giá trị đơn hàng tối thiểu"
              />
            </CCol>
          </CRow>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelAddVoucher}>
            Hủy
          </Button>
          <Button variant="primary"
            onClick={confirmCreateVoucher}
          >
            Thêm mới
          </Button>
        </Modal.Footer>
      </Modal>



    </CContainer>
  )
}

export default EvenComponent;