import axios from "axios";
import { API_ROOT } from "../../../config/api";

const api = axios.create({
    baseURL: `${API_ROOT}/song`,
    withCredentials: true
})

export async function getSong({mood}) {
   const res= await api.get(`/getsong?mood=${mood}`)
   return res.data
}
