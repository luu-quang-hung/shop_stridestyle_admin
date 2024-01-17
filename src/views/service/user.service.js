import axios, { Axios } from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/customer-manager/';
const API_URL_ACCOUNT = "http://localhost:8080/account-manager/"
class UserService {
 
  //order
  getOrderList(){
    return axios.get(API_URL+ 'order/findAll',{headers: authHeader() });

  }


  //Customer
  getCustomer(json){
    return axios.post(API_URL+ 'find-all',json,{headers: authHeader() });
  }

  updateCustomer(json){
    return axios.post(API_URL+ 'update',json,{headers: authHeader() });
  }

  createStaff(json) {
    return axios.post(API_URL_ACCOUNT + 'save-staff',json, { headers: authHeader() });
  }

  deleteCustomer(json) {
    return axios.post(API_URL + 'delete',json, { headers: authHeader() });
  }


}

export default new UserService();
