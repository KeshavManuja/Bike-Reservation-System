import React, { useState } from "react";
import UserApi from "../apis/UserApi";
import { toast } from "react-toastify";
import GenUtil from "../GenUtil";
import { Button, Checkbox, Input } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { UpdateUserSchema } from "../schema/UserSchema";

export default function AddUser() {
  const {user} = GenUtil.getLoggedInUser();
  const location = useLocation();
  const [userDetails, setUserDetails] = useState(location?.state?.user || {});
  const navigate = useNavigate();

  async function AlterUser() {
    const { value, error } = UpdateUserSchema.validate(userDetails);
    if (error) toast.error(error.message);
    else {
      let err, data;
      if (!userDetails.id) {
        [err, data] = await UserApi.createUser(value);
      } else {
        [err, data] = await UserApi.updateUser(value);
      }

      if (err) {
        toast(err.response.data.message);
      } else {
        toast("successfully created");
        if (userDetails.id) navigate('/users')
        setUserDetails({});
      }
    }
  }

  return (
    <div className="card">
      <Input
        onChange={(e) =>
          setUserDetails({ ...userDetails, email: e.target.value })
        }
        className="item"
        placeholder={"Enter Email"}
        value={userDetails.email || ""}
      />
      <Input
        onChange={(e) =>
          setUserDetails({ ...userDetails, name: e.target.value })
        }
        className="item"
        placeholder={"Enter Name"}
        value={userDetails.name || ""}
      />
      {!location?.state?.user && (
        <Input
          onChange={(e) =>
            setUserDetails({ ...userDetails, password: e.target.value })
          }
          className="item"
          placeholder={"Enter Password"}
          type="password"
          value={userDetails.password || ""}
        />
      )}
      {user.role === 'manager' && (
        <Checkbox
          className={"item"}
          defaultChecked={userDetails.role === 'manager'}
          onChange={(e) => {
            setUserDetails({ ...userDetails, role: e.target.checked?"manager":"regular" });
          }}
        >
          isManager
        </Checkbox>
      )}
      <br />
      <Button onClick={AlterUser}>Submit</Button>
    </div>
  );
}
