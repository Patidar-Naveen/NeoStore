import React, { useEffect, useState } from 'react'
import { fetchOrderService } from '../config/MyProductService'
import jwtdecode from 'jwt-decode';
import { useNavigate } from "react-router";
import { Card } from 'react-bootstrap';
import Button from '@mui/material/Button';
function Order() {
    const navigate = useNavigate()
    const [state, setState] = useState([])

    useEffect(() => {
        // fetching previous orders by the help of user email
        if (localStorage.getItem('_token') != undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwtdecode(token)
            fetchOrderService({email:decode.email}).then(res => {
                setState([...res.data])
            })
        }
    }, [])

    return (
        <>
            <Card className="mt-5 ml-5" style={{backgroundColor:"#343a40", borderRadius: " 10px", boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px", fontFamily: "'Bree Serif', serif", width: "90%", maxHeight: '60vh', overflow: 'auto' }}>
                <Card.Body>
                    <Card.Title className="text-center text-white">
                        <h2>Privious Orders</h2>
                    </Card.Title>
                    {state.length != 0 ?
                    <Card.Text>
                            {state?.map((ele) =>
                                <div className='d-flex justify-content-between mt-2 p-2' key={ele._id} style={{backgroundColor: "white",alignItems:"center"}}>
                                    <div style={{}}>
                                        {ele.products.map(data =>
                                            <img key={data._id} src={`/images/${data.product_image}`} height='70px' width='70px' className="ml-3" alt="..." />
                                        )}
                                    </div>
                                    <div>
                                        <h5>ORDER BY:{ele.card_Holder_name}</h5>
                                        <h6> Total. {ele.totalAmount}</h6>
                                        <Button className="mt-2" variant="contained" color="success" onClick={() => navigate("/Invoice", { state: ele })}>Invoice</Button>
                                    </div>
                                </div>
                            )}    

                    </Card.Text>
                    :
                    <div className='d-flex justify-content-center' style={{marginTop:"5vh"}}>
                        <Button variant="contained" onClick={() => navigate('/cart')}>Order Now</Button>
                    </div>
}
                </Card.Body>
            </Card>
        </>
    )
}

export default Order