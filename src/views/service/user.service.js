import axios, { Axios } from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/ass/api/v1/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }


  //product
  getProduct() {
    return axios.get(API_URL + 'product/findAll', { headers: authHeader() });
  }
  createProduct(formData){
    return axios.post(API_URL + 'product/createProduct', formData,{ headers: authHeader() })
  }
  deleteProduct(productId){
    return axios.post(API_URL + 'product/delete/' + productId, {}, { headers: authHeader() });
  }
  updateProduct(jsonProduct){
    return axios.post(API_URL + 'product/update', jsonProduct,{ headers: authHeader() })
  }



  //trademark
  getTradeMark(){
    return axios.get(API_URL+ 'trademark/findAll',{headers: authHeader() });
  }

  createTrademark(TrademarkJson){
    return axios.post(API_URL + 'trademark/create', TrademarkJson,{ headers: authHeader() })

  }
  deleteTrademark(idTrademark){
    return axios.post(API_URL + 'trademark/delete/' + idTrademark, {}, { headers: authHeader() });

  }

  updateTrademark(jsonTradeMark){
    return axios.post(API_URL + 'trademark/update', jsonTradeMark, { headers: authHeader() });

  }


  //order
  getOrderList(){
    return axios.get(API_URL+ 'order/findAll',{headers: authHeader() });

  }


  //Customer
  getCustomer(){
    return axios.get(API_URL+ 'customer/findAll',{headers: authHeader() });

  }


}

export default new UserService();
