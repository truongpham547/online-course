var express = require("express");
var Router = express.Router();

Router.get("/say-hello", function(req, res, next) {
  res.status(200).send({ message: "hello world" });
});

Router.use("/course", require("./course/course.router.js"));
Router.use('/',require('./admin/index.router.js'));
Router.use('/',require('./user/index.router.js'));
Router.use('/',require('./authenticate/authenticate.js'));

module.exports = Router;
