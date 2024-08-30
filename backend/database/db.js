import mongoose from 'mongoose'

export const dbconnect = async()=>{
    try{
    await mongoose.connect('your_Mongo DB URL'))}
    catch (error)
    {
        console.log("Error connection to Database",error.message);
        process.exit(1); //failure 
    }
}
