import React, { useEffect, useState } from 'react'
import { Card, Carousel } from 'react-bootstrap'
import Footer from './Footer'
import Navbaar from './Navbaar'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { fetchProductService } from '../config/MyProductService'
import { Grid ,Button} from '@mui/material'
import ReactStars from 'react-rating-stars-component';


export default function Home() {
    const [state, setstate] = useState([])
    const navigate = useNavigate()
    const dispatch = useDispatch();

    //fetching all products from database
    useEffect(() => {
        fetchProductService().then(res => {
            setstate(res.data.allproduct)
        })
    }, [])

    return (
        <div>
            <Navbaar />
            <Carousel fade>
                <Carousel.Item>
                    <img className="d-block w-100" src='../images/Carousel_1.jpg' alt="First slide" />
                    <Carousel.Caption>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src="../images/Carousel_2.jpg" alt="Second slide" />

                    <Carousel.Caption>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src="../images/Carousel_3.jpg" alt="Third slide" />
                    <Carousel.Caption>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
            <div className='text-center mt-4 text-danger'>
                <h2 >Most Popular Product</h2>
                <p >Based on user review</p>
            </div>
            <Grid container spacing={1} className='my-4'>
                {/* displaying only 6 products */}
                {state &&
                    state.map((ele, index) => (index < 6 &&
                        <Grid item xs={12} sm={12} md={4} key={ele._id} className='my-2'>
                            <Card className="products_pop" style={{ width: "320px" }} className="mx-auto products_pop shadowCus">
                                <img variant="top" src={"./images/" + ele.product_image} height="320" width='315' className="mx-auto" alt="..." onClick={() => navigate(`/ProductDetails?_id=${ele._id}`)} />
                                <Card.Body>
                                    <Card.Title className='text-center' onClick={() => navigate(`/ProductDetails?_id=${ele._id}`)}> {ele.product_name}</Card.Title>
                                    <Card.Title style={{ color: "#FF703B" }} className='d-flex justify-content-between'>
                                        <span>&#8377; {ele.product_cost}</span>
                                        <ReactStars {...rating(ele)} />
                                    </Card.Title>
                                    <div className='text-center'>
                                        <Button className='button_fun' variant="contained" color='error' onClick={() => dispatch({ type: "addCartDispatch", payload: ele })}>Add Cart</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
            <Footer />
        </div>
    )
}

// this is for product rating which will become stars in UI
const rating = (ele) => {
    return {
        edit: false,
        color: "rgba(20,20,20,0.1)",
        activeColor: "tomato",
        size: window.innerWidth < 600 ? 20 : 25,
        value:ele.product_rating/ele.rated_by,
        isHalf: true,
    };
}