import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide username"],
    unique: [true, "Username exists"],
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    unique: false,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: false,
  },
  firstName: String,
  lastName: String,
  mobile: String,
  profile: String,
  address: String,
});

export default mongoose.model("User", UserSchema);
