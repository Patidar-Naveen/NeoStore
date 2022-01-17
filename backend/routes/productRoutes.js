import express from 'express';
import productModel from '../db/Product.js'
import colorModel from '../db/Color.js'
import categoryModel from '../db/Category.js'
import OrderSchema from '../db/OrderSchema.js';

const proRouter = express.Router();

proRouter.get("/fetchProductService", async (req, res) => {
    let allproduct = []
    await productModel.find().populate(["color_id", "category_id"])
        .then(pro => allproduct = pro)
    let category = []
    await categoryModel.find({}).then(pro => category = pro)
    let color = []
    await colorModel.find({}).then(pro => color = pro)
    res.json({ "color": color, "category": category, "allproduct": allproduct })
})

proRouter.get("/fetchProductDetailsService", async (req, res) => {
    await productModel.findOne(req.query).populate(["color_id", "category_id"])
        .then(pro => res.send(pro))
})

proRouter.post("/rateProductService", async (req, res) => {
    await productModel.findOneAndUpdate(req.query, { $set: { product_rating: req.body.value, rated_by: req.body.rated } }, { new: true }).populate(["color_id", "category_id"])
        .then(pro => res.send(pro))
})

proRouter.post("/applyFilterService", async (req, res) => {
    let data = req.body;
    if (data.category != "" && data.colors.length != 0) {
        productModel.find({
            category_id: data.category,
            color_id: data.colors,
        })
            .populate(["color_id", "category_id"])
            .then((product) => {
                res.json({ product });
            });
    } else if (data.category != "") {

        productModel.find({ category_id: data.category })
            .populate(["color_id", "category_id"])
            .then((product) => res.json({ product }));
    } else if (data.colors.length != 0) {

        productModel.find({ color_id: data.colors })
            .populate(["color_id", "category_id"])
            .then((product) => {
                res.json({ product })
            });
    } else {

        productModel.find()
            .populate(["color_id", "category_id"])
            .then((product) => res.json({ product }));
    }
})

proRouter.post("/placeOrderService", async (req, res) => {
    await OrderSchema.create(req.body).then(data => {
        res.json({ msg: "order Placed Succesfully !!" })
    })
})

proRouter.post('/fetchOrderService', (req, res) => {
    OrderSchema.find({ user_email: req.body.email }, (err, data) => {
        if (err) throw err
        else {
            res.send(data)
        }
    })
})

export default proRouter



// proRouter.post("/color", async (req,res)=>{
//     const color = await colorModel.create(req.body);
//     res.json({"color added": color})
// })
// proRouter.post("/addcategory", async (req,res)=>{
//     const category = await categoryModel.create(req.body);
//     res.json({"category added": category})
// })

// proRouter.post("/addproduct", async (req,res)=>{
//     const prod = await productModel.create(req.body);
//     res.json({"Product added": prod})
// })