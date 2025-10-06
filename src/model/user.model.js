import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            default: "User101",
        },
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: "",
        },
        profilePic: {
            type: String,
            default: "",
        }
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);
export default User;