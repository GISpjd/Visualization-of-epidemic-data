import axios from 'axios';

const server = axios.create({
    baseURL: "http://localhost:3333"
})

export const getApiList = () => {
    return server.get('/api/list').then(res => res.data)
}