import axios from 'axios';
import { MAIN_URL } from './Url';

export function userRegService(data){
    return axios.post(`${MAIN_URL}posts/userRegService`,data)
}

export function userLogService(data){
    return axios.post(`${MAIN_URL}posts/userLogService`,data)
}

export function forgetPassService(data){
    return axios.post(`${MAIN_URL}posts/forgetPassService`,data)
} 

export function resetPassService(data){
    return axios.post(`${MAIN_URL}posts/resetPassService`,data)
} 

export function profileEditService(data){
    return axios.post(`${MAIN_URL}posts/profileEditService`,data)
} 

export function addAddressService(data){
    return axios.post(`${MAIN_URL}posts/addAddressService`,data)
} 

export function changePasswordService(data){
    return axios.post(`${MAIN_URL}posts/changePaswordService`,data)
} 

export function profilePicService(data){
    return axios.post(`${MAIN_URL}posts/profilePicService`,data)
}

export function cartSaveService(data){
    return axios.post(`${MAIN_URL}posts/cartSaveService`,data)
}

export function emailSubscribeService(data){
    return axios.post(`${MAIN_URL}posts/emailSubscribeService`,data)
}