import React, { useEffect, useState } from "react";
import UserApi from "../apis/UserApi";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import GenUtil from "../GenUtil";
import { Button, Input } from "antd";
import { LoginUserSchema } from "../schema/UserSchema";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    GenUtil.isUserLoggedIn() && navigate("/");
  }, []);

  const login = async () => {
    setLoading(true);
    const { error , value } = LoginUserSchema.validate({email,password})
    if(error) toast.error(error.message)
    else {
    const [err, data] = await UserApi.login(value);
    setLoading(false);
    GenUtil.setLoggedInUser(data);
    if (data) {
      navigate("/");
    } else {
      toast(err.response.data.message);
    }
  }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <Input
          type={"email"}
          placeholder={"enter email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type={"password"}
          placeholder={"enter password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={login}>
          Submit
        </Button>
        <Link to={"/signup"}>Sign Up ></Link>
      </div>
    </div>
  );
}
