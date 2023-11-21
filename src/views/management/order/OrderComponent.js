import React, { useEffect, useState } from 'react'
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
import { BsTrash, BsFillPencilFill, BsTicketDetailed } from "react-icons/bs";
import billService from 'src/views/service/bill-service';
import { Table, Pagination, Button, Modal, Form } from 'react-bootstrap';

const OrderComponent = () => {

  const [searchBill, setSearchBill] = useState(
    {
      dateTo: null,
      email: null,
      page: 0,
      phone: null,
      size: 10,
      startDate: null,
      statusShipping: null
    }
  );
  const [listBill, setListBill] = useState([]);
  const [showModalOrderDetail, setShowModalOrderDetail] = useState(false)
  useEffect(() => {
    getOrderList();
  }, []);

  const getOrderList = () => {
    billService.findAllBill(searchBill)
      .then(res => {
        setListBill(res.data.data)
      })
      .catch(err => {
        console.error('Error fetching order:', err);
      })
  }


  return (
    <div class="container">
      <div class="nav">
        <CForm class="row g-3">
          <CCol xs="auto">
            <CFormInput type="text" id="nameProduct" placeholder="NumberPhone or Email" />
          </CCol>
          <CCol xs="auto">
          </CCol>
          <CCol xs="auto">
            <CFormInput type="text" id="nameProduct" placeholder="Date" />
          </CCol>
          <CCol xs="auto">
          </CCol>
          <CCol xs="auto">
            <CFormInput type="text" id="nameProduct" placeholder="Name customer" />
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
              <th>STT</th>
              <th>Trạng thái đơn hàng</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>Họ Và Tên</th>
              <th>Phương thức thanh toán</th>
              <th>Ngày đặt hàng</th>
              <th>Số tiền</th>
              <th>Giá giảm</th>
              <th>Tổng tiền</th>
              <th>Ghi chú</th>
              <th>Chi tiết</th>
              <th>Cập nhật</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {listBill.map((orders,index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{orders.statusShipping}</td>
                <td>{orders.sdt}</td>
                <td>{orders.customerEntity.email || ""}</td>
                <td>{orders.address}</td>
                <td>{orders.fullName}</td>
                <td>{orders.payment}</td>
                <td>{orders.createAt}</td>
                <td>{orders.total}</td>
                <td>{orders.discount || "Không giảm"}</td>
                <td>{orders.downTotal}</td>
                <td>{orders.note}</td>
                
                <td>
                  <Button variant="primary" onClick={() => handleOrderDetail(orders.orderDetailId.productOrderId)} >
                    <BsTicketDetailed></BsTicketDetailed>
                  </Button>
                </td>
                <td>
                  <Button variant="primary" >
                    <BsFillPencilFill></BsFillPencilFill>
                  </Button>
                </td>
                <td>
                  <Button variant="danger" >
                    <BsTrash></BsTrash>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {/* Phân trang */}

      </div>


    </div>
  )
}

export default OrderComponent;
