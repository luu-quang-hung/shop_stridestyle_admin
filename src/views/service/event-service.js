import axios, { Axios } from 'axios';
import authHeader from './auth-header';

const API_URL_EVENT = 'http://localhost:8080/event-manager/';
const API_URL_VOUCHER = 'http://localhost:8080/voucher-manager/';


class EventService {
  findAllEvent(json) {
    return axios.post(API_URL_EVENT + 'find-all', json, { headers: authHeader() });
  }

  findByIdEvent(eventId) {
    return axios.get(API_URL_EVENT + 'find-by-id/' + eventId, { headers: authHeader() });
  }

  findAllVoucher(json) {
    return axios.post(API_URL_VOUCHER + 'find-all', json, { headers: authHeader() });
  }

  findByIdVoucher(id) {
    return axios.get(API_URL_VOUCHER + 'find-by-id/' + id, { headers: authHeader() });
  }

  createProperty(json) {
    return axios.post(API_URL_EVENT + `create`, json, { headers: authHeader() });

  }

  createSize(json) {
    return axios.post(API_URL_VOUCHER + `create`, json, { headers: authHeader() });

  }

  updateProperty(json) {
    return axios.post(API_URL_EVENT + `update`, json, { headers: authHeader() });

  }

  updateSize(json) {
    return axios.post(API_URL_VOUCHER + `update`, json, { headers: authHeader() });
  }


  deleteProperty(json) {
    return axios.post(API_URL_EVENT + `delete`, json, { headers: authHeader() });

  }

  deleteSize(json) {
    return axios.post(API_URL_VOUCHER + `delete`, json, { headers: authHeader() });

  }


}

export default new EventService();
