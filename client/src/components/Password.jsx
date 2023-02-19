import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import styles from "../styles/Username.module.css";
import { toast, Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { passwordValidate } from "../helpers/validate";
import useFetchData from "../hooks/useFetchData";
import { useAuthStore } from "../store/store";
import { verifyPassword } from "../helpers/services";

const Password = () => {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetchData(
    `/user/${username}`
  );
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let loginPromise = verifyPassword({
        username,
        password: values.password,
      });
      toast.promise(loginPromise, {
        loading: "Checking...",
        success: <b>Login successfully</b>,
        error: <b>Password not match</b>,
      });
      loginPromise.then((res) => {
        let { token } = res.data;
        console.log(res.data);
        localStorage.setItem("token", token);
        navigate("/profile");
      });
    },
  });

  if (isLoading) return <h1>isLoading</h1>;
  else if (serverError) return <h1>{serverError.message}</h1>;
  else {
    return (
      <div className="container mx-auto">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="flex h-screen justify-center items-center">
          <div className={styles.glass}>
            <div className="title flex flex-col items-center">
              <h4 className="text-5xl font-bold">
                Hello {apiData?.firstName || apiData?.username}
              </h4>
              <span className="py-4 text-xl w-2/3 text-center text-gray-500">
                Explore more by connecting with us
              </span>
            </div>

            <form className="py-1" onSubmit={formik.handleSubmit}>
              <div className="profile flex justify-center py-4">
                <img
                  src={apiData?.profile || avatar}
                  className={styles.profile_img}
                  alt="avatar"
                />
              </div>
              <div className="textbox flex flex-col justify-center items-center gap-6">
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
                  Forgot password?{" "}
                  <Link to="/recovery" className="text-red-500">
                    Recover now
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
};

export default Password;
