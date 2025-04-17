import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	name:{
  type:String,
  required:[true,"please enter your name"]
  },
  email:{
  type:String,
  required:[true,"please enter your email"],
  unique:true
  },
  password:{
	type:String,
  required:[true,"please enter your password"]
  },
  profileImage:{
  type:String,
  default:"https://api.dicebear.com/7.x/avataaars/svg?seed=hello"
  }
},{timestamps:true})

export const User = mongoose.model("User",UserSchema)