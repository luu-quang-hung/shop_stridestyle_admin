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
  CTable,
  CDropdown
} from '@coreui/react'
import { BsTrash, BsFillPencilFill } from "react-icons/bs";

import { Table, Pagination, Button, Modal, Form } from 'react-bootstrap';

const ProductComponent = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [productToUpdate, setProductToUpdate] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [productInfo, setProductInfo] = useState({
    trademark: '',
    name: '',
    description: '',
    price: '',
    size: '',
    color: '',
    image: '',
    quantity: '',
  });



  const [trademarks, setTrademark] = useState([]);

  useEffect(() => {
    getProductList();
  }, []);

  const getProductList = () => {
    UserService.getProduct()
      .then(res => {
        setProducts(res.data.data);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
      })
  }
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  // Xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // Xử lý xóa sản phẩm
  const handleDeleteProduct = (id) => {
    setProductIdToDelete(id);
    setShowModal(true);
  };

  // Xác nhận xóa sản phẩm
  const confirmDeleteProduct = () => {
    UserService.deleteProduct(productIdToDelete)
      .then(() => {
        // Product deleted successfully, reload the page to reflect the changes
        getProductList();
        setShowModal(false);
      })
      .catch((error) => {
        console.error('Error while deleting product:', error);
        // Handle errors if needed
        setShowModal(false);
      });

  };

  // Hủy xóa sản phẩm
  const cancelDeleteProduct = () => {
    setShowModal(false);
  };


  // Xử lý cập nhật sản phẩm
  const handleUpdateProduct = (product) => {
    setProductToUpdate(product);
    setShowUpdateModal(true);
  };

  const handleChangeUpdate = (event) => {
    const { name, value } = event.target;
    setProductToUpdate((prevInfo) => ({ ...prevInfo, [name]: value }));
  }

  // Xác nhận cập nhật sản phẩm
  const confirmUpdateProduct = () => {
    console.log(productToUpdate);
    UserService.updateProduct(productToUpdate)
    .then(res => {
      console.log(res);
      getProductList();
      setShowUpdateModal(false);
    })
    .catch((error) => {
      console.error('Error while update product:', error);
      // Handle errors if needed
      setShowUpdateModal(false);
    });
  };

  // Hủy cập nhật sản phẩm
  const cancelUpdateProduct = () => {
    setShowUpdateModal(false);
  };


  // Xử lý hiển thị Modal thêm mới
  const handleAddProduct = () => {
    getTradeMarkList();
    setShowAddModal(true);
  };


  //thêm mới trong modal
  const handleChange = (event) => {
    const { name, value, type } = event.target;

    // Special handling for file input
    if (type === 'file') {
      setProductInfo((prevInfo) => ({ ...prevInfo, [name]: event.target.files[0] }));
    } else {
      setProductInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('idTrademark.idTrademark', productInfo.trademark);
    formData.append('name', productInfo.name);
    formData.append('description', productInfo.description);
    formData.append('price', productInfo.price);
    formData.append('size', productInfo.size);
    formData.append('color', productInfo.color);
    formData.append('file', productInfo.image);
    formData.append('quantity', productInfo.quantity);
    // Reset the form after submission if needed

    try {
      // Send formData to the API using axios.post
      const response = UserService.createProduct(formData);
      console.log(response.data); // Log the response from the API if needed

      // Reset the form after successful submission
      setProductInfo({
        trademark: '',
        name: '',
        description: '',
        price: '',
        size: '',
        color: '',
        image: null,
        quantity: '',
      });
      setShowAddModal(false);
      alert("Thêm mới thành công")
      getProductList();

      // Call the confirmAddProduct function or perform any other actions after successful submission
    } catch (error) {
      console.error('Error while adding product:', error);
      // Handle errors if needed
    }

  };

  // Hủy thêm mới sản phẩm
  const cancelAddProduct = () => {
    setShowAddModal(false);
  };

  //list category
  const getTradeMarkList = () => {
    UserService.getTradeMark()
      .then(res => {
        setTrademark(res.data.data)
      })
      .catch(error => {
        console.log("Error load data Trademark", error);
      })
  }

  return (
    <div class="container">
      <div class="nav">
        <CForm class="row g-3">
          <CCol xs="auto">
            <CFormLabel htmlFor="staticEmail2" >
              <Button variant="outline-primary" className="btn-loading" onClick={handleAddProduct}>
                Thêm mới
              </Button>
            </CFormLabel>
          </CCol>
          <CCol xs="auto">
            <CFormInput type="text" id="nameProduct" placeholder="Tên sản phẩm" />
          </CCol>
          <CCol xs="auto">
            <CButton type="submit" className="mb-3">
              Tìm kiếm
            </CButton>
          </CCol>
        </CForm>
      </div>
      <div >
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Image</th>
              <th>Price</th>
              <th>Size</th>
              <th>Color</th>
              <th>Quantity</th>
              <th>Description</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product.id_product}>
                <td>{product.id_product}</td>
                <td>{product.name}</td>
                <td>
                  <img src={product.image} alt={product.name} style={{ maxWidth: '100px' }} />
                </td>
                <td>{product.price}</td>
                <td>{product.size}</td>
                <td>{product.color}</td>
                <td>{product.quantity}</td>
                <td>{product.description}</td>
                <td>
                  <Button variant="primary" onClick={() => handleUpdateProduct(product)}>
                    <BsFillPencilFill></BsFillPencilFill>
                  </Button>
                </td>
                <td>
                  <Button variant="danger" onClick={() => handleDeleteProduct(product.id_product)}>
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


        {/* Modal xác nhận xóa sản phẩm */}
        <Modal show={showModal} onHide={cancelDeleteProduct}>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa sản phẩm</Modal.Title>
          </Modal.Header>
          <Modal.Body>Bạn có chắc chắn muốn xóa sản phẩm này không?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancelDeleteProduct}>
              Hủy
            </Button>
            <Button variant="danger" onClick={confirmDeleteProduct}>
              Xóa
            </Button>
          </Modal.Footer>
        </Modal>


        {/* Modal cập nhật sản phẩm */}
        <Modal show={showUpdateModal} onHide={cancelUpdateProduct}>
          <Modal.Header closeButton>
            <Modal.Title>Cập nhật sản phẩm</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formId">
                <Form.Label>ID</Form.Label>
                <Form.Control
                  type="text"
                  name="idProduct"
                  placeholder="Enter ID"
                  onChange={handleChangeUpdate}
                  value={productToUpdate?.id_product || ''} disabled />
              </Form.Group>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  onChange={handleChangeUpdate}
                  value={productToUpdate?.name || ''} />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  rows={3}
                  placeholder="Enter description"
                  onChange={handleChangeUpdate}
                  value={productToUpdate.description}
                />
              </Form.Group>
              <Form.Group controlId="formPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="text"
                  name="price"
                  placeholder="Enter price"
                  onChange={handleChangeUpdate}
                  value={productToUpdate?.price || ''} />
              </Form.Group>
              <Form.Group controlId="formSize">
                <Form.Label>Size</Form.Label>
                <Form.Control
                  type="text"
                  name="size"
                  placeholder="Enter size"
                  onChange={handleChangeUpdate}
                  value={productToUpdate?.size || ''} />
              </Form.Group>
              <Form.Group controlId="formColor">
                <Form.Label>Color</Form.Label>
                <Form.Control
                  type="text"
                  name="color"
                  placeholder="Enter color"
                  onChange={handleChangeUpdate}
                  value={productToUpdate?.color || ''} />
              </Form.Group>
              <Form.Group controlId="formImage">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter image URL"
                  value={productToUpdate?.image || ''} disabled />
              </Form.Group>
              <Form.Group controlId="formQuantity">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="text"
                  name="quantity"
                  placeholder="Enter quantity"
                  onChange={handleChangeUpdate}
                  value={productToUpdate?.quantity || ''} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancelUpdateProduct}>
              Hủy
            </Button>
            <Button variant="primary" onClick={confirmUpdateProduct}>
              Lưu thay đổi
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal thêm mới sản phẩm */}
        <Modal show={showAddModal} onHide={cancelAddProduct}>
          <Modal.Header closeButton>
            <Modal.Title>Thêm mới sản phẩm</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formTrademark">
                <Form.Label>Trademark</Form.Label>
                <Form.Control
                  as="select"
                  name="trademark"
                  value={productInfo.trademark}
                  onChange={handleChange}
                >
                  <option value="">Select a trademark</option>
                  {trademarks.map((item) => (
                    <option key={item.idTrademark} value={item.idTrademark}>
                      {item.nameTrademark}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={productInfo.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                />              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter description"
                  name="description"
                  value={productInfo.description}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter price"
                  name="price"
                  value={productInfo.price}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formSize">
                <Form.Label>Size</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter size"
                  name="size"
                  value={productInfo.size}
                  onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="formColor">
                <Form.Label>Color</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter color"
                  name="color"
                  value={productInfo.color}
                  onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="formImage">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  placeholder="Chose image"
                  name="image"
                  onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="formQuantity">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter quantity"
                  name="quantity"
                  value={productInfo.quantity}
                  onChange={handleChange}
                />
              </Form.Group>
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
    </div>
  )
}
export default ProductComponent;
