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
  CTable,
  CFormSelect,
  CFormTextarea
} from '@coreui/react'
import billService from 'src/views/service/bill-service';
import { Table, Pagination, Button, Modal, Form } from 'react-bootstrap';
import "../../css/orderdetail.css"
import PaginationCustom from 'src/views/pagination/PaginationCustom';
import CurrencyFormatter from 'src/common/CurrencyFormatter';
const OrderComponent = () => {
  const formatter = new CurrencyFormatter();
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
  const [orderDetail, setOrderDetail] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    getOrderList();
  }, [searchBill.page]);

  const getOrderList = () => {
    billService.findAllBill(searchBill)
      .then(res => {
        setListBill(res.data.data.content)
        setTotalPages(res.data.data.totalPages);
      })
      .catch(err => {
        console.error('Error fetching order:', err);
      })
  }

  const handlePageChange = (page) => {
    setSearchBill({ ...searchBill, page: page - 1 })
    setCurrentPage(page)
  };

  const cancelShowModal = () => {
    setShowModal(false);
  };

  const handleModal = (idBill) => {
    getBillById(idBill)
    setShowModal(true);
  };

  const getBillById = (idBill) => {
    billService.findByIdBill(idBill)
      .then(res => {
        console.log(res);
        setOrderDetail(res.data);
      })
      .catch(err => {
        console.error('Error fetching bill by id:', err);
      })
  }
  return (
    <div class="container">
      <CForm class="row g-3">
        <CCol xs="auto">
          <CFormInput type="text" id="nameProduct" placeholder="Số điện thoại" />
        </CCol>
        <CCol xs="auto">
        </CCol>
        <CCol xs="auto">
          <CFormInput type="text" id="nameProduct" placeholder="Khoảng ngày" />
        </CCol>
        <CCol xs="auto">
        </CCol>
        <CCol xs="auto">
          <CFormInput type="text" id="nameProduct" placeholder="Tên khách hàng" />
        </CCol>
        <CCol xs="auto">
          <CFormInput type="text" id="nameProduct" placeholder="Trạng thái " />
        </CCol>
        <CCol xs="auto">
          <CButton type="submit" className="mb-3">
            Tìm Kiếm
          </CButton>
        </CCol>
      </CForm>
      <CCard>
        <CCardBody>
          <div class="table">
            <Table bordered hover responsive>
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
                  <th>Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {listBill.map((orders, index) => (
                  <tr key={index} onClick={() => handleModal(orders.id)}>
                    <td> {currentPage < 2
                      ? index + 1
                      : index + 1 + (currentPage - 1) * 10}
                    </td>
                    <td>{orders.statusShipping}</td>
                    <td>{orders.sdt}</td>
                    <td>{orders.customerEntity.email || ""}</td>
                    <td>{orders.address}</td>
                    <td>{orders.fullName}</td>
                    <td>{orders.payment}</td>
                    <td>{orders.createAt}</td>
                    <td>{formatter.formatVND(orders.downTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {/* Phân trang */}
            <PaginationCustom
              currentPageP={currentPage}
              maxPageNumber={5}
              total={totalPages}
              onChange={handlePageChange}
            />
          </div>
        </CCardBody>
      </CCard>


      <Modal show={showModal} onHide={cancelShowModal}
        size="xl"
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CRow>
            <CCol md={12} className='mb-3'>
              <CCol md={3}>
                <CFormSelect
                  label="Trạng thái đơn hàng"
                  aria-label="Trạng thái"
                  options={[
                    { label: 'Chưa xác nhận', value: '0' },
                    { label: 'Đã xác nhận và đóng gói', value: '1' },
                    { label: 'Đã giao bên vận chuyển', value: '2' },
                    { label: 'Khách đã nhận hàng', value: '3' },
                    { label: 'Hủy', value: '5' }
                  ]}
                />
              </CCol>
            </CCol>
            <CCol md={3} className='mb-3'>
              <CFormInput className='inputDetail' label="Mã hóa đơn: " value={orderDetail.id || null} readOnly></CFormInput>
            </CCol>
            <CCol md={3} className='mb-3'>
              <CFormInput className='inputDetail' label="Phương thức thanh toán: " value={orderDetail.payment || null} readOnly></CFormInput>
            </CCol>
            <CCol md={3} className='mb-3'>
              <CFormInput className='inputDetail' label="Tên người nhận: " value={orderDetail.fullName || null} readOnly></CFormInput>
            </CCol>
            <CCol md={3} className='mb-3'>
              <CFormInput className='inputDetail' label="Số điện thoại: " value={orderDetail.sdt || null} readOnly></CFormInput>
            </CCol>
            <CCol md={3} className='mb-3'>
              <CFormInput className='inputDetail' label="Email: " value={orderDetail.customerEntity.email || null} readOnly></CFormInput>
            </CCol>
            <CCol md={3} className='mb-3'>
              <CFormInput className='inputDetail' label="Ngày tạo: " value={orderDetail.createAt || null} readOnly></CFormInput>
            </CCol>
            <CCol md={6} className='mb-3'>
              <CFormInput className='inputDetail' label="Địa chỉ: " value={orderDetail.address || null} readOnly></CFormInput>
            </CCol>
            <CCol md={3} className='mb-3'>
              <CFormInput className='inputDetail' label="Tổng tiền sản phẩm: " value={formatter.formatVND(orderDetail.total) || null} readOnly></CFormInput>
            </CCol>
            <CCol md={3} className='mb-3'>
              <CFormInput className='inputDetail' label="Phí giao hàng: " value={formatter.formatVND(orderDetail.transportFee) || null} readOnly></CFormInput>
            </CCol>
            <CCol md={3} className='mb-3'>
              <CFormInput
                className='inputDetail'
                label="Mã giảm giá: "
                value={formatter.formatVND(orderDetail.voucherEntities[0].amount) + "_" + orderDetail.voucherEntities[0].name || null}
                readOnly
              ></CFormInput>
            </CCol>
            <CCol md={3} className='mb-3'>
              <CFormInput className='inputDetail' label="Tổng tiền thực nhận: " value={formatter.formatVND(orderDetail.downTotal) || null} readOnly></CFormInput>
            </CCol>
            <CCol md={7} className='mb-3'>
              <CFormTextarea className='inputDetail' label="Ghi chú: " value={orderDetail.note || null} readOnly></CFormTextarea>
            </CCol>
          </CRow>
          <Table bordered hover responsive>
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th>STT</th>
                <th>Tên sản phẩm</th>
                <th>Màu</th>
                <th>Kích cỡ</th>
                <th>Số lượng sản phẩm</th>
                <th>Đơn giá</th>
              </tr>
            </thead>
            <tbody>
              {orderDetail.oderDetailEntities && orderDetail.oderDetailEntities.map((orders, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  {/* <td>{orders.productDetailEntities.idProduct.nameProduct}</td> */}
                  <td>{orders.productDetailEntities.idProperty.name}</td>
                  <td>{orders.productDetailEntities.idProperty.name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelShowModal}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default OrderComponent;
