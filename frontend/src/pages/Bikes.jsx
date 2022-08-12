import React, { useEffect, useState } from "react";
import Filters from "../components/Filters";
import BikeCard from "../components/BikeCard";
import BikeApi from "../apis/BikeApi";
import { toast } from "react-toastify";
import GenUtil from "../GenUtil";
import { Alert, Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import UserApi from "../apis/UserApi";
import { filterBikesSchema} from "../schema/BikeSchema";
import * as moment from "moment";
function Bikes() {
  const [bikes, setBikes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [isDataAvailable , setIsDataAvailable] = useState(true);
  const [showBook, setShowBook] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [filterObj, setFilterObj] = useState({});
  const user = GenUtil.getLoggedInUser();
  const isManager = GenUtil.isManager();
  const limit = 4;
  const navigate = useNavigate();
  useEffect(() => {
    applyFilter(filterObj);
  }, [triggerUpdate, page]);

  const applyFilter = async ({
    model,
    color,
    location,
    isAvailable,
    rating,
    fromDate,
    toDate,
  }) => { 
    setLoading(true);
    const {error, value} =  filterBikesSchema.validate({model,
      color,
      location,
      isAvailable,
      rating,
      fromDate,
      toDate})
    if(error) {
      toast.error(error.message);
    }
    else {
      setFromDate(fromDate);
      setToDate(toDate);
      setFilterObj(value);
    const [err, data] = await BikeApi.getBikes({page:page, limit:limit, ...value});
    if (data?.bikes && data.bikes.length>0) {
      if (fromDate && toDate) setShowBook(true);
      setCount(data.pages);
      setBikes(data.bikes);
      setIsDataAvailable(true);

    } else {
      toast.error(err?.response.data.message);
      setIsDataAvailable(false);
      
    }
    setLoading(false);
  }
  };

  async function reserveBike(bikeId) {
    const userId = user.user.id;
    const [error, data] = await UserApi.reserveBike({
      bikeId,
      userId,
      fromDate,
      toDate,
    });
    if (error) {
      toast.error(error.response.data.message);
    } else {
      toast.success("booked successfully");
      applyFilter(filterObj);
    }
  }

  return (
    <div className="bikes-container">
      <Filters applyFilter={applyFilter} />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          marginTop: "30px",
        }}
      >
        {isManager && (
          <Button onClick={() => navigate("/add-bike")}>
            <PlusCircleOutlined /> create bikes
          </Button>
        )}
      </div>
      <div className="bikes-wrapper">
        {!isDataAvailable && <div className="alert-div"><Alert message="No Data Found" type="warning" showIcon /></div>}
        {isDataAvailable && bikes?.map((bike, index) => (
          <BikeCard
            showBook={showBook}
            reserveBike={reserveBike}
            key={bike.id}
            bike={bike}
            triggerUpdate={triggerUpdate}
            setTriggerUpdate={setTriggerUpdate}
          />
        ))}
      </div>
      <br />
      { isDataAvailable && <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <Button
          disabled={page === 1}
          onClick={() => {
            if (page > 1) {
              setPage(page - 1);
            }
          }}
        >
          Previous
        </Button>
        <Button
          disabled={page === count}
          onClick={() => {
            if (page <= count) {
              setPage(page + 1);
            }
          }}
        >
          Next
        </Button>
      </div>}
    </div>
  );
}

export default Bikes;
