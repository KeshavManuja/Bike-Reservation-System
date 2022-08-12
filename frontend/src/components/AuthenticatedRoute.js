import React, { useEffect } from "react";
import GenUtil from "../GenUtil";
import { useNavigate } from "react-router-dom";

export default function AuthenticatedRoute(props) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!GenUtil.isUserLoggedIn()) {
      navigate("/login");
    }
  }, []);

  return GenUtil.isUserLoggedIn() ? <>{props.children}</> : <></>;
}
