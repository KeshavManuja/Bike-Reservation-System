import React from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  DeleteOutlined,
  EditOutlined,
  CheckCircleTwoTone,
  EyeOutlined,
} from "@ant-design/icons";
import UserApi from "../apis/UserApi";
import GenUtil from "../GenUtil";
import { Button } from "antd";

export default function UserCard({ user, triggerUpdate, setTriggerUpdate }) {
  const { id, name, email, role } = user;
  const navigate = useNavigate();
  const getUser = GenUtil.getLoggedInUser();
  const userId = getUser.user.id;

  async function deleteUser() {
    const [error, data] = await UserApi.deleteUser(id);
    if (error) {
      toast("error deleting");
    } else {
      toast("successfully deleted");
      setTriggerUpdate(!triggerUpdate);
    }
  }

  async function updateUser() {
    navigate("/add-user", { state: { user: { id, name, email, role } } });
  }

  function viewBookings(id) {
    navigate(`/reservation/user/${id}`);
  }

  return (
    <div className="card">
      <div className="item">Id: {id}</div>
      <div className="item">Name: {name}</div>
      <div className="item">Email: {email}</div>
      <div className="item">
        Role: {role === "manager" ? "Manager" : "Regular"}
      </div>
      <div className={"action-container"}>
        {id !== userId && (
          <>
            <button onClick={deleteUser}>
              <DeleteOutlined style={{ color: "red" }} />
            </button>

            <button onClick={updateUser}>
              <EditOutlined />
            </button>
          </>
        )}
        <Button onClick={() => viewBookings(id)}>
          <EyeOutlined /> View bookings
        </Button>
      </div>
    </div>
  );
}
