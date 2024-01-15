import axios from "axios";
const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("userAdmin", JSON.stringify(response.data));
        }(error) => {
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("userAdmin");
  }

  register(username, email, password) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('userAdmin'));;
  }
}

export default new AuthService();
