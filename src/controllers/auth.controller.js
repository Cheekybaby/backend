import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const emailNormalized = email.trim().toLowerCase();

        if (!email || !password) {
            return res.status(401).json({
                message: "All fields are required"
            });
        }

        if (password.length < 6 || password.length > 15){
            return res.status(401).json({
                message: "Password must be between 6 to 15 characters"
            });
        }

        const user = await User.findOne({email});

        if (!user){
            res.status(401).json({
                message: "Invalid Credentials"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect){
            res.status(401).json({
                message: "Invalid Credentials"
            });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
            profilePic: user.profilePic
        });
    } catch(error){
        console.error("Error in login controller: ", login);
        res.send(500).json({
            message: "Internal Server Error",
        });
    }
}

export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const emailNormalized = email.trim().toLowerCase();

        console.log("This is the password: ", password)

        if (!fullName || !emailNormalized || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        if (password.length < 6 || password.length > 15){
            return res.status(400).json({
                message: "Password must be between 6 to 15 characters",
            })
        }

        const user = await User.findOne( {email} );
        
        if(user) {
            return res.status(400).json({
                message: "User Already Exists",
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User ({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            await newUser.save();
            generateToken(newUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                fullName,
                email,
            });
        } else {
            return res.status(400).json({
                message: "Invalid User Data",
            });
        }
    } catch(error){
        console.error("Error in signup controller: ", error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({
            message: "Signout Successful!",
        })
    } catch(error){
        console.log("Error in signout controller: ", error);
        res.status(500).json({
            message: "Internal Server Error",
        })
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch(error){
        console.log("Error in checkAuth controller: ", error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}