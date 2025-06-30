import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    email: string,
    password: string,
    _id?: mongoose.Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date,
}

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: true,
        }
    },
    {timestamps: true}
);

userSchema.pre("save", async function (next) { // use pre hook to do some task just before the condition ** .pre is a hook **
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

const User = models?.User ||  model<IUser>("User", userSchema)
// as nextjs runs on edge there might be a model named User but the current edge is still creating one 
// to avoid that models?.User is used as models will fetch all models from the db here we are asking for model User so it will give us the model named User if it already exist ?. this is used to find if exist 
// if no model named User is found then create a model named User with the interface of <Iuser> defining the types 
export default User
