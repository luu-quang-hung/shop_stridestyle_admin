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
  CFormTextarea,
  CCardText
} from '@coreui/react'
import billService from 'src/views/service/bill-service';
import { Table, Pagination, Button, Modal, Form } from 'react-bootstrap';
import "../../css/orderdetail.css"
import PaginationCustom from 'src/views/pagination/PaginationCustom';
import CurrencyFormatter from 'src/common/CurrencyFormatter';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactDatePicker from 'react-datepicker';
import { format, addDays } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import "react-datepicker/dist/react-datepicker.css";
const OrderComponent = () => {
  const formatter = new CurrencyFormatter();
  const [searchBill, setSearchBill] = useState(
    {
      email: null,
      page: 0,
      phone: null,
      size: 10,
      startDate: null,
      statusShipping: null,
      payment: null,
      fullName: null,
      salesStatus: null
    }
  );
  const [listBill, setListBill] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(orderDetail.statusShipping);
  const options = [
    { label: '⬇️ Chưa xác nhận 🙅', value: 'CHUA_XAC_NHAN', disabled: false },
    { label: '⬇️ Đã xác nhận và đóng gói ✅', value: 'DA_XAC_NHAN_VA_DONG_GOI', disabled: false },
    { label: '⬇️ Đã giao bên vận chuyển 🚚', value: 'DA_GIAO_BEN_VAN_CHUYEN', disabled: false },
    { label: '🆗 Khách đã nhận hàng 🤹', value: 'KHACH_DA_NHAN_HANG', disabled: false },
  ];

  const optionsSearch = [
    { label: 'Tất cả trạng thái ', value: 'null' },
    { label: 'Chưa xác nhận 🙅', value: 'CHUA_XAC_NHAN' },
    { label: 'Đã xác nhận và đóng gói ✅', value: 'DA_XAC_NHAN_VA_DONG_GOI' },
    { label: 'Đã giao bên vận chuyển 🚚', value: 'DA_GIAO_BEN_VAN_CHUYEN' },
    { label: 'Khách đã nhận hàng 🤹', value: 'KHACH_DA_NHAN_HANG' },
    { label: 'Hủy 🚫', value: 'HUY' }
  ];

  const optionSearchSale = [
    { label: 'Tất cả hình thức ', value: 'null' },
    { label: 'Bán tại quầy ', value: false },
    { label: 'Bán trực tuyến ', value: true },


  ]

  const payment = [
    { label: 'Tất cả phương thức ', value: 'null' },
    { label: 'COD', value: 1 },
    { label: 'VNPAY', value: 2 },
    { label: 'Banking', value: 2 },
  ];

  if (selectedStatus === 'CHUA_XAC_NHAN' || selectedStatus === 'HUY') {
    options.push({ label: 'Hủy 🚫', value: 'HUY', disabled: false });
  }

  const currentIndex = options.findIndex(option => option.value === selectedStatus);

  const updatedOptions = options.map((option, index) => ({
    ...option,
    disabled: index !== currentIndex && index !== currentIndex + 1
  }));


  useEffect(() => {
    getOrderList();
    setSelectedStatus(orderDetail.statusShipping);

  }, [searchBill.page, orderDetail.statusShipping]);

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

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    setSelectedStatus(newStatus);

    const json = {
      idBill: orderDetail.id,
      status: newStatus
    }
    billService.updateBill(json)
      .then(res => {
        toast.success("Cập nhật trạng thái đơn hàng thành công", {
          position: "top-right",
          autoClose: 1000
        })
      })
      .catch(err => {
        console.error('Error fetching:', err);
      })
  };

  const statusStyles = {
    'CHUA_XAC_NHAN': {
      backgroundColor: "#f7f6ad",
      borderRadius: "7px",
      textAlign: "center",
      color: "black",
      fontSize: "14px",
    },

    'DA_XAC_NHAN_VA_DONG_GOI': {
      backgroundColor: "#c688eb",
      borderRadius: "7px",
      textAlign: "center",
      color: "white",
      fontSize: "14px",
    },
    'DA_GIAO_BEN_VAN_CHUYEN': {
      backgroundColor: "#92b9e4",
      borderRadius: "7px",
      textAlign: "center",
      color: "white",
      fontSize: "14px",
    },
    'KHACH_DA_NHAN_HANG': {
      backgroundColor: "#19AD54",
      borderRadius: "7px",
      textAlign: "center",
      color: "white",
      fontSize: "14px",
    },
    'HUY': {
      backgroundColor: "#fe4a49",
      borderRadius: "7px",
      textAlign: "center",
      color: "white",
      fontSize: "14px",
    },
  };

  //search 
  const handleInputChange = (field, value) => {
    const nullValue = value === 'null' ? null : value;

    setSearchBill((prevSearchBill) => ({
      ...prevSearchBill,
      [field]: nullValue,
    }));
  };

  const handleDateChange = (date) => {
    console.log(date);
    setSearchBill((prevSearchBill) => ({
      ...prevSearchBill,
      startDate: date ? format(date, 'yyyy-MM-dd') : null,
    }));
  };
  return (
    <div class="container">
      <ToastContainer position="top-right"></ToastContainer>
      <CRow>
        <CCol md={2}>
          <CFormInput
            type="text"
            id="fullName"
            placeholder="Tên khách hàng"
            onChange={(e) => handleInputChange('fullName', e.target.value)}
          />
        </CCol>
        <CCol md={2}>
          <CFormInput
            type="text"
            id="phone"
            placeholder="Số điện thoại"
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </CCol>
        <CCol md={2}>
          <ReactDatePicker
            id="startDate"
            autoComplete='off'
            className='date-pick'
            placeholderText="Chọn ngày"
            selected={
              searchBill.startDate
                ? utcToZonedTime((new Date(searchBill.startDate)), 'UTC')
                : null
            }
            onChange={handleDateChange}
            showYearDropdown
            scrollableYearDropdown
            dateFormat="dd/MM/yyyy"
            isClearable
          />
        </CCol>
        <CCol md={2}>
          <CFormSelect
            type="text"
            id="payment"
            options={payment}
            onChange={(e) => handleInputChange('payment', e.target.value)}
          />
        </CCol>
        <CCol md={2}>
          <CFormSelect
            type="text"
            id="statusShipping"
            placeholder="Trạng thái"
            options={optionsSearch}
            onChange={(e) => handleInputChange('statusShipping', e.target.value)}
          />
        </CCol>
        <CCol md={2} className='mb-3'>
          <CFormSelect
            type="text"
            id="salesStatus"
            placeholder="Hình thức bán hàng"
            options={optionSearchSale}
            onChange={(e) => handleInputChange('salesStatus', e.target.value)}
          />
        </CCol>
        <CCol md={12} style={{textAlign:"end"}}>
          <CButton type="submit" className="mb-3" onClick={getOrderList}>
            Tìm Kiếm
          </CButton>
        </CCol>
      </CRow>
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
                    <td >
                      <CCardText style={statusStyles[orders.statusShipping]}>
                        {orders.statusShipping === 'CHUA_XAC_NHAN' && 'Chưa xác nhận'}
                        {orders.statusShipping === 'DA_XAC_NHAN_VA_DONG_GOI' && 'Đã xác nhận và đóng gói'}
                        {orders.statusShipping === 'DA_GIAO_BEN_VAN_CHUYEN' && 'Đã giao bên vận chuyển'}
                        {orders.statusShipping === 'KHACH_DA_NHAN_HANG' && 'Khách đã nhận hàng'}
                        {orders.statusShipping === 'HUY' && 'Hủy'}
                      </CCardText>

                    </td>
                    <td>{orders.sdt}</td>
                    <td>{orders.customerEntity.email || ""}</td>
                    <td>{orders.address}</td>
                    <td>{orders.fullName}</td>
                    <td>
                      {orders.payment === 0 && 'COD'}
                      {orders.payment === 1 && 'VNPAY'}
                      {orders.payment === 2 && 'Banking'}
                    </td>                    <td>{orders.createAt}</td>
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
              <CCol md={4}>
                <CFormSelect
                  style={{ fontWeight: "bold" }}
                  label="Trạng thái đơn hàng"
                  aria-label="Trạng thái"
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  options={updatedOptions}
                />
              </CCol>
            </CCol>
            <CCol md={3} className='mb-3'>
              <CFormInput className='inputDetail' label="Mã hóa đơn: " value={orderDetail.id || null} readOnly></CFormInput>
            </CCol>
            <CCol md={3} className='mb-3'>
              <CFormInput className='inputDetail' label="Phương thức thanh toán: "
                value={orderDetail.payment === 0 ? 'COD' :
                  orderDetail.payment === 1 ? 'VNPAY' :
                    orderDetail.payment === 2 ? 'Banking' :
                      'Unknown'} readOnly></CFormInput>
            </CCol>
            <CCol md={3} className='mb-3'>
              <CFormInput className='inputDetail' label="Tên người nhận: " value={orderDetail.fullName || null} readOnly></CFormInput>
            </CCol>
            <CCol md={3} className='mb-3'>
              <CFormInput className='inputDetail' label="Số điện thoại: " value={orderDetail.sdt || null} readOnly></CFormInput>
            </CCol>
            <CCol md={3} className='mb-3'>
              <CFormInput className='inputDetail' label="Email: " value={orderDetail.customerEntity && orderDetail.customerEntity.email || null} readOnly></CFormInput>
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
                value={
                  (orderDetail.voucherEntities &&
                    orderDetail.voucherEntities[0] &&
                    orderDetail.voucherEntities[0].amount &&
                    orderDetail.voucherEntities[0].name) ? (
                    formatter.formatVND(orderDetail.voucherEntities[0].amount) +
                    "_" +
                    orderDetail.voucherEntities[0].name
                  ) : "Không có"
                }
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
                  <td>{orders.productDetailEntities.idProduct.nameProduct || null}</td>
                  <td>{orders.productDetailEntities.idProperty.name || null}</td>
                  <td>{orders.productDetailEntities.idSize.name}</td>
                  <td>{orders.quantity_oder}</td>
                  <td>{formatter.formatVND(orders.productDetailEntities.idProduct.price)}</td>
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
