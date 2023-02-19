import React from "react";
import styles from "../styles/Username.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { resetPasswordValidation } from "../helpers/validate";
import { resetPassword } from "../helpers/services";
import { useAuthStore } from "../store/store";
import { useNavigate } from "react-router-dom";

const Reset = () => {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_pwd: "",
    },
    validate: resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        let promise = resetPassword({
          username,
          password: values.password,
        });
        toast.promise(promise, {
          loading: "Loading",
          success: "Password has been changed",
          error: "Could not change the password",
        });
        promise.then(() => navigate("/"));
      } catch (error) {
        toast.error("Internal server error");
      }
    },
  });

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex h-screen justify-center items-center">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Reset</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter new password
            </span>
          </div>

          <form className="py-20" onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col justify-center items-center gap-6">
              <input
                {...formik.getFieldProps("password")}
                placeholder="New password"
                type="password"
                className={styles.textbox}
              />
              <input
                {...formik.getFieldProps("confirm_pwd")}
                placeholder="Confirm password"
                type="password"
                className={styles.textbox}
              />
              <button className={styles.btn} type="submit">
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reset;
