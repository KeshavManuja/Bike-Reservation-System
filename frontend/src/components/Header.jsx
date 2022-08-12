import React from "react";
import { Link, useNavigate } from "react-router-dom";
import GenUtil from "../GenUtil";

export default function Header() {
  const navigate = useNavigate();
  const isManager = GenUtil.isManager();
  const user = GenUtil.getLoggedInUser();
  const id = user?.user.id;

  const logOut = () => {
    GenUtil.logOut();
    navigate("/login");
  };

  return (
    <div className="header">
      <div className="left">
        <Link className={"link"} to={"/"}>
          Home
        </Link>
        {isManager && (
          <Link className={"link"} to={"/users"}>
            Users
          </Link>
        )}
        <Link className={"link"} to={`/reservation/user/${id}`}>
          Bookings
        </Link>
      </div>
      <div className="right">
        <button className={"link"} onClick={logOut}>
          Logout
        </button>
      </div>
    </div>
  );
}
