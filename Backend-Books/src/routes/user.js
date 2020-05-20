const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');
const multer = require('multer');
const auth = require('../middlewares/auth')
const router = new express.Router();
const sharp = require('sharp');

const storage = multer.diskStorage(
    {
        destination: "users-images",
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }
)

const fileFilter = function (req, file, cb) {
    if (!file.mimetype === "image/png" || !file.mimetype === "image/jpeg" || !file.mimetype === "image/jpg") {
        cb("Please Upload Image File", false);
    }
    else {
        cb(null, true);
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2
    },
    fileFilter: fileFilter
});



router.post('/users', upload.single('avatar'), async (req, res) => {
    try {
        const avatarPath = req.file.path;
        const user = new User({
            ...req.body,
            avatar: avatarPath
        });

        const nuser = await user.save();
        const token = await user.generateAuthToken();

        if (!nuser) {
            return res.status(400).send();
        }
        nuser.avatar = nuser.avatar.replace("users-images\\", "http://localhost:3000/users-images/")

        res.status(201).send({ user: nuser, token });

    }
    catch (error) {
        res.status(500).send(error);
    }
})



router.post('/users/login', async (req, res) => {
    const user = await User.findByCredentails(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    if (!user) {
        res.status(400).send();
    }
    res.send({ user, token });
})

router.post('/users/logout', auth, async (req, res) => {
    console.log("This is Token", req.token)
    try {
        console.log("I m IN")
        req.user.tokens = req.user.tokens.filter(token => {
            return !token.token === req.user.token
        })

        await req.user.save();
        res.send();
    }
    catch (error) {
        res.status(500).send(error);
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }
    catch (error) {
        res.status(500).send(error);
    }
})



module.exports = router;