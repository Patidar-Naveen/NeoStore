import express from 'express';
import registerModel from '../db/RegisterSchema.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import multer from "multer"
const saltRounds = 10
const jwtSecret = "asd889asds5656asdas887";
const router = express.Router();
const DIR = '../neo_store/public/images/';

let transporter = nodemailer.createTransport({
    service: 'gmail',
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: 'novydevyjones@gmail.com',
        pass: 'Novy@251139'
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null,"user" + '-' + fileName + '-' +Date.now())
    }
});

let upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
})

router.post("/userRegService", async (req, res) => {
    console.log(req.body)
    req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
    registerModel.findOne({ email: req.body.email }, (err, data) => {
        if (err) {
            res.json({ "err": 1, "msg": "Something went wrong in checking data" })
        }
        else if (data == null) {
            let ins = new registerModel({ firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, contact: req.body.contact, password: req.body.password, gender: req.body.gender })
            ins.save((e) => {
                if (e) {
                    res.json({ "err": 1, "msg": "Something went wrong in adding data" })
                }
                else {
                    res.json({ "err": 0, "msg": "New User added" })
                }
            })
        }
        else {
            res.json({ "err": 0, "msg": "User already exist" })
        }
    })
})

router.post("/userLogService", (req, res) => {
    let hashbcrypt = false
    registerModel.find({}, (err, data) => {
        if (err) {
            console.log(err, "line 38")
        }
        else {
            for (let i = 0; i < data.length; i++) {
                if (data[i].email === req.body.email) {
                    hashbcrypt = bcrypt.compareSync(req.body.password, data[i].password)
                    if (hashbcrypt) {
                        const token = encryptData(data[i]);
                        res.json({ "err": 0, "msg": "Login Success", "token": token })
                        break;
                    }
                }
            }
            if (!hashbcrypt) {
                res.json({ "err": 1, "msg": "Email or Password does not Match" })
            }
        }
    })
})

router.post("/forgetPassService", (req, res) => {
    let otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
    registerModel.findOneAndUpdate({ email: req.body.email }, ({ $set: { OTP: otp } }), (err, data) => {
        if (err) {
            console.log("line 61")
        }
        else if (data == null) {
            res.json({ "err": 1, "msg": "User Not Found" })
        }
        else {


            let mailOptions = {
                from: 'harshk6300@gmail.com',
                to: req.body.email,
                subject: "NeoSTORE Password Reset",
                html: `<!DOCTYPE html>
                <html>
                <head>
                <style>
                .ot{
                    color:red;
                    font-weight: bold;
                }
                .n{
                    font-weight: bold;
                    font-size: 20px;
                }
                .ot1{
                    font-weight: bold;
                    color:red;
                    font-size: 25px;
                }
                </style>
                </head>
                <body>
                <h1>Neo<span class="ot1">STORE</span></h1>
                <hr/>
                Hello <span class="n"> ${data.firstname + ' ' + data.lastname} </span>,
                <div>A password reset for your account was requested.</div>
               <div> Your OTP for Neo<span class="ot">STORE</span> password reset is <span class="ot1">${otp}</span> </div>
               <div>Note that this OTP is valid for 24 hours. After the time limit has expired, you will have to resubmit the request for a password reset.</div> <br/>
               <div>If you did not make this request, please Contact Us. </div>
                </body>
    </html>`
            }

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log('Email sent: ' + info.response);
                }
            })
            res.json({ "err": 0, "msg": "OTP sent Succesfully" })

        }
    })
})

router.post("/resetPassService", (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
    registerModel.findOne({ email: req.body.email }, (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            if (data.OTP == req.body.otp) {
                registerModel.updateOne({ email: req.body.email }, { $set: { password: req.body.password } }, (err, data) => {
                    if (err) throw err;
                    else {
                        res.json({ "err": 0, "msg": "Password Successfullyyy reset" })
                    }
                })
            }
            else{
                res.json({ "err": 1, "msg": "OTP doesn't match" })

            }
        }
    })

})

router.post("/profileEditService", (req, res) => {
    registerModel.findOneAndUpdate({ email: req.body.originalEmail },
        {
            $set: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                gender: req.body.gender,
                contact: req.body.contact,
                email: req.body.email
            }
        }, { new: true }, (err, data) => {
            if (err) throw err;
            else {
                const token = encryptData(data);
                res.json({ "err": 0, "msg": "Address added", "token": token,"values":data })
            }
        })
})

router.post("/profilePicService", upload.single('profileImg'), (req,res) =>{
    console.log(req.file.filename, "line 175")
    registerModel.findOneAndUpdate({email: req.body.email}, 
    {$set: {
        profilepic: req.file.filename}},{new:true},(err,data)=>{
            if(err) throw err;
            else{
                console.log(data, "line 197")
                const token = encryptData(data);
                res.json({"err":0,"msg":"Profile Pic Updated","token":token, "values":data})
            }
        }) 
})

router.post("/addAddressService", (req, res) => {
    console.log(req.body, "line 162")
    // let useremail = req.params.email
    registerModel.findOneAndUpdate({ email: req.body.email }, { $set: { addresses: req.body.data } }, { new: true }, (err, data) => {

        if (err) {
            console.log(err)
        }
        else {
            const token = encryptData(data);
            res.json({ "err": 0, "msg": "Address added", "token": token })
        }
    })
})

router.post("/changePaswordService",(req,res)=>{
    req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
    registerModel.findOneAndUpdate({email:req.body.email}, {$set:{password:req.body.password}},{new:true},(err, data)=>{
        if(err){
            res.json({"err":1, "msg":"Something went wrong in checking data"})
        }
        else{
            const token = encryptData(data);
            res.json({"err":0,"msg":"Password updated successfully!!","token":token})
        }
    })
})

router.post("/cartSaveService",(req,res)=>{

   registerModel.findOneAndUpdate({email:req.body.email}, {$set:{cart:req.body.data}},{new:true}, (err,data)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log(data)
            const token = encryptData(data);
            res.json({"err":0,"msg":"cart added","token":token})
        }

    })
})

router.post("/emailSubscribeService", (req, res) => { 
    let mailOptions = {
        from:'novydevyjones@gmail.com',
        to:req.body.email,
        subject:"Subscription",
        text:"Thankyou for Subscribing!!!!!"
    }
    transporter.sendMail(mailOptions, function(error,info){
        if(error) {
            console.log(error)
        }
        else{
            console.log('Email sent: '+info.response); 
        }
    })
    res.json({"err":0, "msg":"Email Send successfully"})
})
const encryptData = (data) => {
    let pay = {
        ...data._doc
    }
    const token = jwt.sign(pay, jwtSecret, { expiresIn: 360000 })
    return token;
}


export default router