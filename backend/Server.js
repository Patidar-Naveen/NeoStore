import express from 'express';
import  cors from'cors';
import postRoutes from './routes/postRoutes.js'
import productRouter from './routes/productRoutes.js'
import {connectdb} from './config/connection.js'
const PORT = 5000
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())
app.use("/posts",postRoutes)
app.use("/products",productRouter)
app.use("../neo_store/public/images/", express.static("public"));

connectdb();
app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`working on ${PORT}`)
})