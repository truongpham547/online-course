var express = require("express");
const path = require('path');
var Router = express.Router();

Router.get("/say-hello", function(req, res, next) {
  res.status(200).send({ message: "hello world" });
});
Router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '../public/index.html'));
})

Router.use("/lesson", require("./lesson/lesson.router.js"));
Router.use("/course", require("./course/course.router.js"));
Router.use('/category',require('./category/category.router.js'));
Router.use('/join',require("./join/join.router"));
Router.use('/comment',require("./comment/comment.router"));
Router.use('/payment',require("./payment/payment.router"));
Router.use('/order',require("./order/order.router"));
Router.use('/rate',require("./rate/rate.router"));
Router.use('/',require('./user/index.router.js'));
Router.use('/',require('./authenticate/authenticate.js'));




module.exports = Router;
