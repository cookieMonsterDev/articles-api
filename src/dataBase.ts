import mongoose from "mongoose";

const dataBase = async (URL: string) => {
  try {
    await mongoose.connect(URL);
    console.log('DataBase is connected')
  } catch (error) {
    throw new Error(`Failed to connect DataBase: ${error}`);
  }
}

export default dataBase