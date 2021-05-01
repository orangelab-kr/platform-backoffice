import { OPCODE } from "./opcode";
import axios from "axios";
import { baseURL } from "../App";
import { message } from "antd";

export const Client = axios.create();

Client.interceptors.request.use(getInterceptorRequest.bind(this));
Client.interceptors.response.use(
  getInterceptorResponse.bind(this),
  getInterceptorResponseError.bind(this)
);

function getInterceptorRequest(config) {
  const accessKey = getAccessKey();
  config.baseURL = `${baseURL}`;
  config.headers = {
    authorization: accessKey,
  };

  return config;
}

function getInterceptorResponse(res) {
  if (!res) {
    message.error("서버와 연결할 수 없습니다.");
    return;
  }

  const { data } = res;
  if (data.opcode !== OPCODE.SUCCESS) {
    message.error(data.message);
    return;
  }

  return res;
}

function getInterceptorResponseError(err) {
  if (!err.response) {
    message.error("서버와 연결할 수 없습니다.");
    return;
  }

  const { data } = err.response;
  if (data.opcode === OPCODE.SUCCESS) return err;
  message.error(data.message);
}

export function getAccessKey() {
  const sessionId = localStorage.getItem("sessionId");
  if (!sessionId) return;
  return `Bearer ${sessionId}`;
}
