import axios, { Axios } from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/customer-manager/';

class UserService {
 
  //order
  getOrderList(){
    return axios.get(API_URL+ 'order/findAll',{headers: authHeader() });

  }


  //Customer
  getCustomer(json){
    return axios.post(API_URL+ 'find-all',json,{headers: authHeader() });

  }

}

export default new UserService();
