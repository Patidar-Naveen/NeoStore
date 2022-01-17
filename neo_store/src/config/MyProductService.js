import axios from 'axios';
import { MAIN_URL } from './Url';

export function fetchProductService(){
    return axios.get(`${MAIN_URL}products/fetchProductService`)
} 
export function fetchProductDetailsService(id){
    return axios.get(`${MAIN_URL}products/fetchProductDetailsService${id}`)
} 
export function applyFilterService(data){
    return axios.post(`${MAIN_URL}products/applyFilterService`,data)
}
export function cartService(data){
    return axios.post(`${MAIN_URL}products/cartService`,data)
}
export function rateProductService(id,data){
    return axios.post(`${MAIN_URL}products/rateProductService${id}`,data)
}
export function placeOrderService(data){
    return axios.post(`${MAIN_URL}products/placeOrderService`,data)
}
export function fetchOrderService(data){
    return axios.post(`${MAIN_URL}products/fetchOrderService`,data)
}