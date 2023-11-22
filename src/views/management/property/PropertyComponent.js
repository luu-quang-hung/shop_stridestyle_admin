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
import { BsTrash, BsFillPencilFill } from "react-icons/bs";;
import PaginationCustom from 'src/views/pagination/PaginationCustom';
import propertyService from 'src/views/service/property-service';

const PropertyComponent = () => {
  const [property, setProperty] = useState([]);
  const [propertySearch, setPropertySearch] = useState({
    page: 0,
    size: 10
  });
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [totalPagesSize, setTotalPagesSize] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(1);

  const [sizeProduct, setSizeProduct] = useState([]);
  const [sizeProductSearch, setSizeProductSearch] = useState({
    page: 0,
    size: 10
  });

  useEffect(() => {
    getAllProperty();
    getAllSizeProduct();
  }, [propertySearch, sizeProductSearch]);

  const getAllProperty = () => {
    propertyService.findAllProperty(propertySearch)
      .then(res => {
        setProperty(res.data.content)
        setTotalPagesSize(res.data.totalPages);
        console.log("Property ", res.data);
      })
      .catch(error => {
        console.log("Error load data property", error);
      })
  }

  const getAllSizeProduct = () => {
    propertyService.findAllSize(propertySearch)
      .then(res => {
        setSizeProduct(res.data.content)
        setTotalPages(res.data.totalPages);
        console.log("size", res.data);
      })
      .catch(error => {
        console.log("Error load data Size", error);
      })
  }

  const handlePageChangeProperty = (page) => {
    setPropertySearch({ ...propertySearch, page: page - 1 })
    setCurrentPage(page)
  };

  const handlePageChangeSize = (page) => {
    setSizeProductSearch({ ...sizeProductSearch, page: page - 1 })
    setCurrentPageSize(page)
  };

  return (
    <CContainer>
      <CRow>
        <CCol md="6">
          <CCard >
            <CCardBody>
              <h3>Property</h3>
              <CTable striped bordered hover >
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th style={{ width: "10%" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {property.map((property, index) => (
                    <tr key={index}>
                      <td> {currentPage < 2
                        ? index + 1
                        : index + 1 + (currentPage - 1) * 10}
                      </td>
                      <td>{property.name}</td>
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
                onChange={handlePageChangeProperty}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md="6">
          <CCard>
            <CCardBody>
              <h3>Size</h3>
              <CTable striped bordered hover >
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th style={{ width: "10%" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeProduct.map((size, index) => (
                    <tr key={index}>
                      <td> {currentPage < 2
                        ? index + 1
                        : index + 1 + (currentPage - 1) * 10}
                      </td>
                      <td>{size.name}</td>
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

export default PropertyComponent;