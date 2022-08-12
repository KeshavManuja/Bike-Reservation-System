import { Button, Table } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import UserApi from "../apis/UserApi";
import GenUtil from "../GenUtil";
export const DisplayUserReservation = () => {
  const {user} = GenUtil.getLoggedInUser();
  const columns = [
    {
      key: 1,
      title: "ID",
      dataIndex: "id",
    },
    {
      key: 2,
      title: "Bike Model",
      dataIndex: "model",
    },
    {
      key: 3,
      title: "Bike Color",
      dataIndex: "color",
    },
    {
      key: 4,
      title: "User",
      dataIndex: "name",
    },
    {
      key: 5,
      title: "Start Date",
      dataIndex: "fromDate",
    },
    {
      key: 6,
      title: "End Date",
      dataIndex: "toDate",
    },
    {
      key: 7,
      title: "Stauts",
      dataIndex: "status",
    },
    {
      key: 8,
      title: "Actions",
      render: (record) => {
        const isCancelled = record.status === "Cancel";
        const hasRated = record.hasRated;
        return (
          
          user.id === +id && (
            <>
              {!hasRated && !isCancelled ? (
                <Button onClick={() => RateBike(record)}>Rate</Button>
              ) : (
                <p>Rating: {record.rating == "0" ? "-" : record.rating}</p>
              )}
              {!isCancelled && !hasRated && (
                <Button onClick={() => CancelReservation(record)}>
                  Cancel
                </Button>
              )}
            </>
          )
        );
      },
    },
  ];
  const { id } = useParams();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    const [error, data] = await UserApi.getReservation(id);
    if (data) {
      const tableSettableData = helper(data);
      setReservations(tableSettableData);
    } else {
      toast("Error while fetching users reservations");
    }
    setLoading(false);
  };

  const RateBike = (record) => {
    const id = record.id;
    navigate(`/reservation/rating/${id}`);
  };

  const CancelReservation = async (record) => {
    const id = record.id;
    const [error, data] = await UserApi.deleteReservation(id);
    if (error) {
      toast.error(error.response.data.message);
    } else {
      getRerservations();
    }
  };

  return (
    <>
      <Table columns={columns} dataSource={reservations}></Table>
    </>
  );
};
