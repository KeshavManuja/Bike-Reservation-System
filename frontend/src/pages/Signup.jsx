import React, { useState, useEffect } from "react";
import UserApi from "../apis/UserApi";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import GenUtil from "../GenUtil";
import { Button, Input } from "antd";
import { SignupUserSchema } from "../schema/UserSchema";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    GenUtil.isUserLoggedIn() && navigate("/");
  }, []);

  const signup = async () => {
    setLoading(true);
    const { error, value } = SignupUserSchema.validate({ email, password , name});
    if (error) toast.error(error.message);
    else {
      const [err, data] = await UserApi.signup(value);

      setLoading(false);
      if (data) {
        toast("Successfully signed up! use the credentials to login");
        navigate("/login");
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
        <Input
          type={"text"}
          placeholder={"enter your name"}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Button type={"primary"} onClick={signup}>
          Submit
        </Button>
        <Link to={"/login"}>Login ></Link>
      </div>
    </div>
  );
}
