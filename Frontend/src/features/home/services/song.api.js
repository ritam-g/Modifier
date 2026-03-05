import axios from "axios";

const api=axios.create({
    baseURL:'https://modifier.onrender.com/api/song',
    withCredentials:true
})

export async function getSong({mood}) {
   const res= await api.get(`/getsong?mood=${mood}`)
   return res.data
}