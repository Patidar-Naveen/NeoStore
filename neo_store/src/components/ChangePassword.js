import React, { useState, useEffect } from 'react'
import jwtdecode from 'jwt-decode'
import { changePasswordService } from '../config/Myservice'
import bcrypt from 'bcryptjs'
import Alert from '@mui/material/Alert';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'
import {Card, Form, FormControl, InputGroup, Button } from 'react-bootstrap'

const styled = { margin: 0, fontSize: 'small', color: 'red' }


export default function ChangePassword() {
    const [state, setstate] = useState({ oldpassword: "", newpassword: "", confpassword: "", error: "" })
    const [pass, setpass] = useState({ password: '', email: '' })
    const [flag, setFlag] = useState({ oldpassword: false, newpassword: false, confpassword: false })

    useEffect(() => {
        if (localStorage.getItem('_token') !== undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwtdecode(token)
            setpass({ password: decode.password, email: decode.email })
        }
    }, [])

    //setting the input value in state
    const handler = (event) => {
        const { name, value } = event.target
        setstate({ ...state, [name]: value })
    }

    // on click on submit daata will check to update
    const submit = () => {
        if (state.oldpassword !== '' && bcrypt.compareSync(state.oldpassword, pass.password)) {
            if (state.newpassword !== '' && state.confpassword !== '' && state.newpassword === state.confpassword) {
                changePasswordService({ email: pass.email, password: state.newpassword })
                    .then(res => {
                        alert(res.data.msg)
                        localStorage.setItem("_token", res.data.token);
                    })
            }
            else {
                setstate({...state,error:'Password does not match'})
            }
        }
        else {
            setstate({...state,error:"Old Password doesn't match"})
        }
    }

    return (
        <>
            <div className='d-flex justify-content-center'>
                <Card className='mt-5' style={{ backgroundColor: '#343a40', width: "80%", borderRadius: " 10px" }}>
                    <Card.Title className='text-center mt-3'>
                        <h3 className='text-white'>Change Password</h3>
                    </Card.Title>

                    <Card.Body>
                    {state.error.length != 0 &&
						<Alert severity="error">{state.error}</Alert>}
                        <Form.Group>
                            <InputGroup className='my-4'>
                                <FormControl name="password" placeholder="Old Password" type={flag.oldpassword ? "text" : "password"} onChange={handler} />
                                {flag.oldpassword ?
                                    <BsEyeFill className="iconlogin" onClick={() => setFlag({ ...flag, oldpassword: false })} />
                                    :
                                    <BsEyeSlashFill className="iconlogin" onClick={() => setFlag({ ...flag, oldpassword: true })} />
                                }
                            </InputGroup>
                        </Form.Group>
                        <Form.Group>
                            <InputGroup>
                                <FormControl name="password" placeholder="New Password" type={flag.newpassword ? "text" : "password"} onChange={handler} />
                                {flag.newpassword ?
                                    <BsEyeFill className="iconlogin" onClick={() => setFlag({ ...flag, newpassword: false })} />
                                    :
                                    <BsEyeSlashFill className="iconlogin" onClick={() => setFlag({ ...flag, newpassword: true })} />
                                }
                            </InputGroup>
                        </Form.Group>
                        <Form.Group>
                            <InputGroup className='my-4'>
                                <FormControl name="confirmpassword" placeholder="Confirm Password" type={flag.confpassword ? "text" : "password"} onChange={handler} />
                                {flag.confpassword ?
                                    <BsEyeFill className="iconlogin" onClick={() => setFlag({ ...flag, confpassword: true })} />
                                    :
                                    <BsEyeSlashFill className="iconlogin" onClick={() => setFlag({ ...flag, confpassword: true })} />
                                }
                            </InputGroup>
                        </Form.Group>
                        <div class="text-center">
                            <Button className='button_fun ' onClick={() => submit()}>Submit</Button>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}