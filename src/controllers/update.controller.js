import User from "../model/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";

export const updateUserName = async (req, res) => {
  try {
    const id = req.user._id.toString();

    const { userName: newUserName } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID not provided" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    if (!newUserName || newUserName.trim() === "") {
      return res.status(400).json({ message: "No updates provided" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { userName: newUserName.trim() },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      message: "Username updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error in updateUser Controller: ", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateFullName = async (req, res) => {
  try {
    const id = req.user._id.toString();

    const { fullName: newFullName } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID not provided" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    if (!newFullName || newFullName.trim() === "") {
      return res.status(400).json({ message: "No updates provided" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { fullName: newFullName.trim() },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Full Name Updated Successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error in updateUser Controller: ", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const id = req.user._id.toString();

    const { pokemonName } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID not provided" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    if (!pokemonName || pokemonName.trim() === "") {
      return res.status(400).json({ message: "No update fields provided" });
    }

    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Pokemon Not Found");
    }

    const data = await response.json();

    const avatarUrl =
      data.sprites.other?.["official-artwork"]?.front_default ||
      data.sprites.front_default;

    if (!avatarUrl) {
      return res
        .status(400)
        .json({ message: "No image available for this Pokémon" });
    }

    const updatedUser = await User.findByIdAndUpdate(
        id,
        { avatar: avatarUrl },
        {new: true, runValidators: true}
    ).select("-password");

    res.status(200).json({
        message: "Avatar Updated Successfully",
        user: updatedUser
    });
  } catch (error) {
    console.log("Error in updateUser Controller: ", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    const id = req.user._id.toString();
    const { profilePic } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID not provided" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    if (!profilePic) {
      return res.status(400).json({ message: "No update fields provided" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    if (!uploadResponse?.secure_url) {
      return res.status(500).json({ message: "Failed to upload image" });
    }

    const updatedUser = await User.findByIdAndUpdate(
        id,
        { profilePic: uploadResponse.secure_url },
        {new: true, runValidators: true}
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        message: "Profile Picture Updated Successfully",
        user: updatedUser
    })

  } catch (error) {
    console.log("Error in updateUser Controller: ", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
