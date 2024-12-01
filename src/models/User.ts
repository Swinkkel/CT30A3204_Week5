import mongoose, {Document, Schema} from "mongoose";

interface ITodo {
    todo: string;
    checked: boolean;
}

interface IUser extends Document {
    name: string;
    todos: ITodo[];
}

const todoSchema: Schema = new Schema({
    todo: {type: String, required: true},
    checked: {type: Boolean, default: false}
})

const userSchema: Schema = new Schema({
    name: {type: String, required: true},
    todos: [todoSchema],
})

const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", userSchema)

export {User}