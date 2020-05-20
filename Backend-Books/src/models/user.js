const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Please Provide Valid Email");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: "true",
        minlength: 7,
        validate(value) {
            if (value.includes("password")) {
                throw new Error("Should not contain 'password' Keyword");
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Please Provide a Positive Number")
            }
        }
    },
    avatar: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})


userSchema.methods.generateAuthToken = async function (next) {
    const user = this;
    const token = await jwt.sign({ _id: user._id.toString() }, "booksproject")
    user.tokens = user.tokens.concat({ token });
    const nuser = await user.save();
    return token
}

userSchema.methods.toJSON = function (req, res, next) {
    const user = this;
    const userObject = user.toObject();
    delete userObject.tokens
    delete userObject.password
    return userObject
}


userSchema.statics.findByCredentails = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Unable to LogIn")
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new Error("Unable to Login")
    }
    return user;
}

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
})

const User = mongoose.model('User', userSchema);



module.exports = User;