import React, { useState } from "react";
import BikeApi from "../apis/BikeApi";
import { toast } from "react-toastify";
import { Button, Checkbox, Input } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { BikeSchema } from "../schema/BikeSchema";

export default function AddBike() {
  const location = useLocation();
  const navigate = useNavigate();
  const [bike, setBike] = useState(
    location?.state?.bike || { isAvailable: true }
  );
  var message = "";
  async function AlterBike() {
    let err, data;
    const { error, value } = BikeSchema.validate(bike);
    if (error) toast.error(error.message);
    else {
      if (!bike.id) {
        [err, data] = await BikeApi.createBike(value);
        message = "successfully created";
      } else {
        [err, data] = await BikeApi.updateBike(value);
        message = "successfully updated!";
      }

      if (err) {
        toast("error creating");
      } else {
        toast.success(message);
        if (bike.id) navigate("/");
        setBike({});
      }
    }
  }

  return (
    <div className="card">
      <Input
        onChange={(e) => setBike({ ...bike, model: e.target.value })}
        className="item"
        placeholder={"Enter Model Name"}
        value={bike.model || ""}
      />
      <Input
        onChange={(e) => setBike({ ...bike, color: e.target.value })}
        className="item"
        placeholder={"Enter Color"}
        value={bike.color || ""}
      />
      <Input
        onChange={(e) => setBike({ ...bike, location: e.target.value })}
        className="item"
        placeholder={"Enter Location"}
        value={bike.location || ""}
      />
      <Checkbox
        className={"item"}
        checked={bike.isAvailable}
        onChange={(e) => {
          setBike({ ...bike, isAvailable: e.target.checked });
        }}
      >
        isAvailable
      </Checkbox>
      <br />
      <br />
      <Button onClick={AlterBike}>Submit</Button>
    </div>
  );
}
