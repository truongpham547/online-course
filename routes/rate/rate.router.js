const Router = require("express").Router();
const verifyToken = require("../../middleware/verifyToken");
const rateDetailController = require("../../controller/rateDetail.controller");


Router.post("/create-rate", async (req, res) => {
    try {
        let rate = await rateDetailController.createRate(req.body);
        res.status(200).send(rate);
    } catch (err) {
        console.log('err',err);
      res.status(500).send(err);
    }
});

Router.get("/get-rate-by-user/:idUser", async (req, res) => {
    try {
        let rates = await rateDetailController.getRateByIdUser(req.params.idUser);
        res.status(200).send(rates);
    } catch (err) {
        console.log('err',err);
      res.status(500).send(err);
    }
});

Router.get("/get-rate-by-course/:idCourse", async (req, res) => {
    try {
        let rates = await rateDetailController.getRateByIdCourse(req.params.idCourse);
        res.status(200).send(rates);
    } catch (err) {
        console.log('err',err);
      res.status(500).send(err);
    }
});



module.exports = Router;
