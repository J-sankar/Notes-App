import mongoose from "mongoose";
import dotenv from 'dotenv'

 const connectDB = async ()=>{
    try {
      const connection = await mongoose.connect(process.env.CONNECTION)
      console.log("Database Connection Secured");
      
    }catch(err){
      console.log("ERROR: ", err);
      
    }
}

export default connectDB