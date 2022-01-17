import React, { useEffect, useState } from 'react'
import Footer from './Footer'
import Navbaar from './Navbaar'
import './check.css'
import jwtDecode from 'jwt-decode'
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch } from 'react-redux'
import { placeOrderService } from '../config/MyProductService'
import { cartSaveService } from '../config/Myservice'

export default function Checkout() {
    const [state, setState] = useState(null)
    const [value, setvalue] = useState(null)

    const location = useLocation();
    const navigate = useNavigate()
    const dispatch = useDispatch();


    useEffect(() => {
        if (localStorage.getItem('_token') != undefined) {
            let token = localStorage.getItem('_token')
            let decode = jwtDecode(token)
            setState({ ...decode })
        }
        else {
            navigate("/login")
        }
    }, [])

    // on submiting the all the card details 
    // will check the address and then proccedd further for place order
    const checkout = () => {
        let cardNo1 = document.getElementById('input1').value
        let cardNo2 = document.getElementById('input2').value
        let cardNo3 = document.getElementById('input3').value
        let cardNo4 = document.getElementById('input4').value
        let cardHolder = document.getElementById('nameHolder').value
        let cvv = document.getElementById('cvv').value
        let date = document.getElementById('date').value

        if (cardNo1.length == 4 && cardNo2.length == 4 && cardNo3.length == 4 && cardNo4.length == 4 && cardHolder != '' && cvv.length == 3 && date.length == 4 && value != null) {
            let formData = {
                user_email: state.email,
                card_Holder_name: cardHolder,
                totalAmount: location.state.subTotalState.subTotal,
                products: JSON.parse(localStorage.getItem('cart')),
                address: state.addresses[value],
            }
            console.log(formData, 'line 47')
            placeOrderService(formData)
                .then(res => {
                    cartSaveService({ data: [], email: state.email })
                        .then(res => {
                            localStorage.setItem('_token', res.data.token)
                        })
                    alert(res.data.msg)
                    localStorage.removeItem('cart')
                    dispatch({ type: "emptyCart", payload: 0 })
                    navigate('/')
                })
        }
        else {
            alert("Enter All feilds..  ")
        }
    }

    return (
        <div>
            {state != null ?
                <>
                    <Navbaar />
                    <Grid container spacing={2} minHeight={500}>
                        <Grid item xs={12} sm={12} md={7} >
                            <div className='d-flex justify-content-center' style={{ marginTop: '10vh' }}>
                                <div className="debit-card" style={{ width: '400px', height: '35vh' }}>
                                    <img src="https://image.ibb.co/gDVR4x/master_card_logo.png" width={50} />
                                    <div className="card-number-block">
                                        <input type="number" className="number-block cardno" placeholder="0000" id='input1' onChange={(e) => { e.target.value.length == 4 && document.getElementById('input2').focus() }} />
                                        <input type="number" className="number-block cardno" placeholder="0000" id='input2' onChange={(e) => { e.target.value.length == 4 && document.getElementById('input3').focus() }} />
                                        <input type="number" className="number-block cardno" placeholder="0000" id='input3' onChange={(e) => { e.target.value.length == 4 && document.getElementById('input4').focus() }} />
                                        <input type="number" className="number-block cardno" placeholder="0000" id='input4' onChange={(e) => { e.target.value.length == 4 && document.getElementById('nameHolder').focus() }} />
                                    </div>
                                    <div className='d-flex justify-content-between'>
                                        <div className="card-holder-block">
                                            <div className="block-lebel">Card Holder</div>
                                            <input type="text" pattern="[A-Z ]+" id='nameHolder' className="card-holder-name" placeholder="xxx xxx" />
                                        </div>
                                        <div className="card-holder-block" style={{ width: '50px' }}>
                                            <div className="block-lebel">Date</div>
                                            <input type="number" style={{ width: '50px' }} id='date' className="card-holder-name" placeholder="MMYY" onChange={(e) => { e.target.value.length == 4 && document.getElementById('cvv').focus() }} />
                                        </div>
                                        <div className="card-holder-block" style={{ width: '50px' }}>
                                            <div className="block-lebel">CVV</div>
                                            <input type="number" id='cvv' style={{ width: '50px' }} className="card-holder-name" placeholder="xxx" onChange={(e) => { e.target.value.length == 3 && document.getElementById('cvv').blur() }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={5}>
                            <div className='d-flex justify-content-center' style={{ height: "80vh", alignItems: 'center' }}>
                                <Card sx={{ minWidth: 400 }} className="shadow">
                                    <CardContent>
                                        <div >
                                            <h4 className='m-3' style={{ fontFamily: "'Roboto Slab', serif" }}>Summary</h4>
                                            <table className='table'>
                                                <tbody style={{ fontFamily: "'Roboto Slab', serif" }}>
                                                    <tr>
                                                        <td>Subtotal</td>
                                                        <td>{location.state.subTotalState.subTotal}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>GST (5%)</td>
                                                        <td>{location.state.subTotalState.gst}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Order Total</td>
                                                        <td>{location.state.subTotalState.grandTotal}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <Accordion className="mx-3 mt-3 shadowCus" defaultExpanded={true}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1bh-content"
                                                id="panel1bh-header">
                                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                                    Address
                                                </Typography>

                                            </AccordionSummary>
                                            {state.addresses.length !== 0 ?
                                                <AccordionDetails>
                                                    {state.addresses.map((ele, index) =>
                                                        <Typography key={index}>
                                                            <input type="radio" name="address" value={index}
                                                                onClick={(e) => setvalue(e.target.value)} />
                                                            &nbsp; &nbsp;
                                                            {ele.address + " " + ele.city + " " + ele.pincode + " " + ele.states + " " + ele.country}
                                                        </Typography>


                                                    )}
                                                </AccordionDetails>
                                                :
                                                <button className="btn btn-primary" onClick={() => navigate('/account/address')}>Add address</button>}
                                        </Accordion>
                                    </CardContent>
                                    <CardActions >
                                        <Button variant="contained" color="success" onClick={() => checkout()}> Pay </Button>
                                    </CardActions>
                                </Card>
                            </div>
                        </Grid>
                    </Grid>
                    <Footer />
                </>
                :
                <button onClick={navigate('/login')}></button>
            }
        </div >

    )
}
