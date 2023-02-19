import React, { useEffect } from "react";
import styles from "../styles/Username.module.css";
import { toast, Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { recoveryValidate } from "../helpers/validate";
import { generateOTP, verifyOTP } from "../helpers/services";
import { useAuthStore } from "../store/store";
import { useNavigate } from "react-router-dom";

const Recovery = () => {
  const { username } = useAuthStore((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    generateOTP(username).then((OTP) => {
      if (OTP) return toast.success("OTP has been sent to your email");
      return toast.error("Problem while generating OTP");
    });
  }, [username]);

  const resendOTP = () => {
    let sendPromise = generateOTP(username);
    toast.promise(sendPromise, {
      loading: "Sending",
      success: "OTP has been send to your email",
      error: "Could not send",
    });
  };

  const formik = useFormik({
    initialValues: {
      OTP: "",
    },
    validate: recoveryValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const { status } = await verifyOTP({ username, code: values.OTP });
        if (status === 201) {
          toast.success("Verify successfully!");
          navigate("/reset");
        }
      } catch (error) {
        return toast.error("Wrong OTP! Check again");
      }
    },
  });

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex h-screen justify-center items-center">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Recovery</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter OTP to recover password
            </span>
          </div>

          <form className="pt-20" onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col justify-center items-center gap-6">
              <div className="input text-center">
                <span className="py-4 text-sm text-left text-gray-500">
                  Enter 6 digit OTP sent to your email address
                </span>
                <input
                  {...formik.getFieldProps("OTP")}
                  type="text"
                  placeholder="OTP"
                  className={styles.textbox}
                />
              </div>

              <button className={styles.btn} type="submit">
                Send
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Cant get OTP?{" "}
                <button onClick={resendOTP} className="text-red-500">
                  Resend
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Recovery;
