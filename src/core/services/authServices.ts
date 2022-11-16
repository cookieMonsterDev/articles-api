import { userModel } from "../schemas/userSchema"

interface UserTypes {
  username: string
}

export const createUserSevice = async (body: UserTypes) => {
  try {
    const newUser = new userModel({
      username: body.username
    })

    const res = await newUser.save();

    return res
  }
  catch(error) {
    throw new Error(`Sth went wrong`)
  }
}