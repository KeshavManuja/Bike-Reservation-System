import React, { useState } from "react";
import { Input, Button, Checkbox, DatePicker } from "antd";
import moment from "moment";
import GenUtil from "../GenUtil";
import { toast } from "react-toastify";
const { RangePicker } = DatePicker;
const blockInvalidChar = e => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
export default function Filters({ applyFilter }) {
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const dateFormat = "YYYY-MM-DD";
  const user = GenUtil.getLoggedInUser();
  const isManager = GenUtil.isManager();
  const onDateChange = (data) => {
    const [fromDate, toDate] = data;
    setFromDate(moment(fromDate).format(dateFormat));
    setToDate(moment(toDate).format(dateFormat));
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  };
  

  return (
    <div className="filters-container">
      <Input
        placeholder={"model"}
        value={model}
        onChange={(e) => setModel(e.target.value)}
      />
      <Input
        placeholder={"color"}
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <Input
        placeholder={"location"}
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <Input
        placeholder={"average Rating"}
        value={rating}
        type="number"
        onChange={(e) => setRating(e.target.value)}
        onKeyDown = {blockInvalidChar}
      />
      <RangePicker disabledDate={disabledDate} onChange={onDateChange} />
      {isManager && <Checkbox
        checked={isAvailable}
        onChange={(e) => {
          user.user.role === "manager"? setIsAvailable(e.target.checked):toast.error("Unauthorized route");
        }}
      >
        isAvailable
      </Checkbox>}
      <div style={{display:"flex" , justifyContent:"space-between"}}>
      <Button
        type={"primary"}
        style={{flexGrow:0.5}}
        disabled={user.user.role === "regular"?!fromDate && !toDate & !model && !location && !color && !rating:false}
        onClick={() =>{
          applyFilter({ fromDate, toDate, model, isAvailable , color, location, rating })
        }}
      >
        Filter
      </Button>

      <Button
        type={"primary"}
        style={{flexGrow:0.4}}
        onClick={() => {

          if(fromDate || toDate || model || location || color || rating) {
          setFromDate(null)
          setFromDate(null);
          setToDate(null);
          setModel("");
          setIsAvailable(true);
          setColor("");
          setLocation("");
          setRating("");
          applyFilter({})
          }
        }}
      >
        Clear Filter
      </Button>
      </div>
    </div>
  );
}
