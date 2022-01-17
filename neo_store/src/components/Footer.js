import React, { useState } from 'react'
import { Button, Form, FormControl } from 'react-bootstrap'
import { emailSubscribeService } from '../config/Myservice'
import Swal from 'sweetalert2'
export default function Footer() {
    const [email, setEmail] = useState('')

    // when user will click on subcribe will send an email 
    const subscribe = () => {
        if (email !== '') {
            emailSubscribeService({ email: email })
                .then(res => {
                    console.log(res.data.err)
                    if (res.data.err === 0) {
                        console.log(res.data)
                        Swal.fire({ 
                            icon: 'success',
                            text: "Thank You Subscribing US!!",
                          })
                          setEmail('')
                    }
                    else {
                        Swal.fire({ 
                            icon: 'error',
                            title: 'Oops...',
                            text: res.data.msg,
                          })
                    }
                })
        }
        else {
            Swal.fire(
                'Empty!!?',
                'Please enter Email!!!',
                'question'
            )
        }
    }

    return (<>
        <div className="customneofooter">
            <div>
                <h3>About Company</h3>
                <ul>
                    <li><p>Neosoft Technologies is here at your quick and easy for shopping.</p></li>
                    <li>Contact information</li>
                    <li>Email: naveenpatidar3330@gmail.com</li>
                    <li>Phone: +91 7354682183</li>
                    <li>INDORE,INDIA</li>
                </ul>
            </div>
            <div>
                <h3>Information</h3>
                <ul >
                    <li><span><a href="./images/terms.pdf" target="_blank">Terms and Conditions</a></span></li>
                    <li><span>Gurantee and Return Policy</span></li>
                    <li><span>Contact Us</span></li>
                    <li><span>Privacy Policy</span></li>
                    <li><a href='https://www.google.com/maps/place/Apollo+Premier/@22.7500177,75.8966811,15z/data=!4m2!3m1!1s0x0:0x5bef82fe270e4409?sa=X&ved=2ahUKEwiQl5CQo6r1AhW1yTgGHQYYBKIQ_BJ6BAgeEAU' target='_blank'>Locate Us</a></li>
                </ul>
            </div>
            <div>
                <h3>Newsletter</h3>
                <ul>
                    <li>Signup to get exclusive offer from our favorite brands and to be well up in the news.</li>
                    <br />
                    <li>
                        <Form className="d-flex">
                            <FormControl
                                type="email"
                                placeholder="your email..."
                                className="me-2 ms-2"
                                aria-label="your email..."
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form>
                    </li>
                    <br />
                    <li><Button variant="light" onClick={() => subscribe()}>Subscribe</Button></li>
                </ul>
            </div>
        </div>
        <p style={{ backgroundColor: 'black', color: 'white', textAlign: 'center', wordBreak: 'break-word', margin: '0', borderBottom: '3px solid grey', paddingBottom: '15px' }}>Copyright 2017 NeoSOFT Technologies All rights reserved | Design By Naveen Patidar</p>
    </>
    )
}
