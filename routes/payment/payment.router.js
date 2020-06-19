const Router = require("express").Router();
const verifyToken = require("../../middleware/verifyToken");
const env = require('dotenv').config();
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

        // var totalAmount=0;
        // for(let i=0 ; i<req.body.cart.length;i++){
        //     console.log(req.body.cart[i].idCourse);

        //     var courseDetail = await courseController.getbyId(req.body.cart[i].idCourse);
        //     console.log(courseDetail);
        //     var mustPay = courseDetail.price-((courseDetail.price*courseDetail.discount)/100);
        //     mustPay = Math.round(mustPay);
        //     if(Math.round( req.body.cart[i].amount) !=mustPay){
        //         res.status(400).send({"message":"Số tiền không hợp lệ"});
        //     }
        //     totalAmount=totalAmount+mustPay;
        // }


        // for(let i=0;i<req.body.cart.length;i++){
        //     await orderController.createOrder({
        //         "idUser":req.body.idUser,
        //         "idCourse":req.body.cart[i].idCourse,
        //         "amount":Math.round(req.body.cart[i].amount)
        //     });

        //     await joinController.joinCourse({
        //         "idUser":req.body.idUser,
        //         "idCourse":req.body.cart[i].idCourse
        //     });
        // }


        // stripe.customers
        //     .create({
        //         name: req.body.name,
        //         email: req.body.email,
        //         source: req.body.stripeToken
        //     })
        //     .then(customer =>{
        //         console.log('sadf;lsd;fk1');
        //         stripe.charges.create({
        //             amount: totalAmount,
        //             currency: "vnd",
        //             customer: customer.id
        //         })
        //     })
        //     .then(async() => {
        //         console.log('sdklfd;lkgd;f2');
        //         try{

        //             res.status(200).send({"message":"payment success"});
        //         }catch(err){
        //             res.status(500).send({"message":"Lỗi server"});
        //         }
        //     })
        //     .catch(err => console.log(err));

        // stripe.charges.create({
        //     amount:9000,
        //     source:req.body.stripeTokenId,
        //     currency:'usd'
        // }).then(()=>{
        //     console.log('paySuccess');
        // }).catch(()=>{
        //     console.log('pay false');
        // })
        var totalAmount=0;
        console.log(req.body);
        for(let i=0 ; i<req.body.cart.length;i++){
            var courseDetail = await courseController.getbyId(req.body.cart[i]._id);
            var mustPay = courseDetail.price-((courseDetail.price*courseDetail.discount)/100);
            mustPay = Math.round(mustPay);
            totalAmount=totalAmount+mustPay;
        }

        const { token, cart, idUser }  = req.body;
        const customer = await stripe.customers.create({
            email : token.email,
            source : token.id
        });

        const charges = await stripe.charges.create({
            amount : totalAmount,
            currency : 'vnd',
            customer : customer.id,
            receipt_email : token.email,
            description : 'mua khoa hoc',
            shipping : {
                name : token.card.name,
                address : {
                    line1 : token.card.address_line1,
                    city : token.card.address_city,
                    country : token.card.address_country,
                    postal_code : token.card.address_zip
                }
            }, 
        });
        // console.log(charges);
       

        for(let i=0;i<req.body.cart.length;i++){
            await orderController.createOrder({
                "idUser":req.body.idUser,
                "idCourse":req.body.cart[i]._id,
                "amount": totalAmount
            });

            await joinController.joinCourse({
                "idUser":req.body.idUser,
                "idCourse":req.body.cart[i]._id
            });
        }
        res.status(200).send({ success : true, message : 'mua khóa học thành công!'});

    } catch (err) {
        console.log('err',err);
      res.status(500).send(err);
    }
});

module.exports = Router;