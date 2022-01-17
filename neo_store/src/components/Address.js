import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import { Button, Card, Modal } from 'react-bootstrap'
import { addAddressService } from '../config/Myservice';
import CancelIcon from '@mui/icons-material/Cancel';
import { IoCloseCircle } from "react-icons/io5";
import EditIcon from '@mui/icons-material/Edit';
import { Alert } from '@mui/material';
const regForAddress = RegExp(/^([A-Za-z]|[0-9]|[\w\s])+$/);
const regForPincode = RegExp(/^[1-9][0-9]{5}/);
const regForName = RegExp(/^[a-zA-Z]/);

export default function Address() {
    const [add, setadd] = useState({})
    const [state, setstate] = useState({ addresses: [], address: '', city: '', pincode: '', states: '', country: '', index: null, flag1: false, flag2: false })
    const [errors, seterrors] = useState('')


    useEffect(() => {
        // accesing the token
        if (localStorage.getItem('_token') != undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwtDecode(token)
            setadd(decode)
            setstate({ ...state, addresses: decode.addresses })
        }
    }, [])

    // this will when we close the modal
    const handleClose = () => {
        setstate({ ...state, address: '', city: '', pincode: '', states: '', country: '', flag1: false, flag2: false })
    }

    // this will run when we will add new address
    const addAddress = () => {
        const email = add.email;
        if (state.address != '' && state.city != '' && state.pincode != '' && state.states != '' && state.country != '') {
            let formData = {
                address: state.address,
                pincode: parseInt(state.pincode),
                city: state.city,
                states: state.states,
                country: state.country
            }

            if (state.addresses.find(ele => JSON.stringify(ele) === JSON.stringify(formData)) === undefined) {
                let data = state.addresses
                data.push(formData)
                setstate({ ...state, addresses: data })
                addAddressService({ data: data, email })
                    .then(res => {
                        localStorage.setItem("_token", res.data.token);
                    })
            }
            else {
                alert("Address already addedd")
            }
            setstate({ ...state, flag1: false, flag2: false, address: '', city: '', pincode: '', states: '', country: '' })
        }
        else {
            seterrors("Enter All fields")
        }
    }

    // this is for validation 
    const handler = (event) => {
        const { name, value } = event.target;
        let error = ''
        switch (name) {
            case "address":
                error = regForAddress.test(value) ? "" : "Invalid Address";
                seterrors(error);
                break;

            case "pincode":
                error = regForPincode.test(value) ? "" : "Invalid Pincode";
                seterrors(error);
                break;

            case "city":
                error = regForName.test(value) ? "" : "Invalid City";
                seterrors(error);
                break;

            case "states":
                error = regForName.test(value) ? "" : "Invalid State";
                seterrors(error);
                break;

            case "country":
                error = regForName.test(value) ? "" : "Invalid Country Name";
                seterrors(error);
                break;
        }
        setstate({ ...state, [name]: value })
    }

    // this will run when we click on edit address just to open modal with data
    const editAddress = (ele, index) => {
        seterrors('');
        setstate({ ...state, flag1: true, flag2: false, index: index, address: ele.address, city: ele.city, pincode: ele.pincode, states: ele.states, country: ele.country })
    }

    // this will update the address
    const updateAddress = () => {
        if (state.address != '' && state.city != '' && state.pincode != '' && state.states != '' && state.country != '') {

            let data = state.addresses
            let formData = {
                address: state.address,
                city: state.city,
                pincode: parseInt(state.pincode),
                states: state.states,
                country: state.country
            }
            data[state.index] = formData
            setstate({ ...state, addresses: data })
            addAddressService({ data: state.addresses, email: add.email })
                .then(res => {
                    localStorage.setItem("_token", res.data.token);
                })
            setstate({ ...state, address: '', city: '', pincode: '', states: '', country: '', flag1: false, flag2: false })
        }
        else{
            seterrors("Enter All Fields")
        }
    }

    // this will delete the address with the help of index
    const deleteaddress = (index) => {
        let data = state.addresses
        data.splice(index, 1)

        setstate({ ...state, addresses: data }, () => console.log("deleteddd"))
        addAddressService({ data: data, email: add.email })
            .then(res => {
                localStorage.setItem("_token", res.data.token);
            })
    }

    return (
        <>
            <div className='my-4 d-flex justify-content-center'>
                <Card style={{ backgroundColor: '#343a40', width: "80%" ,maxHeight:'80vh',overflow:'auto', borderRadius: " 10px"}}>
                    <Card.Body>
                        <Card.Title className='text-white text-center' style={{fontSize:"1.8rem"}}>
                            Addresses
                        </Card.Title>
                        <hr />

                        {state.addresses.map((ele, index) =>
                            <Card className='my-3'>

                                <Card.Body>
                                    <div className='row'>
                                        <div className='col' style={{fontFamily:"Bree Serif', serif"}}>
                                            <Card.Text>
                                                <h5>{ele.address},</h5>
                                                <h6>{ele.city} - {ele.pincode},</h6>
                                                <h6>{ele.states} - {ele.country}</h6>
                                            </Card.Text>
                                        </div>

                                        <div className='col'>
                                            <div className='text-right'>
                                                <EditIcon className='mx-2' onClick={() => editAddress(ele, index)} />
                                                <CancelIcon onClick={() => deleteaddress(index)} />
                                            </div>
                                        </div>
                                    </div>

                                </Card.Body>
                            </Card>
                        )}
                        <hr />
                        <Button variant="primary" className='button_fun mx-auto' onClick={() => setstate({ ...state, flag1: true, flag2: true })}>Add New Address</Button>
                    </Card.Body>
                </Card>
            </div>

            <Modal show={state.flag1} onHide={handleClose}>
                <Modal.Header >
                    <Modal.Title>Edit Address</Modal.Title>
                    <IoCloseCircle onClick={handleClose} className="close" style={{ width: "5rem", height: "4rem" }} />
                </Modal.Header>

                <Modal.Body>
                    {errors.length != 0 &&
                        <Alert severity="error">{errors}</Alert>}
                    Address :
                    <input type="text" className='form-control' name='address' value={state.address} onChange={handler} />
                    City :
                    <input type="text" className='form-control' name='city' value={state.city} onChange={handler} />

                    Pincode :
                    <input type="text" className='form-control' name='pincode' value={state.pincode} onChange={handler} />

                    State :
                    <input type="text" className='form-control' name='states' value={state.states} onChange={handler} />

                    Country :
                    <input type="text" className='form-control' name='country' value={state.country} onChange={handler} />
                </Modal.Body>
                <Modal.Footer>
                    {state.flag2 ?
                        <Button className='button_fun' variant="primary" onClick={() => addAddress()}>Save</Button>
                        :
                        <Button className='button_fun' variant="primary" onClick={() => updateAddress()}>Update</Button>
                    }
                </Modal.Footer>
            </Modal>

        </>
    )
}