import jwtDecode from "jwt-decode";
export function getUsernameFromToken() {
  const token = localStorage.getItem("token");
  let decode = token && jwtDecode(token);
  return decode?.username;
}
