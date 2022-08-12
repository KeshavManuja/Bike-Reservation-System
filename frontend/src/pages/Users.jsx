import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import UsersApi from "../apis/UserApi";
import UserCard from "../components/UserCard";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState(null);
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const limit = 4;

  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, [triggerUpdate, page]);

  const getUsers = async () => {
    setLoading(true);
    const [error, data] = await UsersApi.getUsers(
      `page=${page}&limit=${limit}`
    );

    if (data?.res) {
      setUsers(data.res);
      setCount(data.pages);
    } else {
      toast("Error while fetching users");
    }
    setLoading(false);
  };

  return (
    <div className="users-container">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "30px",
        }}
      >
        <Button onClick={() => navigate("/add-user")}>
          <PlusCircleOutlined /> create user
        </Button>
      </div>
    <div className="bikes-wrapper">
      {users?.map((user) => (
        <UserCard
          key={user?.id}
          user={user}
          triggerUpdate={triggerUpdate}
          setTriggerUpdate={setTriggerUpdate}
        />
      ))}
      </div>
      <br/>
      <br/>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "40px",
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
      </div>
    </div>
  );
}
