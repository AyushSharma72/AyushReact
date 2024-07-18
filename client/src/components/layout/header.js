import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./../../App.css";
import { useAuth } from "../../context/auth";
import SearchBar from "../../pages/form/searchBar";
import toast from "react-hot-toast";
import { Badge } from "antd";
import { IoCartSharp } from "react-icons/io5";
import Avatar from "@mui/material/Avatar";
function Header() {
  const [auth, setAuth] = useAuth();

  const [itemCount, setItemCount] = useState(0);
  function HandleLogout() {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    setTimeout(() => {
      toast.success("logout Successfull");
    }, 500);
  }
  async function GetCartItems(id) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/product/getcartitemscount/${id}`
      );
      if (response.status == 200) {
        const { count } = await response.json();

        setItemCount(count);
      }
    } catch (error) {
      console.log(error);
      toast.error("cannot fetch cart items");
    }
  }
  useEffect(() => {
    if (auth?.user?._id) {
      GetCartItems(auth.user._id);
    }
  }, [auth]);

  return (
    <>
      <nav
        className="navbar navbar-expand-lg bg-body-tertiary "
        style={{ zIndex: "3" }}
      >
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <NavLink
              to="/"
              className="navbar-brand"
              href="#"
              style={{ color: "white" }}
            >
              TALKOFCODE
            </NavLink>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/products" className="nav-link">
                  Products
                </NavLink>
              </li>

              <li className="nav-item ">
                <NavLink to="/interaction" className="nav-link">
                  CodeConnect
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/technews" className="nav-link">
                  TECH_NEWSY
                </NavLink>
              </li>

              {!auth.user ? (
                <>
                  <li className="nav-item">
                    <NavLink to="/register" className="nav-link" href="#">
                      Get Started
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle d-flex align-items-center"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {" "}
                      <Avatar
                        alt={auth.user.Name}
                        src={`http://localhost:8000/api/v1/auth/get-userPhoto/${auth.user._id}`}
                        sx={{ width: 30, height: 30 }}
                      />
                      {auth.user.Name}
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <NavLink
                          to={`/dashboard/${
                            auth?.user?.Role === 1 ? `Admin` : `user`
                          }`}
                          className="dropdown-item"
                          href="#"
                        >
                          Dashboard
                        </NavLink>
                      </li>

                      <li>
                        <NavLink className="dropdown-item nav-item" to="/Users">
                          Users
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          className="dropdown-item nav-item"
                          to="/login"
                          onClick={HandleLogout}
                        >
                          Logout
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </>
              )}

              <li className="nav-item">
                <NavLink to="/UserCart" className="nav-link">
                  <IoCartSharp />
                  <sup>
                    <Badge count={itemCount} showZero></Badge>
                  </sup>
                </NavLink>
              </li>
            </ul>
          </div>
          <SearchBar />
        </div>
      </nav>
    </>
  );
}

export default Header;
