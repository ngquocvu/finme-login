import UserModel from "../model/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/** middlewware for verify user */

export async function register(req, res) {
  try {
    const { username, password, profile, email } = req.body;
    //check the existing user
    const existUsername = new Promise((resolve, reject) =>
      UserModel.findOne({ username }, (err, user) => {
        if (err) reject(new Error(err));
        if (user) reject({ error: "Please use unique username" });
        resolve();
      })
    );

    const existEmail = new Promise((resolve, reject) =>
      UserModel.findOne({ email }, (err, email) => {
        if (err) reject(new Error(err));
        if (email) reject({ error: "Please use unique email" });
        resolve();
      })
    );

    Promise.all([existUsername, existEmail])
      .then(() => {
        if (password) {
          bcrypt.hash(password, 10).then((hashedPassword) => {
            const user = new UserModel({
              username,
              password: hashedPassword,
              profile: profile || "",
              email,
            });

            user
              .save()
              .then((result) =>
                res.status(201).send({ msg: "User is created", user: result })
              )
              .catch((error) => res.status(500).send(error.message));
          });
        }
      })
      .catch((error) => {
        return res.status(400).send({ msg: error });
      });
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function login(req, res) {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(400).send({ msg: "incorrect" });
    }
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    return res.status(200).send({
      msg: "Login successfully",
      username: user.username,
      token: accessToken,
    });
  } catch (e) {
    res.status(500).send({ msg: e.message });
  }
}

export async function getUser(req, res) {
  res.json("login route");
}

export async function updateUser(req, res) {
  res.json("updateUser route");
}

export async function generateOTP(req, res) {
  res.json("Generate otp");
}

export async function verifyOTP(req, res) {
  res.json("Verify OTP route");
}

export async function createResetSession(req, res) {
  res.json("createResetSession OTP route");
}

export async function resetPassword(req, res) {
  res.json("resetPassword OTP route");
}
