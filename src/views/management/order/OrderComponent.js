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
import { BsTrash, BsFillPencilFill,BsTicketDetailed } from "react-icons/bs";

import { Table, Pagination, Button, Modal, Form } from 'react-bootstrap';

const OrderComponent = () =>{

    const [order, setOrder] = useState([]);
    const [orderDetail,setOrderDetail] = useState([]);
    const [showModalOrderDetail,setShowModalOrderDetail] = useState(false)
    useEffect(() => {
      getOrderList();
    }, []);

    const getOrderList = () => {
      UserService.getOrderList()
        .then(res => {
          setOrder(res.data.data);
        })
        .catch(err => {
          console.error('Error fetching order:', err);
        })
    }


    const [currentPage, setCurrentPage] = useState(1);
    const orderPerPage = 7;
    const indexOfLastProduct = currentPage * orderPerPage;
    const indexOfFirstProduct = indexOfLastProduct - orderPerPage;
    const currentOrder = order.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(order.length / orderPerPage);

    // Xử lý chuyển trang
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    const handleOrderDetail = (orderDetail) =>{
      setOrderDetail(orderDetail);
      console.log(orderDetail)
      setShowModalOrderDetail(true)
    }

    const cancelOrderDetail = ()=>{
      setShowModalOrderDetail(false);
    }

    return(
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
              <th>Id</th>
              <th>Phone number</th>
              <th>Email</th>
              <th>Address</th>
              <th>Payment Method</th>
              <th>Order Date</th>
              <th>Total Quantity</th>
              <th>Total Amount</th>
              <th>Zip Code</th>
              <th>Name Customer</th>
              <th>Detail</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {currentOrder.map((orders) => (
              <tr key={orders.id}>
                <td>{orders.id}</td>
                <td>{orders.phoneNumber}</td>
                <td>{orders.email}</td>
                <td>{orders.address}</td>
                <td>{orders.paymentMethod}</td>
                <td>{orders.orderDate}</td>
                <td>{orders.orderDetailId.sumQuantity}</td>
                <td>{orders.totalAmount}</td>
                <td>{orders.zipCode}</td>
                <td>{orders.customer.nameCustomer}</td>
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
        <Pagination>
          {Array.from({ length: totalPages }).map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>


      <Modal show={showModalOrderDetail} onHide={cancelOrderDetail}>
          <Modal.Header closeButton>
            <Modal.Title>Cập nhật sản phẩm</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Table striped bordered hover responsive>
  <thead>
    <tr>
      <th>ID</th>
      <th>Sum Quantity</th>
      <th>Name</th>
      <th>Price</th>
    </tr>
  </thead>
  <tbody>
    {orderDetail.map((order) => (
      <tr key={order.id}>
        <td>{order.id}</td>
        <td>{order.quantity}</td>
        {order.productId.length > 0 ? (
          <>
            <td>{order.productId[0].name}</td>
            <td>{order.productId[0].price}</td>
          </>
        ) : (
          <>
            <td>Khong co sp</td>
            <td>Khong co sp</td>
          </>
        )}
      </tr>
    ))}
  </tbody>
</Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancelOrderDetail}>
              Hủy
            </Button>
          </Modal.Footer>
        </Modal>

    </div>
    )
}

export default OrderComponent;
