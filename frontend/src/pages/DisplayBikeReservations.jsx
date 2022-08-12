import { Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BikeApi from "../apis/BikeApi";
import GenUtil from "../GenUtil";

export const DisplayBikeReservation = () => {
  const { Column } = Table;
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = GenUtil.getLoggedInUser();
  const {id} = useParams();

  const helper = (data) => {
    const filterEmptyFeilds = [];
    for (let i = 0; i < data.length; i++) {
      const { bike, user, ...rest } = data[i];
      const color = bike.color;
      const model = bike.model;
      const name = user.name;
      const newObj = { ...rest, color, model, name };
      filterEmptyFeilds.push(newObj);
    }
    return filterEmptyFeilds;
  };

  useEffect(() => {
    getRerservations();
  }, []);

  const getRerservations = async () => {
    setLoading(true);
    const [error, data] = await BikeApi.getReservation(id);
    if (data) {
      const tableSettableData = helper(data);
      setReservations(tableSettableData);
    } else {
      toast("Error while fetching users reservations");
    }
    setLoading(false);
  };

  return (
    <>
      <Table dataSource={reservations}>
        <Column title="Name" dataIndex="name" key="name" />

        <Column title="Bike Model" dataIndex="model" key="model" />
        <Column title="Bike Color" dataIndex="color" key="color" />
        <Column title="Start Date" dataIndex="fromDate" key="fromDate" />
        <Column title="End Date" dataIndex="toDate" key="toDate" />
        <Column title="Status" dataIndex="status" key="status" />
        <Column title="Rating" dataIndex="rating" key="rating" />
      </Table>
    </>
  );
};
