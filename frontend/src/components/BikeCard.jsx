import React from "react";
import BikeApi from "../apis/BikeApi";
import { toast } from "react-toastify";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import GenUtil from "../GenUtil";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

export default function BikeCard({
  bike,
  triggerUpdate,
  setTriggerUpdate,
  showBook,
  reserveBike,
}) {
  const { id, model, color, location, isAvailable, rating } = bike;
  const isManager = GenUtil.isManager();
  const navigate = useNavigate();
  async function deleteBike() {
    const [error, data] = await BikeApi.deleteBike(id);
    if (error) {
      toast("error while deleting");
    } else {
      toast("successfully deleted");
      setTriggerUpdate(!triggerUpdate);
    }
  }

  async function updateBike() {
    navigate("/add-bike", {
      state: { bike: { id, model, color, location, isAvailable } },
    });
  }

  async function viewBookings(id) {
    navigate(`/reservation/bike/${id}`);
  }

  return (
    <div className="card">
      <div className="item">Id: {id}</div>
      <div className="item">Model: {model}</div>
      <div className="item">Color: {color}</div>
      <div className="item">Location: {location}</div>
      <div className="item">IsAvailable: {isAvailable ? "YES" : "NO"}</div>
      <div className="item">rating: {rating.toFixed(1)}</div>

      {showBook && (
        <div
          onClick={() => reserveBike(id)}
          className="item"
          style={{ color: "dodgerblue" , cursor:"pointer"}}
        >
          Book
        </div>
      )}
      {isManager && (
        <div className={"action-container"}>
          <Button onClick={deleteBike}>
            <DeleteOutlined style={{ color: "red" }} />
          </Button>
          <Button onClick={updateBike}>
            <EditOutlined />
          </Button>
          <Button onClick={() => viewBookings(id)}>
            <EyeOutlined /> View bookings
          </Button>
        </div>
      )}
    </div>
  );
}
