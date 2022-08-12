import axios from "axios";
import to from "await-to-js";
import GenUtil from "../GenUtil";
import { queryPath } from "../util/queryPathGenerator";

const API_URL = "http://localhost:3001";

export default class BikeApi {
  static async getBikes(filter) {
    const qs = queryPath(filter);
    const headers = GenUtil.getHeaders();
    const [error, res] = await to(axios.get(`${API_URL}/bike?${qs}`, headers));
    return error ? [error, null] : [null, res.data];
  }

  static async deleteBike(id) {
    const headers = GenUtil.getHeaders();
    const [error, res] = await to(
      axios.delete(`${API_URL}/bike/${id}`, headers)
    );
    return error ? [error, null] : [null, res.data];
  }

  static async createBike(bike) {
    const headers = GenUtil.getHeaders();
    const [error, res] = await to(
      axios.post(`${API_URL}/bike/add`, bike, headers)
    );
    return error ? [error, null] : [null, res.data];
  }

  static async updateBike(bike) {
    const id = bike.id;
    const bikeData = bike;
    delete bikeData.id;
    const headers = GenUtil.getHeaders();
    const [error, res] = await to(
      axios.put(`${API_URL}/bike/${id}`, bikeData, headers)
    );
    return error ? [error, null] : [null, res.data];
  }

  static async getReservation(id) {
    const headers = GenUtil.getHeaders();
    const [error, res] = await to(
      axios.get(`${API_URL}/reservation/bike/${id}`, headers)
    );
    return error ? [error, null] : [null, res.data];
  }

  static async rateBike(id, user) {}
}
