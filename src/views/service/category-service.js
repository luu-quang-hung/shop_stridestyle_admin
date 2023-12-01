import axios, { Axios } from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/category-manager/';


class CategoryService {
  findAllCategory(json) {
    return axios.post(API_URL + 'find-all', json, { headers: authHeader() });
  }

  findByIdCategory(categoryId) {
    return axios.get(API_URL + 'find-by-id/' + categoryId, { headers: authHeader() });
  }

  createCategory(json) {
    return axios.post(API_URL + 'create', json, { headers: authHeader() });
  }

  deleteCategory(json) {
    return axios.post(API_URL + 'delete', json, { headers: authHeader() });
  }

  updateCategory(json) {
    return axios.post(API_URL + 'update', json, { headers: authHeader() });

  }
}

export default new CategoryService();
