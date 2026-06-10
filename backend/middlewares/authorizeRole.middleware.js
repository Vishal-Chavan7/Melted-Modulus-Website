import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const authorizeRole = (...roles) =>{
    return asyncHandler(async (req, res, next) => {
        const userRole = req.user?.role;

        if(!userRole){
            throw new ApiError(401, 'Unauthorized: Please login first');
        }

        if(!roles.includes(userRole))
        {
            throw new ApiError(403, 'Forbidden: You are not authorized to access this resource');
        }
        next();
    });
};

export default authorizeRole;