import Task from "../model/task.model.js";
import mongoose from "mongoose";
export const create = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: User Not Found",
      });
    }

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const newTask = new Task({
      user: userId,
      title,
      description,
      priority: priority || "medium",
    });

    await newTask.save();

    res.status(201).json({
      message: "Task Successfully Created",
      task: newTask,
    });
  } catch (error) {
    console.log("Error in Create Task Controller: ", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const readOne = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();

    if (!id) {
      return res.status(400).json({
        message: "Task id not provided",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID format" });
    }

    const task = await Task.findOne({ _id: id, user: userId });

    if (!task) {
      return res.status(404).json({
        message: "Task Not Found",
      });
    }

    res.status(200).json({
      message: "Task Found",
      task: task,
    });
  } catch (error) {
    console.log("Error in readOne controller: ", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const readAll = async (req, res) => {
  try {
    const id = req.user._id.toString();

    if (!id) {
      return res.status(400).json({
        message: "User id not provided",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID format" });
    }

    const tasks = await Task.find({ user: id });

    if (tasks.length === 0) {
      return res.status(404).json({
        message: "Tasks Not Found",
      });
    }

    res.status(200).json({
      message: "All Tasks Found",
      task: tasks,
    });
  } catch (error) {
    console.log("Error in readAll controller: ", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({ message: "Task ID not provided" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID format" });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No update fields provided" });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const allowedFields = [
        "title",
        "description",
        "isCompleted",
        "priority"
    ];

    for (const key in updates) {
        if (allowedFields.includes(key)){
            task[key] = updates[key];
        }
    }

    const updatedTask = await task.save();

    res.status(200).json({
        message: "Task updated successfully",
        task: updatedTask,
    })
  } catch (error) {
    console.log("Error in update controller: ", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteOne = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Task Id not provided",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid task ID format" });
        }

        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({
                message: "Task Not Found"
            })
        }

        res.status(200).json({
            message: "Task deleted successfully",
            task: deletedTask,
        });
    } catch(error){
        console.log("Error in deleteOne controller: ", error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const startTaskTimer = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.isRunning) {
      return res.status(400).json({
        message: "Task already running",
      });
    }

    task.startedAt = new Date();
    task.isRunning = true;

    await task.save();

    res.status(200).json({
      message: "Task Timer Started",
    });
  } catch (error) {
    console.log("Error in startTaskTimer controller", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const endTaskTimer = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task Not Found",
      });
    }

    if (!task.isRunning) {
      return res.status(400).json({
        message: "Task Not Started",
      });
    }

    const endTime = new Date();
    task.isRunning = false;

    const sessionTime = (endTime - task.startedAt) / 1000;

    task.totalTimeSpent += sessionTime;
    task.endedAt = endTime;
    
    task.save();

    res.status(200).json({
      message: "Timer Stopped",
      totalTimeSpent: task.totalTimeSpent,
      task,
    });
  } catch (error) {
    console.log("Error in endTaskTimer Controller: ", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
