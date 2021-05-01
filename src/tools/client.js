import { InternalError } from "./error";
import { OPCODE } from "./opcode";
import axios from "axios";
import { baseURL } from "..";

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
    throw new InternalError("서버와 연결할 수 없습니다.");
  }

  const { data } = res;
  if (data.opcode !== OPCODE.SUCCESS) {
    throw new InternalError(data.message);
  }

  return res;
}

function getInterceptorResponseError(err) {
  if (!err.response) {
    throw new InternalError("서버와 연결할 수 없습니다.");
  }

  const { data } = err.response;
  if (data.opcode === OPCODE.SUCCESS) return err;
  throw new InternalError(data.message);
}

export function getAccessKey() {
  const sessionId = localStorage.getItem("sessionId");
  if (!sessionId) return;
  return `Bearer ${sessionId}`;
}
