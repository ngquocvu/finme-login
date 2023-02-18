import { useFormik } from "formik";
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import avatar from "../assets/profile.png";
import convertToBase64 from "../helpers/imageConvert";
import { passwordValidate } from "../helpers/validate";
import extend from "../styles/Profile.module.css";
import styles from "../styles/Username.module.css";

const Profile = () => {
  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || "" });
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
        <div
          className={`${styles.glass} ${extend.glass}`}
          style={{ width: "45%" }}
        >
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Profile</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Happy to join you
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  src={file || avatar}
                  className={`${styles.profile_img} ${extend.profile_img}`}
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
              <div className="name flex w-3/4 gap-10">
                <input
                  {...formik.getFieldProps("firstName")}
                  placeholder="First name"
                  type="text"
                  className={`${styles.textbox} ${extend.textbox}`}
                />
                <input
                  {...formik.getFieldProps("lastName")}
                  placeholder="Last name"
                  type="text"
                  className={`${styles.textbox} ${extend.textbox}`}
                />
              </div>
              <div className="name flex w-3/4 gap-10">
                <input
                  {...formik.getFieldProps("mobile")}
                  placeholder="Mobile"
                  type="text"
                  className={`${styles.textbox} ${extend.textbox}`}
                />
                <input
                  {...formik.getFieldProps("email")}
                  placeholder="Email"
                  type="text"
                  className={`${styles.textbox} ${extend.textbox}`}
                />
              </div>
              <input
                {...formik.getFieldProps("adress")}
                placeholder="Adress"
                type="text"
                className={styles.textbox}
              />
              <button className={styles.btn} type="submit">
                Log out
              </button>
            </div>

            <div className="text-center py-4"></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
