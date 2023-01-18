import mongoose from "mongoose";

const dataBase = async (url: string) => {
  try {
    await mongoose.connect(url);
    console.log('DataBase is connected')
  } catch (error) {
    throw new Error(`Failed to connect DataBase: ${error}`);
  }
}

export default dataBase