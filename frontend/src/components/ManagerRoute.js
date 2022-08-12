import React, { useEffect } from "react";
import GenUtil from "../GenUtil";
import { useNavigate } from "react-router-dom";

export default function ManagerRoute(props) {
  const navigate = useNavigate();
  const isManager = GenUtil.isManager();

  useEffect(() => {
    if (!GenUtil.isUserLoggedIn()) {
      navigate("/login");
    } else if (!isManager) {
      navigate("/");
    }
  }, []);

  return isManager ? <>{props.children}</> : <></>;
}
