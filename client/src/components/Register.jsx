import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import styles from "../styles/Username.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { passwordValidate } from "../helpers/validate";
import convertToBase64 from "../helpers/imageConvert";
import { registerUser } from "../helpers/services";

const Register = () => {
  const [file, setFile] = useState();
  const navigator = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || "" });
      let registerPromise = registerUser(values);
      toast.promise(registerPromise, {
        loading: "Creating...",
        success: <b>Register successfully</b>,
        error: (err) => {
          return <b>{err}</b>;
        },
      });
      registerPromise.then(() => navigator("/profile"));
    },
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex h-screen justify-center items-center">
        <div className={styles.glass} style={{ width: "45%" }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Register</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Join us
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  src={file || avatar}
                  className={styles.profile_img}
                  alt="avatar"
                />
              </label>
              <input
                onChange={onUpload}
                type="file"
                id="profile"
                name="profile"
              />
            </div>
            <div className="textbox flex flex-col justify-center items-center gap-6">
              <input
                {...formik.getFieldProps("email")}
                placeholder="Email"
                type="text"
                className={styles.textbox}
              />
              <input
                {...formik.getFieldProps("username")}
                placeholder="Username"
                type="username"
                className={styles.textbox}
              />
              <input
                {...formik.getFieldProps("password")}
                placeholder="Password"
                type="password"
                className={styles.textbox}
              />
              <button className={styles.btn} type="submit">
                Sign in
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Already Register?{" "}
                <Link to="/" className="text-red-500">
                  Login
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
