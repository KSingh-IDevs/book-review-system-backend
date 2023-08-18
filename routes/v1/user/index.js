const express = require("express");
const router = express.Router();
const userController = require('../../../controllers/user.controller')
const userAuth = require('../../../middlewares/user.auth')

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/logout', userAuth, userController.logout);

module.exports = router