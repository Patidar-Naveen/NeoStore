import React, { useEffect, useState } from 'react'
import Footer from './Footer'
import Navbaar from './Navbaar'
import { Card } from 'react-bootstrap'
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductService, applyFilterService } from '../config/MyProductService'
import { Accordion, AccordionSummary, AccordionDetails, Typography, Grid } from '@mui/material'
import ReactPaginate from 'react-paginate';
import ReactStars from 'react-rating-stars-component';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Product() {
    const [state, setstate] = useState({ allproducts: [], colors: [], category: [], searchProduct: [] })
    const [filter, setfilter] = useState({ colors: [], category: '' })
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const reduxStore = useSelector(state => state.profileReducer)

    // this will fetch all products by executing function
    useEffect(() => {
        fetchAllProducts()
    }, [])

    // this will update the product array for specific search valye 
    // which comes from redux store
    useEffect(() => {
        searchFilter(state.searchProduct)
    }, [reduxStore.searchKeyword])

    // comparing the search value with products array
    const searchFilter = (data) => {
        if (reduxStore.searchKeyword != '') {
            let cart = data.filter((pro) => {
                if (pro.product_name.toLowerCase()
                    .includes(reduxStore.searchKeyword.trim().toLowerCase())) {
                    return pro;
                }
            })
            setstate({ ...state, allproducts: cart })
        }
    }

    // for initial fetching and on click on all products button 
    const fetchAllProducts = () => {
        fetchProductService()
            .then(res => {
                setstate({ allproducts: res.data.allproduct, colors: res.data.color, category: res.data.category, searchProduct: res.data.allproduct })
            })
        dispatch({ type: "searchKeyword", payload: '' });
    }

    // aplaying the filters of colors and catagory
    const applyfilter = () => {
        let formData = {
            category: filter.category,
            colors: filter.colors,
        };
        applyFilterService(formData).then((res) => {
            setstate({ ...state, allproducts: res.data.product });
            // searchFilter(res.data.product)
        });
    };

    // clearing the filter value and setting it to default
    const clearFilter = () => {
        if (filter.colors != []) {
            filter.colors.map((ele) => {
                document.getElementById(ele).checked = false;
            });
        }
        if (filter.category != '') {
            document.getElementById(filter.category).checked = false;
        }
        setfilter({ category: '', colors: [] })
        fetchAllProducts()
    }


    // function component to apply pagination
    function PaginatedItems({ itemsPerPage }) {
        const [currentItems, setCurrentItems] = useState(null);
        const [pageCount, setPageCount] = useState(0);
        const [itemOffset, setItemOffset] = useState(0);

        useEffect(() => {
            const endOffset = itemOffset + itemsPerPage;
            setCurrentItems(state.allproducts.slice(itemOffset, endOffset));
            setPageCount(Math.ceil(state.allproducts.length / itemsPerPage));
        }, [itemOffset, itemsPerPage]);

        const handlePageClick = (event) => {
            const newOffset = (event.selected * itemsPerPage) % state.allproducts.length;
            console.log(
                `User requested page number ${event.selected}, which is offset ${newOffset}`
            );
            setItemOffset(newOffset);
        };

        return (
            <>
                <Items currentItems={currentItems} />
                <ReactPaginate
                    className='pagination'
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                />
            </>
        );
    }

    // mapping the products for pagination
    function Items({ currentItems }) {
        return (
            <>
                <Grid container spacing={2} className='mt-1 mb-3'>
                    {currentItems &&
                        currentItems.map((ele) => (
                            <Grid item xs={12} sm={12} md={4} key={ele._id}>
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
            </>
        );
    }

    // this will sort by product rating in decresing order
    const sortByRating = () => {
        state.allproducts.sort(function (a, b) {
            return (b.product_rating / b.rated_by) - (a.product_rating / a.rated_by);
        });
        setstate({ ...state, allproducts: state.allproducts })
    }

    // this will sort by product price in incresing order
    const sortByPriceUp = () => {
        state.allproducts.sort(function (a, b) {
            return b.product_cost - a.product_cost;
        });
        setstate({ ...state, allproducts: state.allproducts })
    }

    // this will sort by product price in decresing order
    const sortByPriceDown = () => {
        state.allproducts.sort(function (a, b) {
            return a.product_cost - b.product_cost;
        });
        setstate({ ...state, allproducts: state.allproducts })
    }


    return (
        <>
            <Navbaar />
            <Grid container spacing={2} className='mt-2'>
                <Grid item xs={12} sm={12} md={3}>
                    <div >
                        <nav className="nav flex-column">
                            <Button variant="contained" className="button_fun mx-3" onClick={() => clearFilter()}>All Products</Button>
                            <Accordion className="mx-3 mt-3 shadowCus" defaultExpanded={true}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header" >
                                    <Typography className="dropdown">Category</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {state.category && state.category.map((cat) => (
                                        <Typography key={cat._id}>
                                            <input
                                                type="radio"
                                                id={cat._id}
                                                onClick={(e) => setfilter({ ...filter, category: e.target.value })}
                                                name="categories"
                                                value={cat._id} />
                                            &nbsp;  {cat.category_name}
                                        </Typography>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                            <Accordion className="mx-3 mt-1 shadowCus" defaultExpanded={true}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2a-content"
                                    id="panel2a-header" >
                                    <Typography className="dropdown">colors</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {state.colors && state.colors.map((cat) => (
                                        <Typography key={cat._id}>
                                            <input
                                                type="checkbox"
                                                id={cat._id}
                                                onClick={(e) => setfilter({ ...filter, colors: [...filter.colors, e.target.value] })}
                                                name="color"
                                                value={cat._id} />
                                            &nbsp;{cat.color_name}
                                        </Typography>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                            <Button variant="contained" className="button_fun mx-5 mt-1" onClick={() => applyfilter()}>Apply</Button>

                        </nav>
                    </div>
                </Grid>
                <Grid item xs={12} sm={12} md={9}>
                    <div className='text-right'>
                        <div className='container text-left mt-2' >
                            Sort By :
                            <i className="fa fa-star mx-2" onClick={() => sortByRating()}></i>
                            <i className="fa fa-arrow-up mx-2" onClick={() => sortByPriceUp()} ></i>
                            <i className="fa fa-arrow-down mx-2" onClick={() => sortByPriceDown()} ></i>
                        </div>
                    </div>
                    <PaginatedItems itemsPerPage={9} />
                </Grid>
            </Grid>
            <Footer />
        </>
    )
}



const rating = (ele) => {
    return {
        edit: false,
        color: "rgba(20,20,20,0.1)",
        activeColor: "tomato",
        size: window.innerWidth < 600 ? 20 : 25,
        value: ele.product_rating / ele.rated_by,
        isHalf: true,
    };
}