import axios, { Axios } from 'axios';
import authHeader from './auth-header';

const API_URL_PROPERTY = 'http://localhost:8080/property-manager/';
const API_URL_SIZE = 'http://localhost:8080/size-manager/';


class PropertyService {
  findAllProperty(json) {
    return axios.post(API_URL_PROPERTY + 'find-all', json, { headers: authHeader() });
  }

  findByIdProperty(propertyId) {
    return axios.get(API_URL_PROPERTY + 'find-by-id/' + propertyId, { headers: authHeader() });
  }

  findAllSize(json) {
    return axios.post(API_URL_SIZE + 'find-all', json, { headers: authHeader() });
  }

  findByIdSize(id) {
    return axios.get(API_URL_SIZE + 'find-by-id/' + id, { headers: authHeader() });
  }
}

export default new PropertyService();
