import { message } from "antd";

export class InternalError extends Error {
  name = "InternalError";

  constructor(contents) {
    super();
    message.error(contents);
  }
}
