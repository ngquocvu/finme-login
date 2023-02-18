import UserModel from "../model/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";

/** middlewware for verify user */
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;
    let exist = await UserModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: "Can't find user" });
    next();
  } catch (error) {
    return res.status(400).send({ error: "Authentication Error" });
  }
}

export async function getUser(req, res) {
  const { username } = req.params;
  try {
    if (!username) return res.status(404).send({ error: "Invalid username" });
    const user = await UserModel.findOne({ username });
    if (!user)
      return res.status(404).send({ error: "Could not find the user" });
    return res.status(201).send(user);
  } catch (error) {
    return res.status(500).send({ msg: error.message });
  }
}

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
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username }).select("+password");
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

export async function updateUser(req, res) {
  try {
    const { userId } = req.user;
    if (userId) {
      const body = req.body;
      UserModel.updateOne({ _id: userId }, body, (err, data) => {
        if (err) return res.status(401).send({ err });
        return res.status(201).send({ msg: "successfully updated" });
      });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}

export async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
}

export async function verifyOTP(req, res) {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return res.status(201).send({ msg: "Verify successfully" });
  }
  return res.status(401).send({ error: "Invalid OTP" });
}

export async function createResetSession(req, res) {
  if (req.app.locals.resetSession === true) {
    req.app.locals.resetSession = false;
    return res.send(201).send({ msg: "Access granted" });
  }
  return res.status(404).send({ error: "Session expired" });
}

export async function resetPassword(req, res) {
  try {
    if (!req.app.locals.resetSession)
      return res.status(404).send({ error: "Session expired" });
    const { username, password } = req.body;
    UserModel.findOne({ username })
      .then(async (user) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        return { user, hashedPassword };
      })
      .then(({ user, hashedPassword }) => {
        UserModel.updateOne(
          { username: user.username },
          { password: hashedPassword },
          function (err) {
            if (err) throw err;
            req.app.locals.resetSession = false; // reset session
            return res.status(201).send({ msg: "Record Updated...!" });
          }
        );
      })
      .catch(() => {
        return res.status(404).send({ error: "Can't find user" });
      });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}
