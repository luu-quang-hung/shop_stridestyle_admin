import axios, { Axios } from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/bill-manager/';


class BillService {
  findAllBill(json) {
    return axios.post(API_URL + 'find-by-date-phone-email-status', json, { headers: authHeader() });
  }

  findByIdBill(idBill) {
    return axios.get(API_URL + `find-by-id_bill/` + idBill, { headers: authHeader() })
  }

  updateBill(json){
    return axios.post(API_URL + `confirm-bill-manager`,json, { headers: authHeader() })
  }

  createBill(payload) {
    return axios.post(API_URL + "create-bill-off", payload, {headers: authHeader()})
  }

  doanhThuDay(){
    return axios.get(API_URL + `revenue-for-current-month`, { headers: authHeader() })
  }
  countDay(){
    return axios.get(API_URL + `count-status-daylly`, { headers: authHeader() })
  }
}

export default new BillService();
