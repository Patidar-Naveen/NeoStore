import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Navbaar from './Navbaar';
import { AiTwotoneDelete } from "react-icons/ai";
import { useDispatch } from 'react-redux'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { FiShoppingCart } from 'react-icons/fi';


function Cart() {
    const [state, setState] = useState([])
    const [count, setCount] = useState(0)
    const [subTotalState, setSubTotalState] = useState({ subTotal: 0, gst: 0, grandTotal: 0 })
    const cartStore = useSelector(state => state.cartReducer)
    const dispatch = useDispatch();
    const navigate = useNavigate()

    useEffect(() => {
        // checking there is data or not in cart
        if (localStorage.getItem('cart') != undefined) {
            let data = [...JSON.parse(localStorage.getItem('cart'))]
            setState([...data])
            totalAmount(data)
        }

        // using use effect after every time redux data will chnage 
    }, [cartStore.count, count])

    // incesing the product count by 1
    const countUp = (index) => {
        let data = state
        data[index].quantity += 1;
        localStorage.setItem('cart', JSON.stringify(data))
        setCount(count + 1)

    }
    // decresing the product count by 1
    const countDown = (index) => {
        let data = state
        if (data[index].quantity > 1) {
            data[index].quantity -= 1;
            localStorage.setItem('cart', JSON.stringify(data))
            setCount(count + 1)
        }
        else {
            dispatch({ type: "deleteInCart", payload: index })
        }
    }

    // calculation the total amount to dispaly on right side
    const totalAmount = (data) => {
        let totalValue = 0;
        data.forEach(ele => {
            totalValue = totalValue + (ele.quantity * ele.product_cost)
        })
        let gst = (totalValue * 5) / 100;
        setSubTotalState({ subTotal: totalValue, gst: gst, grandTotal: totalValue + gst })
    }


    return (
        <>
            <Navbaar />
            {state.length != 0 ?
                <div className='container-justify'>
                    <div className='row mt-5 ml-3 mr-3' style={{ minHeight: "70vh" }}>
                        <div className='col-lg-9 '>
                            <div class="container-fluid d-flex justify-content-between">
                                <h2 >Shopping Cart</h2>
                                <h4 >{state.length} items</h4>
                            </div>
                            <TableContainer component={Paper} style={{ boxShadow: `rgba(0, 0, 0, 0.24) 0px 3px 8px`, maxHeight: '60vh', overflow: 'auto' }}>
                                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                    <TableHead >
                                        <TableRow >
                                            <TableCell align="left">Products</TableCell>
                                            <TableCell align="center">Quantity</TableCell>
                                            <TableCell align="center">Price</TableCell>
                                            <TableCell align="center">Total</TableCell>
                                            <TableCell align="center">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody >
                                        {state.map((ele, index) => (
                                            <TableRow key={ele._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell component="th" scope="row" align="left"> <img src={`images/${ele.product_image}`} height='50px' width='50px' className='mr-1' />{ele.product_name}</TableCell>
                                                <TableCell align="center">
                                                    <button className='btn mr-1' onClick={() => countDown(index)}> - </button>
                                                    {ele.quantity}
                                                    <button className='btn ml-1' onClick={() => countUp(index)}>+</button>
                                                    </TableCell>
                                                <TableCell align="center">₹{ele.product_cost}</TableCell>
                                                <TableCell align="center">₹{ele.product_cost}</TableCell>
                                                <TableCell align="center"><Button variant="outlined" color="error" onClick={() => dispatch({ type: "deleteInCart", payload: index })}><AiTwotoneDelete /></Button></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </div>

                        <div className='col-lg-3 mt-5'>
                            <div className='container h-65 m-2 mt-4' style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', backgroundColor: 'white' }}>
                                <h4 className='mx-5 py-4'>Review Order</h4>
                                <table className='table'>
                                    <tbody>
                                        <tr>
                                            <td>Subtotal</td>
                                            <td>₹{subTotalState.subTotal}</td>
                                        </tr>
                                        <tr>
                                            <td>GST (5%)</td>
                                            <td>₹{subTotalState.gst}</td>
                                        </tr>
                                        <tr>
                                            <td>Order Total</td>
                                            <td>₹{subTotalState.grandTotal}</td>
                                        </tr>
                                        <tr>
                                            {localStorage.getItem('_token') != undefined ?
                                                <td colSpan='2'> <button className='w-100 mt-4 btn btn-primary' onClick={() => navigate("/checkout", { state: { subTotalState: subTotalState } })} >Proceed</button></td>
                                                :
                                                <td colSpan='2'> <button className='w-100 mt-4 btn btn-primary' onClick={() => navigate('/login')} >Proceed</button></td>
                                            }
                                        </tr>
                                    </tbody>
                                </table>

                            </div>
                        </div>


                    </div>

                </div>
                :
                <div className='text-center' style={{ minHeight: "80vh" }}>
                    <img src='../images/emptycart.gif' />
                    <h2>Your Cart Is empty</h2>
                    <Button variant="contained" onClick={() => navigate('/product')}>  <FiShoppingCart style={{ fontSize: "1.5rem" }} /> &nbsp; Shop Now</Button>
                </div>
            }
            <Footer />

        </>
    )
}

export default Cart