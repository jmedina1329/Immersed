import axios from "axios";
import * as helper from "./serviceHelpers";

const endpoint = `${helper.API_HOST_PREFIX}/api/users`;

const registerNewUser = (payload) => {
  const config = {
    method: "POST",
    data: payload,
    url: endpoint,
    withCredentials: true,
    crossdomain: true,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const loginUser = (payload) => {
  const config = {
    method: "POST",
    data: payload,
    url: `${endpoint}/login`,
    withCredentials: true,
    crossdomain: true,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const currentUser = () => {
  const config = {
    method: "GET",
    url: `${endpoint}/current`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getUserById = (id) => {
  const config = {
    method: "GET",
    url: `${endpoint}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const logoutUser = () => {
  const config = {
    method: "GET",
    url: `${endpoint}/logout`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const confirmUser = (token, email) => {
  const config = {
    method: "PUT",
    url: `${endpoint}/confirm?token=${token}&email=${email}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const forgotPassword = (payload) => {
  const config = {
    method: "PUT",
    url: `${endpoint}/forgot`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const changePassword = (payload) => {
  const config = {
    method: "PUT",
    url: `${endpoint}/changepassword`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const changeOrg = (orgId) => {
  const config = {
    method: "POST",
    url: `${endpoint}/changeorg?orgId=${orgId}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getStatusTotals = () => {
  const config = {
    method: "GET",
    url: `${endpoint}/status/totals`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getStatusOverTime = () => {
  const config = {
    method: "GET",
    url: `${endpoint}/status/overTime`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const userService = {
  registerNewUser,
  loginUser,
  currentUser,
  getUserById,
  logoutUser,
  confirmUser,
  forgotPassword,
  changePassword,
  changeOrg,
  getStatusTotals,
  getStatusOverTime,
};
export default userService;
