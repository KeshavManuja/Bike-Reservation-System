import "./App.scss";
import Header from "./components/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Bikes from "./pages/Bikes";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import AddBike from "./components/AddBike";
import AddUser from "./components/AddUser";
import ManagerRoute from "./components/ManagerRoute";
import { DisplayUserReservation } from "./pages/DisplayUserRerservations";
import { DisplayBikeReservation } from "./pages/DisplayBikeReservations";
import { AddRating } from "./pages/AddRating";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AuthenticatedRoute>
                <Header />
                <Bikes />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="add-bike"
            element={
              <ManagerRoute>
                <Header />
                <AddBike />
              </ManagerRoute>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route
            path="users"
            element={
              <ManagerRoute>
                <Header />
                <Users />
              </ManagerRoute>
            }
          />
          <Route
            path="add-user"
            element={
              <ManagerRoute>
                <Header />
                <AddUser />
              </ManagerRoute>
            }
          />
          <Route
            path="reservation/user/:id"
            element={
              <AuthenticatedRoute>
                <Header />
                <DisplayUserReservation />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="reservation/bike/:id"
            element={
              <ManagerRoute>
                <Header />
                <DisplayBikeReservation />
              </ManagerRoute>
            }
          />
          <Route
            path="reservation/rating/:id"
            element={
              <AuthenticatedRoute>
                <Header />
                <AddRating />
              </AuthenticatedRoute>
            }
          />
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
