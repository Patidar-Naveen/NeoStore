import React, { useState } from 'react'
import SocialButton from "./SocialButton";
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router";
import { forgetPassService, userLogService } from '../config/Myservice';
import { IoMdMail } from 'react-icons/io'
import { ImFacebook, ImGoogle } from 'react-icons/im'
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'
import { Form, FormControl, Button, InputGroup, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import Footer from './Footer';
import Navbaar from './Navbaar';
import { useDispatch } from 'react-redux';
import jwtDecode from 'jwt-decode';

export default function Login() {
    const [state, setstate] = useState({ email: '', password: '', error: '' })
    const navigate = useNavigate();
    const [showpassword, setShowPassword] = useState(false)
    const dispatch = useDispatch()

 // normal login function 
    const loginFunction = () => {
        if (state.email != '' && state.password != '') {
            userLogService({ email: state.email, password: state.password })
                .then(res => {
                    if (res.data.err == 0) {
                        localStorage.setItem("_token", res.data.token);
                        let decode = jwtDecode(res.data.token)
                        dispatch({ type: "onLoginDispatch", payload: decode.cart })
                        navigate("/")
                    }
                    else {
                        alert(res.data.msg)
                    }
                })
        }
        else {
            alert("Please enter data")
        }
    }

    // social login funtion
    const handleSocialLogin = (user) => {
        userLogService({ email: user._profile.email, password: user._profile.id })
            .then(res => {
                if (res.data.err == 0) {
                    localStorage.setItem("_token", res.data.token);
                    let decode = jwtDecode(res.data.token)
                    dispatch({ type: "onLoginDispatch", payload: decode.cart })
                    navigate("/")
                }
                else {
                    alert(res.data.msg)
                }
            })
    }

    // social login failure funtion
    const handleSocialLoginFailure = (err) => {
        console.error(err);
    };
 
    // this will run after click on forget password
    const forgetPassword = () => {
        if (state.email != '') {
            forgetPassService({ email: state.email })
                .then(res => {
                    if (res.data.err == 0) {
                        navigate("/forgetpassword", { state: { email: state.email } })
                    }
                    else {
                        setstate({ ...state, error: res.data.msg })

                    }
                })
        }
        else {
            setstate({ ...state, error: "Please enter email" })
        }
    }

    return (
        <>
            <Navbaar />
            <Container style={{ height: "80vh" }}>
                <div className="registration mt-5" style={{ width: "50%", }}>
                    <div className="d-flex justify-content-center">
                        <SocialButton
                            style={{ backgroundColor: "#4267B2" }}
                            className="facebook"
                            provider="facebook"
                            appId="530980681768179"
                            onLoginSuccess={handleSocialLogin}
                            onLoginFailure={handleSocialLoginFailure} >
                            <ImFacebook
                                style={{ fontSize: "xx-large", paddingRight: "10px" }}
                            />
                            Login with Facebook
                        </SocialButton>
                        <SocialButton
                            style={{ backgroundColor: "#DB4437" }}
                            className="google"
                            provider="google"
                            appId="420321224046-je2rf4df9mqcua73ve0usqqvrsoqvdi5.apps.googleusercontent.com"
                            onLoginSuccess={handleSocialLogin}
                            onLoginFailure={handleSocialLoginFailure}>
                            <ImGoogle style={{ fontSize: "xx-large", paddingRight: "10px" }} />
                            Login with Google
                        </SocialButton>
                    </div>
                    <hr />
                    <h3 className='text-center'>Login to NeoSTORE</h3>
                    {state.error.length != 0 &&
                        <Alert severity="error">{state.error}</Alert>}
                    <Form.Group>
                        <InputGroup>
                            <FormControl type="email" placeholder="Email Address" name="email" onChange={e => setstate({ ...state, email: e.target.value })} value={state.email} />
                            <IoMdMail className="iconlogin" />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group>
                        <InputGroup>
                            <FormControl name="password" placeholder="Password" type={showpassword ? "text" : "password"} onChange={e => setstate({ ...state, password: e.target.value })} value={state.password} />
                            {showpassword ?
                                <BsEyeFill className="iconlogin" onClick={() => setShowPassword(false)} />
                                :
                                <BsEyeSlashFill className="iconlogin" onClick={() => setShowPassword(true)} />
                            }
                        </InputGroup>
                    </Form.Group>

                    <div className='text-center'> <Button style={{ marginTop: "5px" }} className='button_fun px-5' onClick={() => loginFunction()}>Login</Button> </div>

                    <div style={{ marginTop: "1px" }} className='d-flex justify-content-between'>
                        <span >Don't have an account?
                            <Link to="/registration" className='font-weight-bold' style={{ textDecoration: "none" }}> Register here</Link>
                        </span>
                        <p style={{ cursor: 'pointer' }} onClick={() => forgetPassword()}>Forgot Password ?</p>
                    </div>

                </div>
            </Container>
            <Footer />
        </>
    )
}
