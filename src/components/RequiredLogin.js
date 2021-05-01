import React from "react";
import { Redirect } from "react-router";
import { getAccessKey } from "../tools";

export const RequiredLogin = ({ children }) => {
  return getAccessKey() ? children : <Redirect to="/auth/login" />;
};
