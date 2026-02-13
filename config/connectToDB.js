import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

const password = process.env.MONGODB_PASSWORD
const mongoDbUri = process.env.MONGODB_URI.replace("<db_password>",password)

const connectToDb = async () => {
    try {
        console.log(mongoDbUri);
        
        const connected = await mongoose.connect(mongoDbUri)
        if (connected) {
            console.log("MongoDB Connected ✅😁");
            
        }
    } catch (error) {
        console.log(error);
        
    }
}

export default connectToDb