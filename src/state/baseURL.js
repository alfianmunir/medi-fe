import axios from "axios";
export default axios.create({baseURL: process.env.BASEURL})
// export default axios.create({baseURL: 'http://localhost:8001/'})