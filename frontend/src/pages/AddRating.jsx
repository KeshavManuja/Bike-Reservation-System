import { type } from "@testing-library/user-event/dist/type";
import { Button, Input } from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import UserApi from "../apis/UserApi";
import GenUtil from "../GenUtil";
import { AddRatingSchema } from "../schema/BikeSchema";
import { SignupUserSchema } from "../schema/UserSchema";

export const AddRating = () => {
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const user = GenUtil.getLoggedInUser();
  const navigate = useNavigate();
  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  const addRating = async (id, rating) => {
    const { value, error } = AddRatingSchema.validate({
      id,
      rating,
      userID: user.user.id,
    });

    if (error) toast.error(error.message);
    else {
      const [err, data] = await UserApi.addRating({
        userID: user.user.id,
        ...value,
      });
      if (err) {
        toast.error(err.response.data.message);
      } else {
        toast.success("rating successfully!");
        const userId = user?.user?.id;
        navigate(`/reservation/user/${user.user.id}`);
      }
    }
  };
  return (
    <div className="add-rating-div">
      <h2>Add Rating</h2>
      <br />
      <Input
        placeholder={"average Rating"}
        value={rating}
        type="number"
        onChange={(e) => setRating(e.target.value)}
        onKeyDown={blockInvalidChar}
      />
      <br />
      <Button type="primary" onClick={() => addRating(id, +rating)}>
        Submit
      </Button>
    </div>
  );
};
