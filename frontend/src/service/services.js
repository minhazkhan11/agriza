import axios from "axios";
import { toast } from "react-toastify";

const baseURL = process.env.REACT_APP_API_BASE_URL;

const axios_instance = axios.create({
  baseURL:baseURL
});

export async function getAllPin() {
  try {
    var response = await axios_instance.get(`/v1/admin/pin`); 
    return response;
  } catch (err) {
    console.error('Error in getRZPKey:', err);
  }
}


