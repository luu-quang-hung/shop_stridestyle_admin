import axios, { Axios } from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/bill-manager/';


class BillService {
  findAllBill(json) {
    return axios.post(API_URL + 'find-by-date-phone-email-status', json, { headers: authHeader() });
  }

}

export default new BillService();
