import http from "utils/http-common";

const loginUserService = (data: any) => {
  return http({ url: "api/auth/parody-login", type: "POST", data: data });
};

const signUpUserService = (data: any) => {
  return http({ url: "api/auth/parody-sign-up/", type: "POST", data: data });
};

const deleteUserService = () => {
  return http({ url: "api/auth/delete-user/", type: "DELETE" });
};

const UserService = {
  loginUserService,
  signUpUserService,
  deleteUserService,
};

export default UserService;
