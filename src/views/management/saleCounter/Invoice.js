import React, { useEffect, useLayoutEffect, useState } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCol,
    CFormInput,
    CImage,
    CTable,
    CRow,
    CTableHead,
    CTableHeaderCell,
    CTableBody,
    CTableRow,
    CTableDataCell,
    CFormTextarea,
    CFormSelect,
    CForm
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify';
import { useSearchParams } from "react-router-dom";
import billService from 'src/views/service/bill-service';
import moment from 'moment/moment';
import orderImage from '../../../../src/assets/images/order-confirm.jpg'
import CurrencyFormatter from 'src/common/CurrencyFormatter';
import { useNavigate } from "react-router-dom";
import { Print, NoPrint } from "react-easy-print";


const Invoice = () => {
    const formatter = new CurrencyFormatter();
    const [searchParams] = useSearchParams();
    const [bill, setBill] = useState({});
  
    const navigator = useNavigate();
    useEffect(() => {
        const id = searchParams.get("id");
        if (id) findById(id);
    }, [])
    function findById(id) {
        billService.findByIdBill(id).then((res) => {
            setBill(res.data);
        }).catch(() => {
           
         })
    }
    function printInvoice() {
        let content = document.getElementById("invoicePrint");
        let pri = document.getElementById("ifmcontentstoprint").contentWindow;
        pri.document.open();
        pri.document.write(content.innerHTML);
        pri.document.close();
        pri.focus();
        pri.print();
    }

    const getProductNamesJoined = () => {
        if (bill && bill.oderDetailEntities && bill.oderDetailEntities.length > 0) {
            return bill.oderDetailEntities.map(detail => {
                const productName = detail.productDetailEntities.idProduct.nameProduct;
                const productSize = detail.productDetailEntities.idSize.name;
                const productColor = detail.productDetailEntities.idProperty.name;
                const quantity = detail.quantity_oder;
                return `${productName} (Kích cỡ: ${productSize}, Màu Sắc: ${productColor}, Số Lượng: ${quantity})`;
            }).join('; ');
        }
        return '';
    };

    // Get the joined product names
    const productNamesJoined = getProductNamesJoined();
    console.log(productNamesJoined);
    return (
        <>
            <ToastContainer position="top-right"></ToastContainer>
            <NoPrint>
                <div className='container' style={{ width: '50%', margin: 'auto', textAlign: 'center' }}>
                    <CCard>
                        <CCardBody>
                            <Print>
                                <CRow>
                                    <CCol md={12}>
                                        <label style={{ fontWeight: 'bold', fontSize: '20px' }}>Đơn hàng đã được thanh toán thành công</label>
                                        <div className='time-order' style={{ fontSize: '13px', color: '#2c384aae' }}>Thời gian: {moment(new Date()).format("DD-MM-YYYY HH:MM")}</div>
                                        <CImage src={orderImage} width={200} height={200}></CImage>
                                    </CCol>
<CCol md={12} style={{ padding: '10px' }}>
                                        <CTable>
                                            <CTableBody>
                                                <CTableRow>
                                                    <CTableDataCell>Tên khách hàng</CTableDataCell>
                                                    <CTableDataCell style={{ fontWeight: 'bold' }}>{bill.fullName}</CTableDataCell>
                                                </CTableRow>
                                                <CTableRow>
                                                    <CTableDataCell>Địa chỉ </CTableDataCell>
                                                    <CTableDataCell style={{ fontWeight: 'bold' }}>{bill.address}</CTableDataCell>
                                                </CTableRow>
                                                <CTableRow>
                                                    <CTableDataCell>Số điện thoại </CTableDataCell>
                                                    <CTableDataCell style={{ fontWeight: 'bold' }}>{bill.sdt}</CTableDataCell>
                                                </CTableRow>
                                                <CTableRow>
                                                    <CTableDataCell>Sản phẩm:  </CTableDataCell>
                                                    <CTableDataCell style={{ fontWeight: 'bold' }}>{productNamesJoined}</CTableDataCell>
                                                </CTableRow>
                                                <CTableRow>
                                                    <CTableDataCell>Ghi chú </CTableDataCell>
                                                    <CTableDataCell style={{ fontWeight: 'bold' }}>{bill.note}</CTableDataCell>
                                                </CTableRow>
                                                <CTableRow>
                                                    <CTableDataCell>Số tiền thanh toán </CTableDataCell>
                                                    <CTableDataCell style={{ fontWeight: 'bold' }}>{formatter.formatVND(bill.downTotal)}</CTableDataCell>
                                                </CTableRow>
                                            </CTableBody>
                                        </CTable>
                                    </CCol>
                                </CRow>
                            </Print>
                            <CRow>
                                <CCol md={6} >
                                    <CButton color='secondary' style={{ width: '100%' }} onClick={() => window.print()}>In</CButton>
                                </CCol>
                                <CCol md={6}>
                                    <CButton color='success' style={{ width: '100%' }} onClick={() => navigator(-1)}>Quầy sản phẩm</CButton>
</CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                    <iframe id="ifmcontentstoprint" style={{ height: "0px", width: "0px", position: 'absolute' }}></iframe>
                </div>
            </NoPrint>
        </>
    )
}

export default Invoice;