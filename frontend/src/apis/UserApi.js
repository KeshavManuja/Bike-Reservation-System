import axios from "axios";
import to from "await-to-js";
import GenUtil from "../GenUtil";

const API_URL = "http://localhost:3001";

export default class UserApi {
  static async signup({ email, password, name }) {
    const [error, res] = await to(
      axios.post(`${API_URL}/user/signup`, {
        email,
        password,
        name,
      })
    );
    return error ? [error, null] : [null, res.data];
  }

  static async login({ email, password }) {
    const [error, res] = await to(
      axios.post(`${API_URL}/user/login`, {
        email: email.toLowerCase(),
        password,
      })
    );
    return error ? [error, null] : [null, res.data];
  }

  static async createUser(user) {
    const headers = GenUtil.getHeaders();
    const [error, res] = await to(
      axios.post(`${API_URL}/user/add`, user, headers)
    );
    return error ? [error, null] : [null, res.data];
  }

  static async getUsers(page) {
    const headers = GenUtil.getHeaders();
    const [error, res] = await to(
      axios.get(`${API_URL}/user?${page}`, headers)
    );
    return error ? [error, null] : [null, res.data];
  }

  static async deleteUser(id) {
    const headers = GenUtil.getHeaders();
    const [error, res] = await to(
      axios.delete(`${API_URL}/user/${id}`, headers)
    );
    return error ? [error, null] : [null, res.data];
  }

  static async updateUser(user) {
    const { id,  ...userData } = user;
    const headers = GenUtil.getHeaders();
    const [error, res] = await to(
      axios.put(`${API_URL}/user/${id}`, userData, headers)
    );
    return error ? [error, null] : [null, res.data];
  }

  static async getReservation(id) {
    const headers = GenUtil.getHeaders();
    const [error, res] = await to(
      axios.get(`${API_URL}/reservation/user/${id}`, headers)
    );
    return error ? [error, null] : [null, res.data];
  }

  static async deleteReservation(id) {
    const headers = GenUtil.getHeaders();
    const [error, res] = await to(
      axios.patch(`${API_URL}/reservation/${id}`, {}, headers)
    );
    return error ? [error, null] : [null, res.data];
  }

  static async addRating(body) {
    const headers = GenUtil.getHeaders();
    const [error, res] = await to(
      axios.post(`${API_URL}/reservation/rating`, body, headers)
    );
    return error ? [error, null] : [null, res.data];
  }

  static async reserveBike(body) {
    const headers = GenUtil.getHeaders();
    const [error, res] = await to(
      axios.post(`${API_URL}/reservation/reservebike/`, body, headers)
    );
    return error ? [error, null] : [null, res.data];
  }
}
