import React, { useEffect, useLayoutEffect, useState } from 'react'
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
    CFormTextarea,
    CFormSelect,
    CForm,
    CCardHeader,
    CHeader
} from '@coreui/react'
import { BsTrash, BsX } from "react-icons/bs";
//Service import
import productService from 'src/views/service/product-service';
import billService from 'src/views/service/bill-service';
import propertyService from 'src/views/service/property-service';
import { useNavigate } from "react-router-dom";

const SaleCounterComponent = () => {
    const navigator = useNavigate();
    const [searchOption, setSearchOption] = useState({
        query: null
    });
    const [productList, setProductList] = useState([]);
    const [productFilter, setProductFilter] = useState([])
    const [categoryList, setCategoryList] = useState([])
    const [propertyList, setPropertyList] = useState([])
    const [sizeList, setSizeList] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [validated, setValidated] = useState(false);
    const [validPhone, setValidPhone] = useState(false);
    const [invoice, setInvoice] = useState({
        totalPrice: 0,
        discount: 0,
        vat: '1%',
        total: 0,
        note: null,
        phoneNumber: null,
        fullName: null,
        orderDetailRequests: [

        ]
    })

    useLayoutEffect(() => {
        getListSize();
        getProperty();
        getProductList();
    }, [])

    function getProductList() {
        productService.findAllProduct({ size: 100, page: 0 }).then((res) => {
            const data = res.data.content.map(el => {
                el.data = []
                el.quantity = 1;
                el.total = el.price * 1;
                el.color = 1;
                el.size = 1;
                return el;
            });
            const arr = [], categoryListF = []
            data.forEach(el => {
                if (arr.includes(el.categoryEntity.id)) return;
                arr.push(el.categoryEntity.id);
                categoryListF.push({
                    id: el.categoryEntity.id,
                    name: el.categoryEntity.name
                })
            });
            const dataByCategory = categoryListF.map(el => {
                return {
                    title: el.name,
                    data: data.filter(cate => cate.categoryEntity.id == el.id)
                }
            })
            setProductList(dataByCategory);
        }).catch(err => {
           
        })
    }

    function filterProduct(e) {
        setProductFilter({ ...searchOption, query: e.target.value });
        const data = [];
        productList.forEach(el => data.push(el))
        data.forEach(el => {
            el.dataFilter = el.data.filter(item => item.nameProduct.toLowerCase().includes(e.target.value));
        });
        if (!e.target.value) {
            setProductFilter([]);
            setShowFilter(false);
        }
        else {
            setProductFilter(data);
            setShowFilter(true)
        };
    }

    async function addCategory(item) {
        const product = categoryList.find(el => el.id == item.id && item.size == el.size && item.color == el.color);
        if (product) {
            return toast.error(`Sản phẩm ${item.nameProduct} đã được thêm, vui lòng chọn sản phẩm khác`, {
                position: 'top-right',
                autoClose: 1000
            })
        }
        const object = { ...item }
        object.quantity = 1;
        object.count = 1;
        await getQuantityProduct(object);
        toast.success("Thêm sản phẩm thành công!", {
            position: "top-right",
            autoClose: 1000
        });
        invoice.totalPrice += item.total;
        invoice.total = invoice.totalPrice + invoice.totalPrice * 0.1;
        setCategoryList([...categoryList, object]);
    }

    function quantityProduct(item, count, index) {
        if (item.inventory < count) {
            return toast.error(`Sản phẩm ${item.nameProduct} vượt quá số lượng`, {
                position: 'top-right',
                autoClose: 1000
            })
        }
        categoryList[index].count = count;
        categoryList[index].total = parseInt(count) * item.price;
        invoice.totalPrice = categoryList.reduce((partialSum, item) => partialSum + item.total, 0);
        invoice.total = invoice.totalPrice + invoice.totalPrice * 0.1;
        if (categoryList[index].inventoryCategory != 0) categoryList[index].inventoryCategory = item.inventory - count;
        setCategoryList([...categoryList]);
        setInvoice({ ...invoice });
    }

    function removeItem(index) {
        categoryList.splice(index, 1);
        setCategoryList([...categoryList]);
        invoice.totalPrice = categoryList.reduce((partialSum, item) => partialSum + item.total, 0);
        invoice.total = invoice.totalPrice + invoice.totalPrice * 0.1;
        setInvoice({ ...invoice });
    }

    function regexPhoneNumber(phone) {
        const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

        return phone.match(regexPhoneNumber) ? true : false;
    }
    function createBill(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation();
            setValidated(true);
            return;
        }
        setValidated(true);
        invoice.orderDetailRequests = categoryList.map(el => {
            let color = propertyList.find(pro => pro.value == el.color);
            let size = sizeList.find(col => col.value == el.size);
            return {
                productId: el.id,
                productName: el.nameProduct,
                property: color?.label,
                propertyId: color?.value,
                size: size?.label,
                sizeId: size?.value,
                quantity: el.count
            }
        })
        invoice.downTotal = invoice.total;
        billService.createBill(invoice).then((res) => {
            console.log(res);
            if (res.data.ecode === "420") {
                return toast.error("Số Lượng Sản Phẩm trên bill Lớn hơn số hàng tồn trong kho", {
                    position: "top-right",
                    autoClose: 1000
                });
            }
            toast.success("Thêm sản phẩm thành công!", {
                position: "top-right",
                autoClose: 1000
            });
            navigator(`/management/invoice?id=${res.data.data.id}`)
            return
        }).catch(() => {
            toast.error("Thêm sản phẩm không thành công!", {
                position: "top-right",
                autoClose: 1000
            });
        })
    }

    function getProperty() {
        return new Promise((resolve, reject) => {
            propertyService.findAllProperty({ page: 0, size: 100 }).then((res) => {
                const data = res.data.content.map(el => {
                    return {
                        label: el.name,
                        value: el.idProperty
                    }
                });
                setPropertyList(data);
                resolve(true)
            }).catch(() => { reject(false) })
        })
    }

    function getListSize() {
        return new Promise((resolve, reject) => {
            propertyService.findAllSize({ page: 0, size: 100 }).then((res) => {
                const data = res.data.content.map(el => {
                    return {
                        label: el.name,
                        value: el.id
                    }
                });
                setSizeList(data);
                resolve(true);
            }).catch(() => { reject(false) })
        })
    }

    function getQuantityProduct(item) {
        return new Promise((resolve, reject) => {
            const payload = {
                idProduct: item.id,
                idProperty: parseInt(item.color),
                idSize: parseInt(item.size)
            }
            productService.quantityProduct(payload).then((res) => {
                resolve(true);
                let quantity = res.data.data.quantity;
                item.inventory = quantity;
                item.inventoryCategory = quantity > 0 ? quantity - 1 : 0;
            }).catch(() => { reject(false) })
        })
    }
    function sizeProduct(item, size, index, indexProduct) {
        productFilter[indexProduct].dataFilter[index].size = size;
        setProductFilter([...productFilter])
    }

    function colorProduct(item, color, index, indexProduct) {
        productFilter[indexProduct].dataFilter[index].color = color;
        setProductFilter([...productFilter])
    }

    function showFilterProduct() {
        setShowFilter(!showFilter);
    }

    function formatterCurrency(price) {
        return price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
    }
    function handlePhoneNumber(e) {
        setInvoice({ ...invoice, phoneNumber: e.target.value });
        if (!regexPhoneNumber(e.target.value)) {
            setValidPhone(true);
            setValidated(false);
        } else {
            setValidPhone(false);
        }
    }

    const [amountGiven, setAmountGiven] = useState(0);
    const calculateChange = () => {
        return amountGiven - invoice.total; // Trừ đi tổng số tiền cần trả
    };

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
                                                <CTableHeaderCell>Size</CTableHeaderCell>
                                                <CTableHeaderCell>Màu</CTableHeaderCell>
                                                <CTableHeaderCell>Số lượng</CTableHeaderCell>
                                                <CTableHeaderCell>Tồn kho</CTableHeaderCell>
                                                <CTableHeaderCell>Giá</CTableHeaderCell>
                                                <CTableHeaderCell>Tổng tiền</CTableHeaderCell>
                                            </CTableHead>

                                            <CTableBody>
                                                {
                                                    categoryList.map((item, index) => (
                                                        <CTableRow key={index} >
                                                            <CTableDataCell>{index + 1}</CTableDataCell>
                                                            <CTableDataCell>{item.nameProduct}</CTableDataCell>
                                                            <CTableDataCell><CFormSelect disabled style={{ width: '70px' }} height={100} options={sizeList} defaultValue={item.size} value={item.size} ></CFormSelect></CTableDataCell>
                                                            <CTableDataCell><CFormSelect disabled style={{ width: '100px' }} height={100} options={propertyList} defaultValue={item.color} value={item.color} ></CFormSelect></CTableDataCell>
                                                            <CTableDataCell><CFormInput type='number' min={1} defaultValue={item.quantity} value={item.count} onChange={(e) => quantityProduct(item, e.target.value, index)}></CFormInput></CTableDataCell>
                                                            <CTableDataCell>
                                                                <CFormInput type='number' min={0} value={item.inventoryCategory}></CFormInput>
                                                            </CTableDataCell>
                                                            <CTableDataCell>{formatterCurrency(item.price)}</CTableDataCell>
                                                            <CTableDataCell>{formatterCurrency(item.total) || 0}</CTableDataCell>
                                                            <CTableDataCell><BsTrash color='red' style={{ cursor: 'pointer' }} onClick={() => removeItem(index)}></BsTrash></CTableDataCell>
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
                                <CForm className='needs-validation' onSubmit={createBill} noValidate validated={validated}>
                                    <label>Tên khách hàng</label>
                                    <CFormInput required feedbackInvalid="Tên khách hàng là trường bắt buộc" type='text' value={invoice.fullName} onChange={(e) => setInvoice({ ...invoice, fullName: e.target.value })}></CFormInput>

                                    <label className='mt-2'>Số điện thoại</label>
                                    <CFormInput invalid={validPhone} required feedbackInvalid="Số điện thoại không hợp lệ" type='number' className='' min={0} value={invoice.phoneNumber} onChange={(e) => handlePhoneNumber(e)}></CFormInput>
                                    <CTable className='mt-2'>
                                        <CTableBody>
                                        <CTableDataCell>Khách đưa:</CTableDataCell>

                                            <CTableDataCell>
                                                <CFormInput
                                                    type="number"
                                                    style={{ width: "120px" }}
                                                    value={amountGiven}
                                                    onChange={(e) => setAmountGiven(parseFloat(e.target.value))}
                                                />
                                            </CTableDataCell>
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
                                                <CTableDataCell>{formatterCurrency(invoice.total)}</CTableDataCell>
                                            </CTableRow>
                                            <CTableRow>
                                                <CTableDataCell>Tiền trả khách</CTableDataCell>
                                                <CTableDataCell>{formatterCurrency(calculateChange())|| 0} </CTableDataCell>
                                            </CTableRow>
                                        </CTableBody>
                                    </CTable>
                                    <div className='note' style={{ marginBottom: '20px' }}>
                                        <CFormTextarea label="Ghi chú" style={{ width: '100vw !important' }} value={invoice.note} onChange={(e) => setInvoice({ ...invoice, note: e.target.value })}></CFormTextarea>
                                    </div>
                                    <div className='d-flex'>
                                        <CButton disabled={categoryList.length == 0} color='success' style={{ color: '#fff', marginLeft: 'auto' }} type='submit'>Thanh toán</CButton>
                                    </div>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
                <div style={{ position: 'absolute', top: '27%', width: '70%' }}>
                    {
                        showFilter &&
                        <div style={{ marginTop: '10px' }}>
                            <CCard>
                                <CHeader>
                                    <BsX size={20} style={{ float: 'right', cursor: 'pointer', fontWeight: 'bold' }} onClick={showFilterProduct}></BsX>
                                </CHeader>
                                <CCardBody style={{ overflowY: 'scroll', overflowX: 'hidden', maxHeight: '400px' }}>
                                    {
                                        productFilter.map((el, indexProduct) => (
                                            <CRow key={indexProduct}>
                                                <label style={{ fontWeight: 'bold' }}>{el.dataFilter && el.dataFilter.length > 0 ? el.title : ''}</label>
                                                <CCol md={12} style={{ marginTop: '20px' }}>
                                                    <CRow>
                                                        {
                                                            el.dataFilter.map((item, index) => (
                                                                <CCol md={4} style={{ cursor: 'pointer' }}>
                                                                    <div style={{ backgroundColor: index % 2 == 0 ? '#3c4b64' : '#3c4b644d', marginBottom: '20px' }}>
                                                                        <CRow>
                                                                            <CCol md={5}>
                                                                                <CImage src={item.image} width={120} height={'100%'}></CImage>
                                                                            </CCol>
                                                                            <CCol md={7} style={{ padding: '5px', color: 'white' }}>
                                                                                <div className='name-product'>
                                                                                    <label style={{ fontWeight: 'bold', color: 'white' }}>{item.nameProduct}</label>
                                                                                </div>
                                                                                <div className='price'>
                                                                                    <span style={{ fontWeight: 'bold', color: '#c91010' }}>{formatterCurrency(item.price)}</span>
                                                                                </div>
                                                                                <CRow className='property'>
                                                                                    <CCol md={5}>
                                                                                        <CFormSelect label="Size" style={{ width: '70px' }} height={100} options={sizeList} onChange={(e) => sizeProduct(item, e.target.value, index, indexProduct)} defaultValue={sizeList[1].value} value={item.size} ></CFormSelect>
                                                                                    </CCol>
                                                                                    <CCol md={7}>
                                                                                        <CFormSelect label="Màu" style={{ width: '80px' }} options={propertyList} onChange={(e) => colorProduct(item, e.target.value, index, indexProduct)} defaultValue={propertyList[1].value || 0} value={item.color}></CFormSelect>
                                                                                    </CCol>
                                                                                </CRow>
                                                                                <CRow className='mt-2'>
                                                                                    <CCol>
                                                                                        <CButton style={{ width: '90%', margin: 'auto' }} color='danger' onClick={() => addCategory(item)}>Thêm</CButton>
                                                                                    </CCol>
                                                                                </CRow>
                                                                            </CCol>
                                                                        </CRow>
                                                                    </div>
                                                                </CCol>
                                                            ))
                                                        }
                                                    </CRow>
                                                </CCol>
                                            </CRow>
                                        ))
                                    }
                                </CCardBody>
                            </CCard>
                        </div>
                    }
                </div>

            </div>
        </>
    )
}

export default SaleCounterComponent;