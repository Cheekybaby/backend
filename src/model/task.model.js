import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        user : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            required: true,
        },
        isCompleted: {
            type: Boolean,
            default: false
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        },
        isRunning: {
            type: Boolean,
            default: false,
        },
        startedAt : {
            type: Date
        },
        endedAt : {
            type: Date
        },
        totalTimeSpent : {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const Task = mongoose.model( "Task", taskSchema);
export default Task;