import axios, { Axios } from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/ass/api/v1/';


class ProductService {
    getProduct(jsonProduct) {
        return axios.post(API_URL + 'product/findAll', jsonProduct,{ headers: authHeader() });
      }
}

export default new ProductService();
