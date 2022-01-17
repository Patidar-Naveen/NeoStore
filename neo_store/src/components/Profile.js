import React, { useEffect, useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import { profileEditService, profilePicService } from "../config/Myservice";
import { useNavigate } from "react-router";
import jwtdecode from "jwt-decode";
import { IoCloseCircle } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Stack } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForName = RegExp(/^[A-Za-z]{3,30}$/);
const regForContact = RegExp(/^[6-9][0-9]{9}/);

export default function Profile() {
  const [state, setstate] = useState({ data: {}, firstname: "", lastname: "", gender: "", contact: "", email: "", profileImg: "" });
  const [show, setShow] = useState({ flag: false, count: 1 });
  const [errors, seterrors] = useState({ errfirstname: "", errlastname: "", errgender: "", errcontact: "", erremail: "", });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClose = () => setShow({ ...show, flag: false });

  useEffect(() => {
    if (localStorage.getItem("_token") != undefined) {
      let token = localStorage.getItem("_token");
      let decode = jwtdecode(token);

      setstate({ data: decode, firstname: decode.firstname, lastname: decode.lastname, gender: decode.gender, contact: decode.contact, email: decode.email, profileImg: decode.profilepic });
    }
  }, [show.count]);


  // to display the modal for taking input
  const editProfile = () => {
    setShow({ ...show, flag: true });
  };

  //updating the user profile in database
  const updateProfile = () => {
    let formData = {
      firstname: state.firstname,
      lastname: state.lastname,
      gender: state.gender,
      contact: state.contact,
      email: state.email,
      originalEmail: state.data.email
    };

    profileEditService(formData)
      .then((res) => {
        dispatch({ type: "updateProfile", payload: state.firstname + " " + state.lastname })
        localStorage.setItem("_token", res.data.token);
        setstate({ ...state, data: res.data.values });
      });
    setShow({ flag: false });
  };

  // for validation 
  const handler = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "firstname":
        let error1 = regForName.test(value) ? "" : "Invalid Name";
        seterrors({ ...errors, errfirstname: error1 });
        break;

      case "lastname":
        let error2 = regForName.test(value) ? "" : "Invalid Name";
        seterrors({ ...errors, errlastname: error2 });
        break;

      case "email":
        let error3 = regForEmail.test(value) ? "" : "Invalid Email";
        seterrors({ ...errors, erremail: error3 });
        break;

      case "contact":
        let error4 = regForContact.test(value) ? "" : "Invalid Contact";
        seterrors({ ...errors, errcontact: error4 });
        break;
    }
    setstate({ ...state, [name]: value });
  };

  // this is for updating the profile pic with multer
  const filechange = (e) => {
    const formData = new FormData()
    formData.append('profileImg', state.profileImg)
    formData.append('email', state.data.email)
    profilePicService(formData)
      .then((res) => {
        dispatch({ type: "updatePicture", payload: res.data.values.profilepic })
        localStorage.setItem("_token", res.data.token);
        setstate({ ...state, data: res.data.values });
      });
    setShow({ flag: false });
  }

  return (
    <div>
      <div className="mt-5 d-flex justify-content-center">
        <Card className="text-white" style={{ backgroundColor: "#343a40", width: "80%", borderRadius: " 10px" }}>
          <Card.Body>
            <Card.Title className="text-center">
              <h2>User's Profile </h2>
            </Card.Title>
            <Card.Text className="mt-4">

              <Grid container spacing={2} className="d-flex justify-content-start">
                <Grid item xs={5} className="pl-5">
                  <Stack spacing={2}>
                    <h5>First Name :</h5>
                    <h5>Last Name :</h5>
                    <h5>Gender :</h5>
                    <h5>Contact No. :</h5>
                    <h5>Email :</h5>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack spacing={2}>
                    <h5>{state.data.firstname}</h5>
                    <h5>{state.data.lastname}</h5>
                    {state.data.gender == 'undefined' ? 
                    <h5>Not Specified</h5>
                    :
                    <h5>{state.data.gender}</h5>}
                    {state.data.contact == 9999999999 ? 
                    <h5>Not Specified</h5>
                    :
                    <h5>{state.data.contact}</h5>}
                    <h5>{state.data.email}</h5>
                  </Stack>
                </Grid>

              </Grid>
              <div className="mt-3" style={{ paddingLeft: "25%" }}>
                <Button onClick={() => editProfile()}><EditIcon fontSize="25" /> Edit</Button>
              </div>
            </Card.Text>

          </Card.Body>
        </Card>
      </div>

      <Modal show={show.flag} onHide={handleClose} className="bg-dark">
        <Modal.Header style={{ backgroundColor: "black", color: 'white' }}>
          <Modal.Title >Edit Profile</Modal.Title>
          <IoCloseCircle
            onClick={handleClose}
            className="close button_fun"
            style={{ width: "5rem", height: "4rem", color: 'white' }}
          />
        </Modal.Header>

        <Modal.Body style={{ backgroundColor: "black", color: 'white' }}>
          <Card.Text>
            <div className="row">
              <div className="col">
                First Name :{" "}
                <input type="text" className='form-control' name="firstname" value={state.firstname} onChange={handler} />
                <span className="text-danger">{errors.errfirstname}</span>
              </div>
              <div className="col">
                Last Name :{" "}
                <input type="text" className='form-control' name="lastname" value={state.lastname} onChange={handler} />
                <span className="text-danger">{errors.errlastname}</span>
              </div>
            </div>
            <div className="my-2">
              Email :{" "}
              <input type="text" className='form-control' name="email" value={state.email} onChange={handler} />
              <span className="text-danger">{errors.erremail}</span>
            </div>
            <div className="my-2">

              Contact Number :{" "}
              <input type="text" className='form-control' name="contact" value={state.contact} onChange={handler} />
              <span className="text-danger">{errors.errcontact}</span>
            </div>
            <div className="my-2">

              Gender : &nbsp;
              <input type="radio" id="male" name="gender" value="male" onClick={handler} />{" "}
              <span className="mr-3"> Male</span>
              <input type="radio" id="female" name="gender" value="female" onClick={handler} />{" "}
              <span className="mr-3"> Female</span>
            </div>
            <div className="my-2 text-center">
              <Button style={{ marginTop: "5px" }} className='button_fun px-3' onClick={() => updateProfile()}>Save Changes</Button>

            </div>

            <div className="my-3">
              Profile Picture :{" "}
              <input type="file" className='form-control' onChange={(e) => setstate({ ...state, profileImg: e.target.files[0] })} name="profilepic" />
            </div>
            <div className="my-3 text-center">
              <Button style={{ marginTop: "5px" }} className='button_fun px-3' onClick={() => filechange()}>Update Profile Picture</Button>
            </div>
          </Card.Text>

        </Modal.Body>
      </Modal>
    </div>
  );
}