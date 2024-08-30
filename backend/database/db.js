import mongoose from 'mongoose'

export const dbconnect = async()=>{
    try{
    await mongoose.connect('mongodb+srv://djain01d:OGtHfCAqzMheYs7k@cluster0.gy2tx.mongodb.net/auth_db?').then(()=>console.log('DB Connected'))}
    catch (error)
    {
        console.log("Error connection to Database",error.message);
        process.exit(1); //failure 
    }
}