import axios, { Axios } from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/product/manager/';
const API_URL_DETAIL = "http://localhost:8080/product-detail-manager/"

class ProductService {
  findAllProduct(jsonProduct) {
    return axios.post(API_URL + 'find-all', jsonProduct, { headers: authHeader() });
  }

  findByIdProduct(productId) {
    return axios.get(API_URL + 'find-by-id/' + productId, { headers: authHeader() });
  }

  deleteProduct(productId) {
    return axios.post(API_URL + 'delete/' + productId, {}, { headers: authHeader() });
  }

  createProduct(data) {
    return axios.post(API_URL + 'save', data, { headers: authHeader() });

  }
  findCategory() {
    return axios.get(API_URL + 'find-id-name-category', { headers: authHeader() });
  }

  findListProductDetail(json) {
    return axios.post(API_URL_DETAIL + 'find-list-product', json, { headers: authHeader() });
  }

}

export default new ProductService();
