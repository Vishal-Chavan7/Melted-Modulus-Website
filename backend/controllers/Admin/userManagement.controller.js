import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import User from "../../models/user.model.js";

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken");
    return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});


const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).select("-password -refreshToken");
    if(!user){
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});


const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, role } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (role !== undefined) updateData.role = role;

    const user = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true },
    ).select("-password -refreshToken");
    if(!user){
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (id === req.user._id.toString()) {
        throw new ApiError(400, "Admin cannot delete own account");
    }

    const user = await User.findByIdAndDelete(id).select("-password -refreshToken");
    if(!user){
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, user, "User deleted successfully"));
});

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (id === req.user._id.toString()) {
        throw new ApiError(400, "Admin cannot block own account");
    }

    const user = await User.findByIdAndUpdate(
        id,
        { isBlocked: true },
        { new: true },
    ).select("-password -refreshToken");

    if(!user){
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User blocked successfully"));
});

const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id).select("-password -refreshToken");

    if(!user){
        throw new ApiError(404, "User not found");
    }

    if (!user.isBlocked) {
        return res
            .status(200)
            .json(new ApiResponse(200, user, "User is already active"));
    }

    user.isBlocked = false;
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User unblocked successfully"));
});

export { getAllUsers, getUserById, updateUser, deleteUser, blockUser, unblockUser };