const express = require("express");
const { metaController } = require("../controllers/meta.controller");

const metaRouter = express.Router();
metaRouter.get("/get-all", metaController.getAllMetaData);
module.exports = { metaRouter };
