import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Form, FormControl, NavDropdown } from 'react-bootstrap'
import { MdAccountBox, MdAccountCircle } from 'react-icons/md'
import { BiLogIn, BiLogOut, BiUserPlus } from "react-icons/bi";
import { FiShoppingCart } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import { Badge } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux'
import { cartSaveService } from '../config/Myservice';
import jwtDecode from 'jwt-decode';


export default function Navbaar() {
    const [login, setlogin] = useState(false)
    const [searchKey, setsearchKey] = useState('')
    const dispatch = useDispatch();
    const cartStore = useSelector(state => state.cartReducer)


    useEffect(() => {
        // cheking user is login or not so navbar appear diffrent 
        if (localStorage.getItem('_token') != undefined) {
            setlogin(true)
        }
    }, [])


    // on logout cart will become empty and navigate to home
    const logout = () => {
        let data = JSON.parse(localStorage.getItem('cart'))
        let decode = jwtDecode(localStorage.getItem('_token'))
        cartSaveService({ data: data, email: decode.email })
            .then(res => {
                console.log(res.data)
            })
        localStorage.removeItem('_token');
        localStorage.removeItem('cart');
        dispatch({ type: "emptyCart", payload: 0 })
    }


    // storing the serach keyword in redux store
    const searchDispatch = () => {
        dispatch({
            type: "searchKeyword",
            payload: searchKey,
        });
        setsearchKey("")
    };
    return (
        <div>
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "black" }}>
                    <div className="container-fluid">
                        <Link className="navbar-brand font-weight-bold" to="/" style={{ fontSize: "1.6rem" }}>Neo<span style={{ color: "red" }}>STORE</span></Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav">

                                <li className="nav-item">
                                    <Link className="nav-link" to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/product">Product</Link>
                                </li>
                                <li className="nav-item">
                                    {login ?
                                        <Link className="nav-link" to="/account/order">Order</Link>
                                        :
                                        <Link className="nav-link" to="/login">Order</Link>
                                    }
                                </li>
                            </ul>
                        </div>

                        <Form className="d-flex">
                            <FormControl
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                                value={searchKey}
                                onChange={(e) => setsearchKey(e.target.value)}
                            />
                            <Button variant="outline-success" className='ml-2 mr-4' onClick={() => searchDispatch()}><FaSearch /></Button>
                        </Form>

                        <div>
                            <Link to="/cart" style={{ color: "white", textDecoration: "none" }}>
                                    <Badge badgeContent={cartStore.count} color="primary">
                                        <FiShoppingCart style={{ fontSize: "1.5rem" }} />
                                    </Badge>
  
                            </Link>
                        </div>
                        {login ?
                            <NavDropdown title={<MdAccountBox style={{ backgroundColor: 'white', color: 'black', width: '30px', height: '27px' }} />} id="navbarScrollingDropdown" style={{ marginLeft: '21w', width: '50px', height: '40px', backgroundColor: "white", borderRadius: '5px' }}>
                                <NavDropdown.Item ><Link to="/account/profile" style={{ color: "black", textDecoration: "none" }} ><MdAccountCircle /> My Account</Link></NavDropdown.Item>
                                <NavDropdown.Item ><Link to="/" style={{ color: "black", textDecoration: "none" }} onClick={() => logout()}><BiLogOut />&nbsp;&nbsp; Signout</Link></NavDropdown.Item>
                            </NavDropdown>
                            :
                            <NavDropdown title={<MdAccountBox style={{ backgroundColor: 'white', color: 'black', width: '30px', height: '27px' }} />} id="navbarScrollingDropdown" style={{ marginLeft: '2vw', width: '50px', height: '40px', backgroundColor: "white", borderRadius: '5px' }}>
                                <NavDropdown.Item ><Link to="/login" style={{ color: "black", textDecoration: "none" }} ><BiLogIn />&nbsp;&nbsp;Login</Link></NavDropdown.Item>
                                <NavDropdown.Item ><Link to="/registration" style={{ color: "black", textDecoration: "none" }}><BiUserPlus />&nbsp;&nbsp; Register</Link></NavDropdown.Item>
                            </NavDropdown>
                        }

                    </div>
                </nav>
            </div>
        </div>
    )
}