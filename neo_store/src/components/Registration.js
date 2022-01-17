import { userRegService } from "../config/Myservice";
import React, { useState } from "react";
import SocialButton from "./SocialButton";
import { useNavigate } from "react-router";
import Alert from '@mui/material/Alert';
import { IoMdMail } from "react-icons/io";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { MdPhone } from "react-icons/md";
import { ImFacebook, ImGoogle } from "react-icons/im";
import { Container, Form, FormControl, InputGroup, Button, } from "react-bootstrap";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Navbaar from "./Navbaar";
const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForName = RegExp(/^[A-Za-z]{3,30}$/);
const regForContact = RegExp(/^[6-9][0-9]{9}/);
const regForpassword = RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
const styled = {
    margin: 0,
    fontSize: "small",
    color: "red",
};

export default function Registration() {
    const navigate = useNavigate();
    const [errors, seterrors] = useState({
        firstname: "", lastname: "", erremail: "", contact: "", password: "",
        confirm_password: "", gender: "", pass: null, submit_error: ''
    });
    const [data, setdata] = useState({
        firstname: "", lastname: "", email: "", contact: "", password: "", confirm_password: "",
        gender: "", showpassword: false, showconfirmpassword: false
    });


    //for validation
    const handler = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case "firstname":
                let error1 = regForName.test(value) ? "" : "Invalid Name";
                seterrors({ ...errors, firstname: error1 });
                break;

            case "lastname":
                let error2 = regForName.test(value) ? "" : "Invalid Name";
                seterrors({ ...errors, lastname: error2 });
                break;

            case "email":
                let error3 = regForEmail.test(value) ? "" : "Invalid Email";
                seterrors({ ...errors, email: error3 });
                break;

            case "contact":
                let error4 = regForContact.test(value) ? "" : "Invalid Contact";
                seterrors({ ...errors, contact: error4 });
                break;

            case "password":
                let error5 = regForpassword.test(value) ? "" : "Invalid Password";
                seterrors({ ...errors, password: error5, pass: value });
                break;

            case "confirm_password":
                let error6 = value === errors.pass ? "" : "Password does not match";
                seterrors({ ...errors, confirm_password: error6 });
                break;
        }
        setdata({ ...data, [name]: value });
    };

    // for normal registration
    const userRegistration = async () => {
        if (data.firstname != "" && data.lastname != "" && data.email != "" && data.contact != "" && data.password != "" &&
            data.confirm_password != "" && data.gender != "") {
            let formData = {
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                contact: data.contact,
                password: data.password,
                confirm_password: data.confirm_password,
                gender: data.gender,
            };
            await userRegService(formData).then((res) => {
                if (res.data.err == 0) {
                    seterrors({ ...errors, submit_error: res.data.msg })
                    navigate("/login");
                } else {
                    seterrors({ ...errors, submit_error: res.data.msg })
                }
            });
        } else {
            seterrors({ ...errors, submit_error: "Enter All Registration Details" })
        }
    };

    // for registration with social login
    const handleSocialLogin = async (user) => {
        console.log(user)
        let formData = {
            firstname: user._profile.firstName,
            lastname: user._profile.lastName,
            email: user._profile.email,
            contact: 9999999999,
            password: user._profile.id,
            gender: "undefined",
        };
        await userRegService(formData).then((res) => {
            if (res.data.err == 0) {
                seterrors({ ...errors, submit_error: res.data.msg })
                navigate("/login");
            } else {
                seterrors({ ...errors, submit_error: res.data.msg })
            }
        });
    };

    const handleSocialLoginFailure = (err) => {
        console.error(err);
    };

    return (
        <>
        <Navbaar/>
        <Container>
            <div className="registration">
                <div className="d-flex justify-content-center">
                    <SocialButton
                        style={{ backgroundColor: "#4267B2" }}
                        className="facebook"
                        provider="facebook"
                        appId="530980681768179"
                        onLoginSuccess={handleSocialLogin}
                        onLoginFailure={handleSocialLoginFailure}
                    >
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
                <h3 className="text-center">Register to NeoSTORE</h3>
                {errors.submit_error.length != 0 &&
                    <Alert severity="error">{errors.submit_error}</Alert>}
                <Form.Group>
                    <InputGroup>
                        <FormControl
                            type="text"
                            placeholder="First Name"
                            name="firstname"
                            onBlur={handler}
                        />
                        {/* change icon here */}
                    </InputGroup>
                    <p style={styled}>{errors.firstname}</p>
                </Form.Group>
                <Form.Group>
                    <InputGroup>
                        <FormControl
                            type="text"
                            placeholder="Last Name"
                            name="lastname"
                            onBlur={handler}
                        />
                    </InputGroup>
                    <p style={styled}>{errors.lastname}</p>
                </Form.Group>
                <Form.Group>
                    <InputGroup>
                        <FormControl
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            onBlur={handler}
                        />
                        <IoMdMail className="iconlogin" />
                    </InputGroup>
                    <p style={styled}>{errors.email}</p>
                </Form.Group>
                <Form.Group>
                    <InputGroup>
                        <FormControl
                            type={data.showpassword ? "text" : "password"}
                            placeholder="Password"
                            name="password"
                            onBlur={handler}
                        />
                        {data.showpassword ? (
                            <BsEyeFill
                                className="iconlogin"
                                onClick={() => setdata({ ...data, showpassword: false })}
                            />
                        ) : (
                            <BsEyeSlashFill
                                className="iconlogin"
                                onClick={() => setdata({ ...data, showpassword: true })}
                            />
                        )}
                    </InputGroup>
                    <p style={styled}>
                        {errors.password}
                    </p>
                </Form.Group>
                <Form.Group>
                    <InputGroup>
                        <FormControl
                            type={data.showconfirmpassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            name="confirm_password"
                            onBlur={handler}
                        />
                        {data.showconfirmpassword ? (
                            <BsEyeFill
                                className="iconlogin"
                                onClick={() => setdata({ ...data, showconfirmpassword: false })}
                            />
                        ) : (
                            <BsEyeSlashFill
                                className="iconlogin"
                                onClick={() => setdata({ ...data, showconfirmpassword: true })}
                            />
                        )}
                    </InputGroup>
                    <p style={styled}> {errors.confirm_password}</p>
                </Form.Group>
                <Form.Group>
                    <InputGroup>
                        <FormControl
                            type="text"
                            placeholder="Mobile No."
                            name="contact"
                            onBlur={handler}
                        />
                        <MdPhone className="iconlogin" />
                    </InputGroup>
                    <p style={styled}>{errors.contact}</p>
                </Form.Group>
                <Form.Group>
                    <span className="mr-3">Gender :</span>
                    <input type="radio" value="Male" id="gender1" name="gender" onChange={handler} />
                    <label htmlFor="gender1">Male</label>
                    <input type="radio" value="Female" id="gender2" name="gender" onChange={handler} />
                    <label htmlFor="gender2">Female</label>
                </Form.Group>
                <p style={styled}>{errors.gender}</p>
                <div className="text-center">
                  <Button className="button_fun px-5" onClick={() => userRegistration()}>Register</Button>
                </div>
                <span >Already have an account?
                    <Link to="/login" className='font-weight-bold' style={{ textDecoration: "none" }}> Login here</Link>
                </span>
            </div>
        </Container>
        <Footer/>
        </>
    );
}
