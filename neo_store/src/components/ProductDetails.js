import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchProductDetailsService, rateProductService } from '../config/MyProductService'
import Magnifier from "react-magnifier";
import { Row, Col, } from 'react-bootstrap';
import ReactStars from 'react-rating-stars-component';
import { FacebookShareButton, TwitterShareButton, EmailShareButton, WhatsappShareButton, PinterestShareButton } from "react-share";
import { FacebookIcon, TwitterIcon, EmailIcon, PinterestIcon, WhatsappIcon } from "react-share";
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux'
import Navbaar from './Navbaar';
import Footer from './Footer';
import { FiShoppingCart } from 'react-icons/fi';
import { BsStarFill, BsStarHalf } from 'react-icons/bs';


function Productstate() {
    const dispatch = useDispatch()
    const [state, setstate] = useState([])
    const [index, setIndex] = useState(0)
    const location = useLocation()

    // this will fetch the product by using URL query
    useEffect(() => {
        fetchProductDetailsService(location.search).then(res =>
            setstate(res.data)
        )
    }, [])

    // this is for showing current rating
    const rating = (ele) => {
        return {
            edit: false,
            color: "rgba(20,20,20,0.1)",
            activeColor: "tomato",
            size: window.innerWidth < 600 ? 20 : 25,
            value: ele.product_rating/ele.rated_by,
            isHalf: true,
        };
    }

    // this is for changing the stars and taking rating by the user
    const rateProduct = {
        size: 20,
        count: 5,
        color: "black",
        activeColor: "red",
        value: 7.5,
        a11y: true,
        isHalf: true,
        emptyIcon: <BsStarFill />,
        halfIcon: <BsStarHalf />,
        filledIcon: <BsStarFill />,
        onChange: newValue => {
            chngeRating(newValue)
        }
    };

    // saving the product rating in database
    const chngeRating = (value) => {
        rateProductService(location.search, { value: state.product_rating + value, rated: state.rated_by + 1 }).then(res =>
            setstate(res.data))

            alert("thanks for the rating")
            window.location.reload(false)
    }
    return (
        <>
            <Navbaar />
            {state.length != 0 &&
                <Row className="container-fluid mt-3">
                    <Col sx={12} md={5} lg={5}>
                        <Magnifier src={`./images/${state.product_subimages[index]}`} height={350} width={350} className='d-block mx-auto mb-3 shadow' />
                        <div className='d-flex justify-content-evenly'>
                            {state.product_subimages.map((val, i) =>
                                <img key={val} src={`./images/${state.product_subimages[i]}`} height='100' width='100' onClick={() => setIndex(i)} />
                            )}
                        </div>
                    </Col>
                    <Col sx={12} md={7} lg={7}>
                        <h1>{state.product_name}</h1>
                        <ReactStars {...rating(state)} />
                        <hr />
                        <h5>Price : ₹<span className='text-success'>{state.product_cost}</span></h5>
                        <h5>Color : <span style={{ display: "inline-block", height: '20px', width: "50px", borderRadius: "10px", background: state.color_id.color_code }} ></span></h5>
                        <h5 style={{ display: "inline-block" }}>Share </h5> <i className="bi bi-share-fill text-dark" style={{ fontSize: "30px", display: "inline-block" }}></i>
                        <div className='d-flex justify-content-between mb-2' style={{ width: "40%" }}>
                            <FacebookShareButton
                                url={"https://github.com/Patidar-Naveen"}>
                                <FacebookIcon size={40} round />
                            </FacebookShareButton>

                            <TwitterShareButton
                                url={"https://github.com/Patidar-Naveen"} >
                                <TwitterIcon size={40} round />
                            </TwitterShareButton>

                            <EmailShareButton
                                url={"https://github.com/Patidar-Naveen"}>
                                <EmailIcon size={40} round />
                            </EmailShareButton>

                            <WhatsappShareButton
                                url={"https://github.com/Patidar-Naveen "}>
                                <WhatsappIcon size={40} round />
                            </WhatsappShareButton>

                            <PinterestShareButton
                                url={"https://github.com/Patidar-Naveen "}>
                                <PinterestIcon size={50} round />
                            </PinterestShareButton>
                        </div>
                        <Button className='button_fun my-1' variant="contained" color='error' size='lg' onClick={() => dispatch({ type: "addCartDispatch", payload: state })}><FiShoppingCart style={{ fontSize: "1.5rem" }} /> &nbsp; Add To Cart</Button>
                        <Button variant="contained" color='primary' className='m-2 p-1'>Rate<ReactStars {...rateProduct} /></Button>

                        <h5>Description : </h5>
                        <ul style={{ listStyle: 'square' }}>
                            <li>Category : {state.category_id.category_name}</li>
                            <li>Color : {state.color_id.color_name}</li>
                        </ul>
                        <p >{state.product_desc}</p>
                    </Col>
                </Row>
            }
            <Footer />
        </>
    )
}

export default Productstate



