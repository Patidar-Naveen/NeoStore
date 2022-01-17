import React, { useEffect, useState } from 'react'
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import Navbaar from './Navbaar'
import Footer from './Footer'
import { useDispatch, useSelector } from 'react-redux'
export default function Account() {
    const [state, setstate] = useState({})
    const userProfile = useSelector(state => state.profileReducer)
    const dispatch = useDispatch();
    const navigate = useNavigate()

    useEffect(() => {
        // checking user is login or not 
        if (localStorage.getItem('_token') != undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwtDecode(token)
            console.log(decode)
            setstate(decode)
            dispatch({ type: "updateProfile", payload: decode.firstname + " " + decode.lastname })
            dispatch({ type: "updatePicture", payload: decode.profilepic })
        }
        else {
            navigate('/login')
        }
    }, [])
    return (
        <>
            {localStorage.getItem('_token') != undefined ?
                <>
                    <Navbaar />
                    <div className='container-fluid' style={{ width: '100%' }}>
                        <div className='row'>
                            <div id='side_account' className='pt-5 col-sm-12 col-md-3  col-lg-3' style={{ color: "black", height: "90vh" }}>
                                <div className='text-center'>
                                    {userProfile.profile == undefined ?
                                        <img src={`../images/user-default.jpg`} alt='Profile1' className='profile_img' />
                                        : <img src={`../images/${userProfile.profile}`} alt='Profile' className='profile_img' />}
                                </div>
                                <h3 className='text-center mt-3 fs-1'>{userProfile.name}</h3>
                                <ul className='text-center mr-4 mt-2'>
                                    <li className='ull my-2 fa fa-shopping-cart'> <Link style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }} to="order">Orders</Link></li> <br />
                                    <li className='ull fa fa-address-book my-2'> <Link style={{ textDecoration: 'none', fontWeight: 'bold' }} to="address">Address</Link></li> <br />
                                    <li className='ull my-2 fa fa-user'> <Link style={{ textDecoration: 'none', fontWeight: 'bold' }} to="profile">Profile</Link></li> <br />
                                    <li className='ull fa fa-retweet my-2'> <Link style={{ textDecoration: 'none', fontWeight: 'bold' }} to="changepassword">Change Password</Link></li> <br />
                                </ul>
                            </div>

                            <div className='col-sm-12 col-md-9  col-lg-9 my-5'>
                                <Outlet />
                            </div>

                        </div>
                    </div>
                    <Footer />
                </>
                :
                <Navigate to='/login'></Navigate>
            }

        </>
    )
}