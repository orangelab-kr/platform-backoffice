import React, { useEffect, useRef, useState } from "react";

import { Client } from "../tools";
import { Select } from "antd";
import _ from "lodash";

const { Option } = Select;

export const PermissionsSelect = ({ id, isLoading, onChange, value }) => {
  const [permissions, setPermissions] = useState([]);
  const requestSearch = (search = value) => {
    if (search instanceof Array) return;
    Client.get("/platform/permissions", {
      params: {
        search,
        take: 10,
        skip: 0,
        orderByField: "name",
        orderBySort: "asc",
      },
    }).then(({ data }) => {
      setPermissions(data.permissions);
    });
  };

  const delayedSearch = useRef(_.debounce(requestSearch, 500)).current;
  useEffect(requestSearch, [value]);

  return (
    <Select
      id={id}
      mode="multiple"
      value={value}
      showSearch
      labelInValue
      disabled={isLoading}
      optionFilterProp="children"
      onSearch={delayedSearch}
      onChange={onChange}
    >
      {permissions.map((permission) => (
        <Option key={permission.permissionId} value={permission.permissionId}>
          {permission.name}
        </Option>
      ))}
    </Select>
  );
};
