import React, { useEffect, useState, useCallback } from 'react'
import productService from 'src/views/service/product-service';
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
  CImage,
  CFormLabel,
  CTable,
  CDropdown,
  CRow,

} from '@coreui/react'
import { BsTrash, BsFillPencilFill, BsFillEyeFill } from "react-icons/bs";
import PaginationCustom from 'src/views/pagination/PaginationCustom';
import { Table, Pagination, Button, Modal, Form } from 'react-bootstrap';
import propertyService from 'src/views/service/property-service';
import { confirmAlert } from "react-confirm-alert"; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../css/product.css"
import CurrencyFormatter from 'src/common/CurrencyFormatter';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
const ProductComponent = () => {
  const navigate = new useNavigate();
  const format = new CurrencyFormatter();
  const [productCreate, setProductCreate] = useState({
    nameProduct: '',
    price: '',
    idSize: '',
    idProperties: '',
    idCategory: '',
    quantity: '',
    image: null, // Assuming image is a file, initializing it with null
    description: '',
    descriptionDetail: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [productInfo, setProductInfo] = useState([]);

  const [productSearch, setProductSearch] = useState({
    page: 0,
    size: 10,
    nameProduct: null,
    categoryName: null
  });
  const [productDetail, setProductDetail] = useState([])

  const [totalPages, setTotalPages] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);

  const [trademarks, setTrademark] = useState([]);
  const [size, setSize] = useState([]);
  const [property, setProperty] = useState([]);
  const [listImages, setListImages] = useState([]);
  const [errors, setErrors] = useState({});

  const [indexOfFirstItemDetails, setIndexOfFirstItemDetail] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);

  const [isSaveButtonVisible, setSaveButtonVisible] = useState(false); // Trạng thái hiển thị của nút "Lưu"

  useEffect(() => {
    getProductList();
  }, [productSearch.page]);

  const getProductList = () => {
    productService.findAllProduct(productSearch)
      .then(res => {
        setProductInfo(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(err => {
        if (err.response.status === 401) {
          navigate("/login")
        }
        console.error('Error fetching products:', err);

      })
  }

  const handlePageChange = (page) => {
    setProductSearch({ ...productSearch, page: page - 1 })
    setCurrentPage(page)
  };

  const showProductDetail = (idProduct) => {
    const json = {
      productId: idProduct,
      page: 0,
      size: 1000
    }
    productService.findListProductDetail(json)
      .then(res => {
        setProductDetail(res.data.data.content)
        console.log(res.data.data.content);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
      })
    setShowModal(true)
  }

  const [currentPageDetail, setCurrentPageDetail] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItemDetail = currentPageDetail * itemsPerPage;
  const indexOfFirstItemDetail = indexOfLastItemDetail - itemsPerPage;
  const currentItemsDetail = productDetail.slice(indexOfFirstItemDetail, indexOfLastItemDetail);

  const totalPagesDetail = Math.ceil(productDetail.length / itemsPerPage);

  const handlePageChangeDetail = (pageNumber) => {
    setCurrentPageDetail(pageNumber);
  };




  const handleInputChange = (field, value) => {
    const nullValue = value === 'null' ? null : value;
    setProductSearch((prevSearchBill) => ({
      ...prevSearchBill,
      [field]: nullValue,
    }));
  };

  const backPage = (idProduct, nameProduct) => {
    if (idProduct) {
      confirmAlert({
        message:
          `Bạn có chắc chắn muốn xóa sản phẩm ` + nameProduct + ` không ?`,
        buttons: [
          {
            label: "Trở lại",
            className: "stayPage",
          },
          {
            label: "Xác nhận",
            onClick: () => deleteProduct(idProduct),
            className: "leavePage",
          },
        ],
      });
    }
  };

  const deleteProduct = (idProduct) => {
    productService.deleteProduct(idProduct)
      .then(res => {
        toast.success("Xóa sản phẩm thành công", {
          position: "top-right",
          autoClose: 3000,
        });
        getProductList()
      })
      .catch(error => {
        console.log("Error load delete", error);
      })
  }

  //cập nhật

  const handleUpdateProduct = (product) => {
    setProductToUpdate(product);
    showProductDetail(product.id)
    setShowUpdateModal(true);
  };

  const cancelUpdateModal = () => {
    setShowUpdateModal(false);
  };



  const handleAddProduct = () => {
    getTradeMarkList();
    setShowAddModal(true);
  };

  const cancelAddProduct = () => {
    resetForm();
    setShowAddModal(false);
  };

  const getTradeMarkList = () => {
    const jsonPage = {
      page: 0,
      size: 1000
    }
    productService.findCategory()
      .then(res => {
        setTrademark(res.data)
      })
      .catch(error => {
        console.log("Error load data Trademark", error);
      })

    propertyService.findAllSize(jsonPage)
      .then(res => {
        console.log(res.data.content);
        setSize(res.data.content)
      })
      .catch(error => {
        console.log("Error load data Trademark", error);
      })
    propertyService.findAllProperty(jsonPage)
      .then(res => {
        console.log(res.data.content);
        setProperty(res.data.content)

      })
      .catch(error => {
        console.log("Error load data Trademark", error);
      })
  }

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    if (type === 'file') {
      const selectedFile = event.target.files[0];
      const imageURL = selectedFile ? URL.createObjectURL(selectedFile) : null;
      setProductCreate((prevInfo) => ({
        ...prevInfo,
        [name]: selectedFile,
        [`${name}Preview`]: imageURL,
      }));
    } else {
      setProductCreate((prevInfo) => ({ ...prevInfo, [name]: value }));
    }
  };

  const handleChangeUpdate = (event) => {
    const { name, value, type } = event.target;
    if (type === 'file') {
      const selectedFile = event.target.files[0];
      const imageURL = selectedFile ? URL.createObjectURL(selectedFile) : null;
      setProductToUpdate((prevInfo) => ({
        ...prevInfo,
        [name]: selectedFile,
        [`${name}Preview`]: imageURL,
      }));
    } else {
      setProductToUpdate((prevInfo) => ({ ...prevInfo, [name]: value }));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const formData = new FormData();
      for (const key in productCreate) {
        formData.append(key, productCreate[key]);
      }
      productService.createProduct(formData)
        .then((res) => {
          toast.success("Tạo sản phẩm thành công", {
            position: "top-right",
            autoClose: 1000
          })
          getProductList();
          resetForm();
          setShowAddModal(false);
        }).catch(err => {
          toast.error("Tạo sản phẩm thất bại", {
            position: "top-right",
            autoClose: 1000
          })

          console.log(err);
        })
    }
  };

  const handleSubmitUpdate = () => {
    console.log(productToUpdate);
    // if (validateFormUpdate()) {
    const formData = new FormData();
    for (const key in productToUpdate) {
      if (key !== 'categoryEntity') {
        if (key === 'image' && typeof productToUpdate[key] === 'string') {
          // Convert string image path to File object and append to FormData
          // const file = new File([], productToUpdate[key]);
          // formData.append(key, file);
        } else {
          formData.append(key, productToUpdate[key]);
        }
      }
    }
    productService.createProduct(formData)
      .then((res) => {
        console.log(res);
        toast.success("Cập nhật sản phẩm thành công", {
          position: "top-right",
          autoClose: 1000
        })
        getProductList();
        setShowUpdateModal(false);
      }).catch(err => {
        toast.error("Cập nhật sản phẩm thất bại", {
          position: "top-right",
          autoClose: 1000
        })
        console.log(err);
      })
    // }
  };



  const handleImageUpload = async (formData) => {
    console.log(formData);
  };

  const handleImageChange = useCallback((event) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < Math.min(files.length, 6); i++) {
        formData.append('images', files[i]);
      }

      listImages.forEach((imageUrl, index) => {
        formData.append(`oldImage${index + 1}`, imageUrl);
      });

      handleImageUpload(formData);

      setListImages((prevImages) => [
        ...prevImages,
        ...Array.from(files).map(file => URL.createObjectURL(file)),
      ]);
    }
  }, [handleImageUpload, listImages]);

  const resetForm = () => {
    setProductCreate({
      nameProduct: '',
      price: '',
      idSize: '',
      idProperties: '',
      idCategory: '',
      quantity: '',
      image: null,
      imagePreview: '',
      description: '',
      descriptionDetail: '',
    });
    setListImages([]);
    setErrors("");
  }

  const validateForm = () => {
    const newErrors = {};
    console.log(productCreate);

    if (!productCreate.nameProduct) {
      newErrors.nameProduct = 'Vui lòng nhập tên sản phẩm';
    }
    if (!productCreate.price) {
      newErrors.price = 'Vui lòng nhập đơn giá';
    } if (!productCreate.idSize === "") {
      newErrors.idSize = 'Vui lòng chọn kích thước';
    } if (productCreate.idProperties === "") {
      newErrors.idProperties = 'Vui lòng chọn màu sắc';
    } if (productCreate.idCategory === "") {
      newErrors.idCategory = 'Vui lòng chọn danh mục';
    } if (!productCreate.quantity) {
      newErrors.quantity = 'Vui lòng nhập số lượng';
    } if (!productCreate.imagePreview) {
      newErrors.imagePreview = 'Vui lòng chọn ảnh gốc';
    } if (listImages.length === 0) {
      newErrors.listImages = 'Vui lòng thêm ít nhất 1 ảnh phụ';
    } if (!productCreate.description) {
      newErrors.description = 'Vui lòng ghi mô tả';
    } if (!productCreate.descriptionDetail) {
      newErrors.descriptionDetail = 'Vui lòng ghi mô tả chi tiết';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validateFormUpdate = () => {
    const newErrors = {};

    if (!productToUpdate.nameProduct) {
      newErrors.nameProduct = 'Vui lòng nhập tên sản phẩm';
    }
    if (!productToUpdate.price) {
      newErrors.price = 'Vui lòng nhập đơn giá';
    } if (!productToUpdate.quantity) {
      newErrors.quantity = 'Vui lòng nhập số lượng';
    } if (!productToUpdate.imagePreview) {
      newErrors.imagePreview = 'Vui lòng chọn ảnh gốc';
    } if (listImages.length === 0) {
      newErrors.listImages = 'Vui lòng thêm ít nhất 1 ảnh phụ';
    } if (!productToUpdate.description) {
      newErrors.description = 'Vui lòng ghi mô tả';
    } if (!productToUpdate.descriptionDetail) {
      newErrors.descriptionDetail = 'Vui lòng ghi mô tả chi tiết';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };



  const startEditing = (index) => {
    setEditingIndex(index);
    setSaveButtonVisible(true);

  };

  const updateQuantityProduct = (productDetails) => {
    const json = {
      nameProperty: productDetails.idProperty.name,
      nameSize: productDetails.idSize.name,
      productId: productDetails.idProduct.id,
      quantity: productDetails.quantity
    }
    productService.updateQuantityProduct(json)
      .then((res) => {
        toast.success("Cập số lượng thành công", {
          position: "top-right",
          autoClose: 1000
        })
        setSaveButtonVisible(false);
        setEditingIndex(null)
      }).catch(err => {
        toast.error("Cập số lượng thất bại", {
          position: "top-right",
          autoClose: 1000
        })

        console.log(err);
      })
  }



  return (
    <div class="container">
      <ToastContainer position="top-right"></ToastContainer>
      <CRow>
        <CCol md={2}>
          <Button className="btn-loading" onClick={handleAddProduct}>
            Tạo mới
          </Button>
        </CCol>
        <CCol md={2}>
          <CFormInput
            type="text"
            id="nameProduct"
            placeholder="Tên sản phẩm"
            onChange={(e) => handleInputChange('nameProduct', e.target.value)}
          />
        </CCol>
        <CCol md={2} className="mb-3">
          <CFormInput
            type="text"
            id="categoryName"
            placeholder="Tên danh mục"
            onChange={(e) => handleInputChange('categoryName', e.target.value)}
          />
        </CCol>
        <CCol md={2}>
          <CButton type="submit" className="mb-3" onClick={getProductList}>
            Tìm Kiếm
          </CButton>
        </CCol>
      </CRow>
      <CCard>
        <CCardBody>
          <div >
            <CTable bordered hover responsive>
              <thead>
                <tr style={{ textAlign: "center" }}>
                  <th>STT</th>
                  <th>Tên sản phẩm</th>
                  <th>Ảnh</th>
                  <th>Giá tiền</th>
                  <th>Danh mục</th>
                  <th>Ngày tạo</th>
                  <th>Trạng thái</th>
                  <th>Mô tả</th>
                  <th>Mô tả chi tiết</th>
                  <th>Chức năng</th>
                </tr>
              </thead>
              <tbody>
                {productInfo.map((product, index) => (
                  <tr key={index}>
                    <td> {currentPage < 2
                      ? index + 1
                      : index + 1 + (currentPage - 1) * 10}
                    </td>
                    <td>{product.nameProduct}</td>
                    <td><CImage src={product.image} width={"70px"} height={"50px"}></CImage></td>
                    <td>{format.formatVND(product.price)}</td>
                    <td width={"100px"}>{product.categoryEntity.name}</td>
                    <td width={"100px"}>{product.date_create}</td>
                    <td>{product.status}</td>
                    <td className="truncate" title={product.description}>
                      {product.description}
                    </td>
                    <td className="truncate" title={product.descriptionDetail}>
                      {product.descriptionDetail}
                    </td>

                    <td>
                      <CRow>
                        <CCol md={4}>
                          <BsFillPencilFill onClick={() => handleUpdateProduct(product)}></BsFillPencilFill>
                        </CCol>
                        <CCol md={4}>
                          <BsTrash onClick={() => backPage(product.id, product.nameProduct)}></BsTrash>
                        </CCol>

                      </CRow>
                    </td>

                  </tr>
                ))}
              </tbody>
            </CTable>
            <br />
            <PaginationCustom
              currentPageP={currentPage}
              maxPageNumber={5}
              total={totalPages}
              onChange={handlePageChange}
            />



            <Modal show={showAddModal} onHide={cancelAddProduct}
              size="xl"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Thêm mới sản phẩm</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <CRow>
                    <CCol md={6}>
                      <Form.Group controlId="formName">
                        <Form.Label>Tên sản phẩm</Form.Label>
                        <Form.Control
                          type="text"
                          name="nameProduct"
                          value={productCreate.nameProduct}
                          onChange={handleChange}
                          placeholder="Nhập tên sản phẩm" />
                        {errors.nameProduct && <div className="error-message">{errors.nameProduct}</div>}
                      </Form.Group>
                    </CCol>
                    <CCol>
                      <Form.Group controlId="formPrice">
                        <Form.Label>Đơn giá</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nhập đơn giá"
                          name="price"
                          value={productCreate.price}
                          onChange={handleChange}
                        />
                        {errors.price && <div className="error-message">{errors.price}</div>}

                      </Form.Group>
                    </CCol>
                    <CCol md={6}>
                      <Form.Label>Kích thước</Form.Label>
                      <Form.Control
                        as="select"
                        name="idSize"
                        value={productCreate.idSize}
                        onChange={handleChange}
                      >
                        <option value={""}>Chọn kích thước</option>
                        {size.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                        {errors.idSize && <div className="error-message">{errors.idSize}</div>}
                      </Form.Control>

                    </CCol>
                    <CCol md={6}>
                      <Form.Label>Màu sắc</Form.Label>
                      <Form.Control
                        as="select"
                        name="idProperties"
                        value={productCreate.idProperties}
                        onChange={handleChange}
                      >
                        <option value={""}>Chọn màu sắc</option>
                        {property.map((item) => (
                          <option key={item.idProperty} value={item.idProperty}>
                            {item.name}
                          </option>
                        ))}
                        {errors.idProperties && <div className="error-message">{errors.idProperties}</div>}

                      </Form.Control>
                    </CCol>
                    <CCol md={6}>
                      <Form.Group controlId="formTrademark">
                        <Form.Label>Danh mục</Form.Label>
                        <Form.Control
                          as="select"
                          name="idCategory"
                          value={productCreate.idCategory}
                          onChange={handleChange}
                        >
                          <option value={""}>Chọn danh mục</option>
                          {trademarks.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.nameCategory}
                            </option>
                          ))}
                          {errors.idCategory && <div className="error-message">{errors.idCategory}</div>}

                        </Form.Control>
                      </Form.Group>
                    </CCol>
                    <CCol md={6}>
                      <Form.Group controlId="formQuantity">
                        <Form.Label>Số lượng</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nhập số lượng"
                          name="quantity"
                          value={productCreate.quantity}
                          onChange={handleChange}
                        />
                        {errors.quantity && <div className="error-message">{errors.quantity}</div>}
                      </Form.Group>
                    </CCol>
                    <CCol md={6}>
                      <Form.Group controlId="formImage">
                        <Form.Label>Ảnh chính</Form.Label>
                        <Form.Control
                          type="file"
                          placeholder="Chọn hình ảnh"
                          name="image"
                          onChange={handleChange} />
                        {errors.imagePreview && <div className="error-message">{errors.imagePreview}</div>}
                      </Form.Group>
                      <ImagePreviews imageURL={productCreate.imagePreview} />
                    </CCol>
                    <CCol md={6}>
                      <Form.Group controlId="formImage">
                        <Form.Label>Chọn nhiều hình ảnh</Form.Label>
                        <Form.Control
                          type="file"
                          placeholder="Chọn hình ảnh"
                          name="image"
                          onChange={handleImageChange}
                        />
                        {errors.listImages && <div className="error-message">{errors.listImages}</div>}
                      </Form.Group>
                      <ImagePreviewList imageURLs={listImages} />
                    </CCol>
                    <Form.Group controlId="formDescription">
                      <Form.Label >Mô tả</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter description"
                        name="description"
                        value={productCreate.description}
                        onChange={handleChange}
                      />
                      {errors.description && <div className="error-message">{errors.description}</div>}

                    </Form.Group>
                    <Form.Group controlId="formDescription">
                      <Form.Label>Mô tả chi tiết</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter description detail"
                        name="descriptionDetail"
                        value={productCreate.descriptionDetail}
                        onChange={handleChange}
                      />
                      {errors.descriptionDetail && <div className="error-message">{errors.descriptionDetail}</div>}

                    </Form.Group>
                  </CRow>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={cancelAddProduct}>
                  Hủy
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                  Thêm mới
                </Button>
              </Modal.Footer>
            </Modal>
          </div>

          <Modal show={showUpdateModal} onHide={cancelUpdateModal}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Sửa sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <CRow>
                  <CCol md={6}>
                    <Form.Group controlId="formName">
                      <Form.Label>Mã sản phẩm</Form.Label>
                      <Form.Control
                        type="text"
                        name="id"
                        value={productToUpdate.id}
                        onChange={handleChangeUpdate}
                        disabled
                        readOnly
                      />
                    </Form.Group>
                  </CCol>
                  <CCol md={6}>
                    <Form.Group controlId="formName">
                      <Form.Label>Tên sản phẩm</Form.Label>
                      <Form.Control
                        type="text"
                        name="nameProduct"
                        value={productToUpdate.nameProduct}
                        onChange={handleChangeUpdate}
                        placeholder="Nhập tên sản phẩm" />
                      {errors.nameProduct && <div className="error-message">{errors.nameProduct}</div>}
                    </Form.Group>
                  </CCol>
                  <CCol>
                    <Form.Group controlId="formPrice">
                      <Form.Label>Đơn giá</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nhập đơn giá"
                        name="price"
                        value={productToUpdate.price}
                        onChange={handleChangeUpdate}
                      />
                      {errors.price && <div className="error-message">{errors.price}</div>}

                    </Form.Group>
                  </CCol>

                  <CCol md={6}>
                    <Form.Group controlId="formQuantity">
                      <Form.Label>Trạng thái</Form.Label>
                      <Form.Control
                        type="text"
                        name="status"
                        value={productToUpdate.status}
                        onChange={handleChangeUpdate}
                      />
                    </Form.Group>
                  </CCol>

                  <CCol md={6}>
                    <Form.Group controlId="formImage">
                      <Form.Label>Ảnh chính</Form.Label>
                      <Form.Control
                        type="file"
                        placeholder="Chọn hình ảnh"
                        name="image"
                        onChange={handleChangeUpdate} />
                      {errors.imagePreview && <div className="error-message">{errors.imagePreview}</div>}
                    </Form.Group>
                    <ImagePreviews imageURL={productToUpdate.imagePreview ? productToUpdate.imagePreview : productToUpdate.image} />
                  </CCol>
                  {/* <CCol md={6}>
                    <Form.Group controlId="formImage">
                      <Form.Label>Chọn nhiều hình ảnh</Form.Label>
                      <Form.Control
                        type="file"
                        placeholder="Chọn hình ảnh"
                        name="image"
                        onChange={handleChangeUpdate}
                      />
                      {errors.listImages && <div className="error-message">{errors.listImages}</div>}
                    </Form.Group>
                    <ImagePreviewList imageURLs={listImages} />
                  </CCol> */}
                  <Form.Group controlId="formDescription">
                    <Form.Label >Mô tả</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter description"
                      name="description"
                      value={productToUpdate.description}
                      onChange={handleChangeUpdate}
                    />
                    {errors.description && <div className="error-message">{errors.description}</div>}

                  </Form.Group>
                  <Form.Group controlId="formDescription" className='mb-3'>
                    <Form.Label>Mô tả chi tiết</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter description detail"
                      name="descriptionDetail"
                      value={productToUpdate.descriptionDetail}
                      onChange={handleChangeUpdate}
                    />
                    {errors.descriptionDetail && <div className="error-message">{errors.descriptionDetail}</div>}

                  </Form.Group>
                  <Form.Group controlId="formDescription">
                    <Table bordered hover responsive>
                      <thead>
                        <tr style={{ textAlign: "center" }}>
                          <th>STT</th>
                          <th>Tên sản phẩm</th>
                          <th>Số lượng</th>
                          <th>Màu</th>
                          <th>Kích cỡ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productDetail.map((productDetails, index) => (
                          <tr key={index}>
                            <td>{indexOfFirstItemDetails + index + 1}</td>
                            <td>{productDetails.idProduct.nameProduct}</td>
                            <td>
                              {editingIndex === index ? (
                                <Form.Control
                                  type="number"
                                  style={{ width: "90px" }}
                                  value={productDetails.quantity}
                                  onChange={(e) => {
                                    const newQuantity = parseInt(e.target.value, 10);
                                    setProductDetail((prevData) =>
                                      prevData.map((prevItem, i) =>
                                        i === index ? { ...prevItem, quantity: newQuantity } : prevItem
                                      )
                                    );
                                  }}
                                />
                              ) : (
                                productDetails.quantity
                              )}
                            </td>
                            <td>{productDetails.idProperty.name}</td>
                            <td>{productDetails.idSize.name}</td>
                            <td>
                              {isSaveButtonVisible && editingIndex === index ? (
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => updateQuantityProduct(productDetails)}
                                >
                                  Lưu
                                </Button>
                              ) : (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => startEditing(index)}
                                >
                                  Sửa
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    <PaginationCustom
                      maxPageNumber={5}
                      total={totalPagesDetail}
                      perPage={itemsPerPage}
                      onChange={handlePageChangeDetail}
                      currentPageP={currentPageDetail}
                    />
                  </Form.Group>

                </CRow>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={cancelUpdateModal}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleSubmitUpdate}>
                Cập nhật
              </Button>
            </Modal.Footer>
          </Modal>
        </CCardBody>
      </CCard>

    </div >
  )
}
export default ProductComponent;

const ImagePreviews = ({ imageURL }) => (
  <div className="image-preview-container">
    {imageURL && <img src={imageURL} alt="Preview" className="image-preview" />}
  </div>
);

const ImagePreviewList = ({ imageURLs }) => (
  <Slider dots infinite slidesToShow={Math.min(3, imageURLs.length)} slidesToScroll={Math.min(3, imageURLs.length)} >
    {imageURLs.map((url, index) => (
      <div key={index} className="image-preview-container">
        <img src={url} alt={`Preview ${index + 1}`} className="image-preview" />
      </div>
    ))}
  </Slider>
);
