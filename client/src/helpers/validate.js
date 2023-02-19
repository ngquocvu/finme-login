import toast from "react-hot-toast";
import { authenticate } from "./services";
/** validate login page username*/
export async function usernameValidate(values) {
  const errors = usernameVerify({}, values);

  if (values.username) {
    const { status } = await authenticate(values.username);

    if (status !== 200) {
      errors.exist = toast.error("User does not exist");
    }
  }
  return errors;
}

/** validate password */
export async function passwordValidate(values) {
  const errors = passwordVerify({}, values);
  return errors;
}

/** validate OTP */
export async function recoveryValidate(values) {
  const errors = {};
  if (String(values.OTP).length !== 6) {
    errors.OTP = toast.error("OTP is not valid");
  }
  return errors;
}

/** validate reset password */

export async function resetPasswordValidation(values) {
  const errors = passwordVerify({}, values);
  if (values.password !== values.confirm_pwd) {
    errors.exist = toast.error("Password not match");
  }
  return errors;
}

/** validate register form */
export async function registerValidation(values) {
  const errors = usernameVerify({}, values);
  emailVerify(errors, values);
  passwordVerify(errors, values);
}

/** profile validation */
export async function profileValidation(values) {
  const errors = emailVerify({}, values);
  return errors;
}

/** validate password */
const passwordVerify = (errors = {}, values) => {
  if (!values.password) {
    errors.password = toast.error("Password required...!");
  } else if (values.password.length < 4) {
    errors.password = toast.error("Password must be more than 4 digits ");
  }
  return errors;
};

/** validate username */
const usernameVerify = (errors = {}, values) => {
  if (!values.username) {
    errors.username = toast.error("Username is required");
  } else if (values.username.includes(" ")) {
    errors.username = toast.error("Invalid username...!");
  }
  return errors;
};

/** validate email */
function emailVerify(errors = {}, values) {
  if (!values.email) {
    errors.email = toast.error("Email is required");
  }
  return errors;
}
