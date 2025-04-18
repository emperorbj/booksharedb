import {User} from "../models/user.model.js"
import {StatusCodes} from "http-status-codes"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/getToken.js"





export const register = async (request,response)=>{
	const {name,email,password} = request.body;
  try{
  	if(!name || !email || !password){
		return response.status(401).json({success:false,message:"all fields are required"})
    }

	const userExists = await User.findOne({email})

	if(userExists){
		return response.status(409).json({message:"user already exists"})
	}

	const hashedPassword = await bcrypt.hash(password,10)

	const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`

	const user = new User({
		name,
		email,
		password:hashedPassword,
		profileImage
	})

	await user.save()

	const token = generateToken(user._id)

  	return response.status(201).json({success:true,token ,user:{
		id:user._id,
		name:user.name,
		email:user.email,
		profileImage:user.profileImage
	}})
  }catch(error){
  	return response.status(500).json({message:"something went wrong",error:error.message}) 
  }
}




export const login = async (request,response)=>{
	const {email,password} = request.body
try{
	if(!email || !password) {
  return response.status(400).json({message:"all fields are required"})
  }
  
  const user = await User.findOne({email})
  if(!user){
  return response.status(409).json({message:"user does not exist or wrong email"})
  }
  
  const verifyPassword = await bcrypt.compare(password,user.password)
  
  if(!verifyPassword){
		return response.status(400).json({message:"password is invalid"})
	  }
  
  const token = generateToken(user._id)
  await user.save()
  return response.status(200).json({success:true,token ,user:{
	id:user._id,
	name:user.name,
	email:user.email,
	profileImage:user.profileImage
}})
}catch(error){
	return response.status(500).json({success:false,message:error.message})
}
}