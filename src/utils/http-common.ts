import axios from "axios";
import { getDataFromAsync } from "./LocalStorage";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";

export const BASE_URL = "https://bedev.dint.com/";

export const _getconnection = () =>
  new Promise((resolve, reject) => {
    NetInfo.fetch().then((state) => {
      resolve(state.isConnected);
    });
  });

const axiosInstance = axios.create({
  baseURL: "https://bedev.dint.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getDataFromAsync("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (next) => {
    return Promise.resolve(next);
  },
  (error) => {
    return Promise.reject(error);
  }
);

type ReqData = {
  type: string;
  url: string;
  data?: any;
  headers?: any;
};

// api modal for call api
const createAPICall = async ({ type, url, data, headers = {} }: ReqData) =>
  new Promise((resolve, reject) => {
    console.log("URL:-", url);
    _getconnection().then(async (isConnected) => {
      if (isConnected) {
        try {
          const response = await axiosInstance({
            method: type,
            url: url,
            data: data,
            headers: headers,
          });
          console.log("responseresponse", response);
          return resolve(response);
        } catch (error: any) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            // console.log(error.response.data);
            // console.log(error.response.status,error.message);
            // console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            // console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            // console.log('Error', error.message);
          }
          console.log("error.response.status", error?.response?.status);
          console.log("error.config", error.config);
          return reject(error);
        }
      } else {
        Toast.show({
          type: "error",
          position: "top",
          text2: "No Internet Connection",
          visibilityTime: 3000,
        });
        return reject("no data");
      }
    });
  });
// const createAPICall = async ({ type, url, data, headers = {} }: ReqData) => {
//   console.log("URL: " + url);
//   try {
//     const response = await axiosInstance({
//       method: type,
//       url: url,
//       data: data,
//       headers: headers,
//     });
//     return response;
//   } catch (error) {
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       // console.log(error.response.data);
//       // console.log(error.response.status,error.message);
//       // console.log(error.response.headers);
//     } else if (error.request) {
//       // The request was made but no response was received
//       // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
//       // http.ClientRequest in node.js
//       // console.log(error.request);
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       // console.log('Error', error.message);
//     }
//     console.log("error.response.status", error.response.status);
//     console.log("error.config", error.config);
//     return error;
//   }
// };

export default createAPICall;
