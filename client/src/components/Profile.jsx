import { useFormik } from "formik";
import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import convertToBase64 from "../helpers/imageConvert";
import { updateUser } from "../helpers/services";
import { getUsernameFromToken } from "../helpers/token";
import { profileValidation } from "../helpers/validate";
import useFetchData from "../hooks/useFetchData";
import extend from "../styles/Profile.module.css";
import styles from "../styles/Username.module.css";

const Profile = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState();
  const username = getUsernameFromToken();
  const [{ apiData, isLoading, serverError }] = useFetchData(
    `/user/${username}`
  );
  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || "",
      lastName: apiData?.lastName || "",
      mobile: apiData?.mobile || "",
      email: apiData?.email || "",
      address: apiData?.address || "",
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || "" });
      const updateUserPromise = updateUser(values);
      toast.promise(updateUserPromise, {
        loading: <h1>Loading...</h1>,
        success: <h1>Profile's updated</h1>,
        error: <h1>Error</h1>,
      });
    },
  });

  const userLogOut = () => {
    localStorage.clear("token");
    navigate("/");
  };

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };
  if (isLoading) return <h1 className="text-2xl font-bold">Loading...</h1>;
  if (serverError)
    return <h1 className="text-2xl font-bold">{serverError.message}</h1>;
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
              Happy to join w you, {apiData?.email}
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  src={file || apiData?.profile || avatar}
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
                {...formik.getFieldProps("address")}
                placeholder="Address"
                type="text"
                className={styles.textbox}
              />
              <button className={styles.btn} type="submit">
                Update
              </button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">
                Wanna leave?{" "}
                <button onClick={userLogOut} className="text-red-500">
                  Logout
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
