import axios from 'axios'
const url = 'http://localhost:3001/persons'

const getAll = () => {
    return axios.get(url).then(response => response.data)
}

const create = (newPerson) => {
    return axios.post(url, newPerson).then(response => response.data)
}

const del = (id) => {
    return axios.delete(`${url}/${id}`)
}

const replace = (id, newData) => {
    return axios.put(`${url}/${id}`, newData).then(response => response.data)
}

export default {getAll, create, del, replace}