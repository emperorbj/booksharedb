// import { User } from "../models/user.model.js"
// import jwt from "jsonwebtoken"


// export const verifyToken = async (request,response,next) => {

//   try{
//   const token = request.header("Authorization").replace("Bearer ","")
//   if(!token) {
//    return response.status(401).json('invalid token or not available')
//   }
 
//   const decoded = jwt.verify(token,process.env.JWT_SECRET)
  
//   if(!decoded){
//   	return response.status(401).json('wrong token')
//   }
  
//   const user = await User.findById(decoded.userId).select("-password")
//   if(!user){
//   	return response.status(401).json('user not found')
//   }

//   // this request.user will be used in the controllers
//   // especially the createBook controller
//   request.user = user
//   next()
  
//   }
//   catch (error) {
//         console.log("Error in verifying token",error);
//         response.status(500).json({success:false,message:`Error in verifying token ${error.message}`})
        
//     }
// }


import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyToken = async (request, response, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = request.header("Authorization");
    if (!authHeader) {
      return response.status(401).json({ success: false, message: "Authorization header missing" });
    }

    // Extract token by removing "Bearer " prefix
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return response.status(401).json({ success: false, message: "Invalid token or not available" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return response.status(401).json({ success: false, message: "Wrong token" });
    }

    // Find user by ID and exclude password
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return response.status(401).json({ success: false, message: "User not found" });
    }

    // Attach user to request object
    request.user = user;
    next();
  } catch (error) {
    console.log("Error in verifying token", error);
    response.status(500).json({ success: false, message: `Error in verifying token: ${error.message}` });
  }
};