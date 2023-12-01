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
import eventService from 'src/views/service/event-service';

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

  useEffect(() => {
    getAllEvent();
    getAllVoucher();
  }, [eventSearch, voucherSearch]);

  const getAllEvent = () => {
    eventService.findAllEvent(eventSearch)
      .then(res => {
        setEvent(res.data.content)
        setTotalPagesSize(res.data.totalPages);
        console.log("Event ", res.data);
      })
      .catch(error => {
        console.log("Error load data event", error);
      })
  }

  const getAllVoucher = () => {
    eventService.findAllVoucher(eventSearch)
      .then(res => {
        setVoucher(res.data.content)
        setTotalPages(res.data.totalPages);
        console.log("size", res.data);
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
  return (
    <CContainer>
      <CRow>
        <CCol md="5">
        <div class="nav">
            <CForm class="row g-3">
              <CCol xs="auto">
                <CFormLabel htmlFor="staticEmail2" >
                  <Button className="btn-loading"  >
                    Thêm mới
                  </Button>
                </CFormLabel>
              </CCol>
              <CCol xs="auto">
                <CFormInput
                  type="text"
                  id="name"
                  placeholder="Tìm kiếm tên Sự Kiện"
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </CCol>
            </CForm>
          </div>
          <CCard >
            <CCardBody>
              <h3>Event</h3>
              <CTable striped bordered hover >
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Start Day</th>
                    <th>End Day</th>
                    <th style={{ width: "10%" }}>Actions</th>
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
                      <td>
                        <CRow>
                          <CCol md={4}>
                            <BsFillPencilFill></BsFillPencilFill>
                          </CCol>
                          <CCol md={4}>
                            <BsTrash ></BsTrash>
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
                  <Button className="btn-loading"  >
                    Thêm mới
                  </Button>
                </CFormLabel>
              </CCol>
              <CCol xs="auto">
                <CFormInput
                  type="text"
                  id="name"
                  placeholder="Tìm kiếm tên voucher"
                  onChange={(e) => handleInputChange('name', e.target.value)}
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
                    <th>No</th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Discount</th>
                    <th>Minimum Value</th>
                    <th>Event</th>
                    <th style={{ width: "10%" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {voucher.map((voucher, index) => (
                    <tr key={index}>
                      <td> {currentPage < 2
                        ? index + 1
                        : index + 1 + (currentPage - 1) * 10}
                      </td>
                      <td>{voucher.name}</td>
                      <td>{voucher.amount}</td>
                      <td>{voucher.discount}</td>
                      <td>{voucher.minimumValue}</td>
                      <td>{voucher.eventEntity.name}</td>

                      <td>
                        <CRow>
                          <CCol md={4}>
                            <BsFillPencilFill></BsFillPencilFill>
                          </CCol>
                          <CCol md={4}>
                            <BsTrash ></BsTrash>
                          </CCol>
                        </CRow>
                      </td>
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
    </CContainer>
  )
}

export default EvenComponent;