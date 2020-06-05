const Router = require("express").Router();
const verifyToken = require("../../middleware/verifyToken");
const { PRIVATE_KEY_PAYMENT } = process.env;
const stripe = require('stripe')(PRIVATE_KEY_PAYMENT); 
const courseController = require("../../controller/course.controller");
const orderController = require("../../controller/order.controller");
const joinController = require("../../controller/join.controller");


Router.get("/get-payment-public-key",async(req,res,next)=>{
    const { PUBLIC_KEY_PAYMENT } = process.env;
    res.status(200).send({key:PUBLIC_KEY_PAYMENT});
});

Router.get("/secret", async(req,res,next)=>{
    try{
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1099,
            currency: 'vnd',
            metadata: {integration_check: 'accept_a_payment'},
        });
        res.status(200).send({client_secret: paymentIntent.client_secret});
    }catch(err){
        console.log(err);
        res.status(500).send({"message":"server error"});
    }

});

Router.post("/pay", async (req, res) => {
    try {

        var totalAmount=0;
        for(let i=0 ; i<req.body.cart.length;i++){
            var courseDetail = await courseController.getbyId(req.body.cart[i].idCourse);
            
            var mustPay = courseDetail.price-((courseDetail.price*courseDetail.discount)/100);
            
            if(req.body.cart[i].amount!=mustPay){
                res.status(400).send({"message":"Số tiền không hợp lệ"});
            }
            totalAmount=totalAmount+mustPay;
        }



        stripe.customers
            .create({
                name: req.body.name,
                email: req.body.email,
                source: req.body.stripeToken
            })
            .then(customer =>{
                stripe.charges.create({
                    amount: totalAmount,
                    currency: "vnd",
                    customer: customer.id
                })
            })
            .then(async() => {
                try{
                    for(let i=0;i<req.body.cart.length;i++){
                        await orderController.createOrder({
                            "idUser":req.body.idUser,
                            "idCourse":req.body.cart[i].idCourse,
                            "amount":req.body.cart[i].amount
                        });

                        await joinController.joinCourse({
                            "idUser":req.body.idUser,
                            "idCourse":req.body.cart[i].idCourse
                        });
                    }
                    res.status(200).send({"message":"payment success"});
                }catch(err){
                    res.status(500).send({"message":"Lỗi server"});
                }
            })
            .catch(err => console.log(err));
    } catch (err) {
      res.send(err);
    }
});

module.exports = Router;
