import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
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
    CFormTextarea
} from '@coreui/react'
import { BsTrash } from "react-icons/bs";
//Service import
import productService from 'src/views/service/product-service';
import { CardBody } from 'react-bootstrap';

const SaleCounterComponent = () => {
    const [searchOption, setSearchOption] = useState({
        query: null
    });
    const [productList, setProductList] = useState([]);
    const [productFilter, setProductFilter] = useState([])
    const [categoryList, setCategoryList] = useState([])
    const [showFilter, setShowFilter] = useState(false);
    const [invoice, setInvoice] = useState({
        totalPrice: 0,
        discount: 0,
        vat: '10%',
        payment: 0,
        description: null
    })
    useEffect(() => {
        getProductList()
    }, [])

    function getProductList() {
        productService.findAllProduct({ size: 100, page: 0 }).then((res) => {
            const data = res.data.content.map(el => {
                el.quantity = 1;
                el.total  = el.price * 1;
                el.count = 1;
                el.color = 'Đen';
                el.size = 40;
                return el;
            });
            setProductList(data);
        }).catch(() => { })
    }

    function filterProduct(e) {
        setProductFilter({ ...searchOption, query: e.target.value });
        let listProductFilter = productList.filter(el => el.nameProduct.toLowerCase().includes(e.target.value));
        if (!e.target.value) {
            setProductFilter([]);
            setShowFilter(false);
        }
        else {
            setProductFilter(listProductFilter);
            setShowFilter(true)
        };
    }

    function addCategory(item) {
        item.quantity = 1;
        setCategoryList([...categoryList, item]);
        toast.success("Thêm sản phẩm thành công!", {
            position: "top-right",
            autoClose: 1000
        });
        invoice.totalPrice += item.total;
        invoice.payment = invoice.totalPrice + invoice.totalPrice*0.1;
    }

    function quantityProduct(item, count, index) {
        categoryList[index].count = count;
        categoryList[index].total = parseInt(count) * item.price;
        invoice.totalPrice = categoryList.reduce((partialSum, item) => partialSum + item.total, 0);
        invoice.payment = invoice.totalPrice + invoice.totalPrice*0.1;
        setInvoice({...invoice});
        setCategoryList([...categoryList]);
    }

    function sizeProduct(item, size, index) {
        categoryList[index].size = size;
        setCategoryList([...categoryList]);
    }

    function colorProduct(item, color, index) {
        categoryList[index].color = color;
        setCategoryList([...categoryList]);
    }

    function showFilterProduct() {
        setShowFilter(!showFilter);
    }

    function formatterCurrency(price) {
        return price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
    }
    return (
        <>
            <ToastContainer position="top-right"></ToastContainer>
            <div className="container">
                <CRow>
                    <CCol md={9}>
                        <CCard>
                            <CCardBody>
                                <CRow>
                                    <CCol md={12} className='d-flex'>
                                        <CFormInput
                                            placeholder='Nhập sản phẩm tìm kiếm...'
                                            value={searchOption.query}
                                            onChange={(e) => filterProduct(e)}></CFormInput>
                                    </CCol>

                                    <CCol md={12} className='mt-4'>
                                        <CTable>
                                            <CTableHead color='light'>
                                                <CTableHeaderCell>STT</CTableHeaderCell>
                                                <CTableHeaderCell>Tên</CTableHeaderCell>
                                                <CTableHeaderCell>Kích cỡ</CTableHeaderCell>
                                                <CTableHeaderCell>Màu</CTableHeaderCell>
                                                <CTableHeaderCell>Số lượng</CTableHeaderCell>
                                                <CTableHeaderCell>Giá</CTableHeaderCell>
                                                <CTableHeaderCell>Tổng tiền</CTableHeaderCell>
                                            </CTableHead>

                                            <CTableBody>
                                                {
                                                    categoryList.map((item, index) => (
                                                        <CTableRow key={index} >
                                                            <CTableDataCell>{index + 1}</CTableDataCell>
                                                            <CTableDataCell>{item.nameProduct}</CTableDataCell>
                                                            <CTableDataCell><CFormInput type='number' min={1} defaultValue={item.size} value={item.size} onChange={(e) => sizeProduct(item, e.target.value, index)}></CFormInput></CTableDataCell>
                                                            <CTableDataCell><CFormInput type='text' min={1} defaultValue={item.color} value={item.color} onChange={(e) => colorProduct(item, e.target.value, index)}></CFormInput></CTableDataCell>
                                                            <CTableDataCell><CFormInput type='number' min={1} defaultValue={item.quantity} value={item.count} onChange={(e) => quantityProduct(item, e.target.value, index)}></CFormInput></CTableDataCell>
                                                            <CTableDataCell>{formatterCurrency(item.price)}</CTableDataCell>
                                                            <CTableDataCell>{formatterCurrency(item.total) || 0}</CTableDataCell>
                                                            <CTableDataCell><BsTrash color='red' style={{cursor: 'pointer'}}></BsTrash></CTableDataCell>
                                                        </CTableRow>
                                                    ))
                                                }
                                                
                                            </CTableBody>
                                        </CTable>

                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>

                    {/* invoice */}
                    <CCol md={3}>
                        <CCard>
                            <CCardBody>
                                <CTable>
                                    <CTableBody>
                                        <CTableRow>
                                            <CTableDataCell>Tổng tiền hàng:</CTableDataCell>
                                            <CTableDataCell>{formatterCurrency(invoice.totalPrice) || 0}</CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell>Giảm giá</CTableDataCell>
                                            <CTableDataCell>{invoice.discount}</CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell>VAT</CTableDataCell>
                                            <CTableDataCell>{invoice.vat}</CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell>Khách cần trả</CTableDataCell>
                                            <CTableDataCell>{formatterCurrency(invoice.payment)}</CTableDataCell>
                                        </CTableRow>
                                    </CTableBody>
                                </CTable>
                                <div className='description' style={{marginBottom: '20px'}}>
                                    <CFormTextarea label="Ghi chú" style={{width: '100vw !important'}}></CFormTextarea>
                                </div>
                                <div className='d-flex'>
                                    <CButton style={{marginLeft: 'auto', marginRight: '10px'}}>In</CButton>
                                    <CButton color='success'>Thanh toán</CButton>
                                </div>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
                <div style={{position: 'absolute', top: '27%', width: '70%'}}>
                    {
                        showFilter &&
                        <div style={{ marginTop: '10px' }}>
                            <CCard>
                                <CardBody>
                                    <CRow>
                                        <label style={{fontWeight: 'bold'}}>Danh mục sản phẩm</label>
                                        <CCol md={12} style={{ marginTop: '20px', maxHeight: '400px', overflowY: 'scroll', overflowX: 'hidden' }}>
                                            <CRow>
                                                {
                                                    productFilter.map((item, index) => (
                                                        <CCol md={4} style={{ cursor: 'pointer' }} onClick={() => addCategory(item)}>
                                                            <div style={{ backgroundColor: index % 2 == 0 ? '#3c4b64' : '#3c4b644d', marginBottom: '20px' }}>
                                                                <CRow>
                                                                    <CCol md={5}>
                                                                        <CImage src={item.image} width={80} height={100}></CImage>
                                                                    </CCol>
                                                                    <CCol md={7} style={{ padding: '5px' }}>
                                                                        <div className='name-product'>
                                                                            <label style={{ fontWeight: 'bold', color: 'white' }}>{item.nameProduct}</label>
                                                                        </div>
                                                                        <div className='price'>
                                                                            <span style={{ fontWeight: 'bold', color: '#c91010' }}>{formatterCurrency(item.price)}</span>
                                                                        </div>
                                                                    </CCol>
                                                                </CRow>
                                                            </div>
                                                        </CCol>
                                                    ))
                                                }
                                            </CRow>
                                        </CCol>
                                    </CRow>
                                </CardBody>
                            </CCard>
                        </div>
                    }
                </div>

            </div>
        </>
    )
}

export default SaleCounterComponent;