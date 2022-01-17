import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'
import Alert from '@mui/material/Alert';
import { Container, Form, FormControl, InputGroup, Button } from 'react-bootstrap'
import { useNavigate } from "react-router";
import { resetPassService } from '../config/Myservice';
import Footer from './Footer';
import Navbaar from './Navbaar';
import { forgetPassService} from '../config/Myservice';
const regForpassword = RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

export default function Forgetpassword() {
	const [state, setstate] = useState({ otp: null, password: '', confirmpassword: '', msg: '' })
	const navigate = useNavigate();
	const [flag, setflag] = useState({ password: false, confirmpassword: false })

	const location = useLocation();

	// this will check the otp and update the 
	//password and send back to login page to logi again
	const resetPassword = () => {
		if (state.otp != null ) {
			if (regForpassword.test(state.password) && state.password === state.confirmpassword) {
				resetPassService({ email: location.state.email, password: state.password ,otp:state.otp})
					.then(res => {
						if(res.data.err==0){
							alert(res.data.msg)
							navigate("/login")
						}
						else{
							setstate({...state,msg:res.data.msg})
						}
					})
			}
			else {
				setstate({...state,msg:'Enter Strong Password'})
			}
		}
		else {
			setstate({...state,msg:'Enter Correct OTP'})
		}
	}

	// if we want to send the OTP again then this will work 
	const resendOtp = () =>{
            forgetPassService({ email: location.state.email })
                .then(res => {
                    if (res.data.err == 0) {
						alert("OTP sent Succesfully .")
                    }
                })
	}

	return (
		<div>
			<Navbaar/>
			<Container style={{height:"75vh"}}>
				<div className="registration" style={{ width: "85vh",marginTop:"5rem" }}>
					<h3 className='text-center'>Recover Password</h3>
					{state.msg.length != 0 &&
						<Alert severity="error">{state.msg}</Alert>}

					<Form.Group>
						<FormControl name="verificationcode" placeholder="Verification code" type="number" onChange={(e) => setstate({ ...state, otp: e.target.value })} />
					</Form.Group>
					<Form.Group>
						<InputGroup>
							<FormControl name="password" placeholder="New Password" type={flag.password ? "text" : "password"} onChange={(e) => setstate({ ...state, password: e.target.value })} />
							{flag.password ?
								<BsEyeFill className="iconlogin" onClick={() => setflag({ ...flag, password: false })} />
								:
								<BsEyeSlashFill className="iconlogin" onClick={() => setflag({ ...flag, password: true })} />
							}
						</InputGroup>
					</Form.Group>
					<Form.Group>
						<InputGroup>
							<FormControl name="confirmpassword" placeholder="Confirm Password" type={flag.confirmpassword ? "text" : "password"} onChange={(e) => setstate({ ...state, confirmpassword: e.target.value })} />
							{flag.confirmpassword ?
								<BsEyeFill className="iconlogin" onClick={() => setflag({ ...flag, confirmpassword: false })} />
								:
								<BsEyeSlashFill className="iconlogin" onClick={() => setflag({ ...flag, confirmpassword: true })} />
							}
						</InputGroup>
					</Form.Group>
					<div className='d-flex justify-content-between  mt-2'>
					<Button className='button_fun ' onClick={() => resetPassword()}>Submit</Button>
					<p onClick={()=>resendOtp()}>resend OTP?</p>
					</div>
				</div>
			</Container>
			<Footer/>
		</div>
	)
}
