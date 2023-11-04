import axios, { Axios } from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/product/manager/';


class ProductService {
  findAllProduct(jsonProduct) {
    return axios.post(API_URL + 'find-all', jsonProduct, { headers: authHeader() });
  }

  findByIdProduct(productId) {
    return axios.get(API_URL + 'find-by-id/' + productId, { headers: authHeader() });
  }
}

export default new ProductService();