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

module.exports = Router;
