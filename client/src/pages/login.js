import React, { useState } from "react";
import Layout from "../components/layout/layout";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { auth, provider, signInWithPopup } from "../context/firebase";

const Login = () => {
  const [Email, SetEmail] = useState("");
  const [Password, SetPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [authState, setAuthState] = useAuth();
  const [Loading, SetLoading] = useState(false);
  const location = useLocation();

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      SetLoading(true);
      const response = await fetch(
        "https://ayushreactbackend.onrender.com/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Email,
            Password,
          }),
        }
      );
      const data = await response.json();

      if (response.status === 404) {
        //user not registered
        SetLoading(false);
        toast.error(data.message);
      } else {
        if (response.status === 210) {
          // Invalid Password
          SetLoading(false);
          toast.error(data.message);
        } else {
          if (response.status === 200) {
            SetLoading(false);
            //login successful
            toast.success("Login Succesful");
            setAuthState({
              ...authState, //spread authState to keep previous values as it is
              user: data.user,
              token: data.token,
            });
            localStorage.setItem(
              "auth",
              JSON.stringify({ user: data.user, token: data.token })
            );

            setTimeout(() => {
              navigate("/");
            }, 2500);
          }
        }
      }
    } catch (error) {
      SetLoading(false);
      console.log(error);
      toast.error("Something went wrong try again");
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = async () => {
    try {
      SetLoading(true);
      const result = await signInWithPopup(auth, provider);
      const { user } = result;

      const response = await fetch(
        "https://ayushreactbackend.onrender.com/api/v1/auth/google-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: user.accessToken }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        SetLoading(false);
        toast.success("Login Successful");
        setAuthState({
          ...authState,
          user: data.user,
          token: data.token,
        });
        localStorage.setItem(
          "auth",
          JSON.stringify({ user: data.user, token: data.token })
        );
        navigate("/");
      } else {
        SetLoading(false);
        toast.error(data.message);
      }
    } catch (error) {
      SetLoading(false);
      toast.error("Google login failed. Try again.");
    }
  };

  return (
    <Layout>
      <div className="bg">
        <div
          className="Registerlayout bg-light width1000"
          style={{ width: "70%", padding: "20px", borderRadius: "10px" }}
        >
          <div className="d-flex mb-3 gap-2 loginheader">
            <NavLink to="/register" className="w-50 loginreglink">
              {" "}
              Register
            </NavLink>

            <NavLink to="/login" className="w-50 loginreglink">
              {" "}
              Login
            </NavLink>
          </div>

          <form
            style={{ display: "flex", justifyContent: "center" }}
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <div className="mt-2" style={{ width: "100%" }}>
              <div style={{ textAlign: "center" }}>
                <h1 style={{ fontWeight: "600" }}>Login</h1>
                <p style={{ fontSize: "20px" }}>
                  Doesn't have an account yet? <a href="/register">Sign-Up</a>{" "}
                  here
                </p>
              </div>

              <div className="mb-2 w-100 d-flex flex-col ">
                <div className="w-75 m-auto width1000">
                  <label
                    htmlFor="exampleInputEmail1"
                    className="form-label smalltitlefont2 d-flex justify-content-startc w-100"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Enter your email"
                    aria-describedby="emailHelp"
                    value={Email}
                    onChange={(e) => {
                      SetEmail(e.target.value);
                    }}
                    required
                    style={{ fontSize: "16px" }}
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="w-75 m-auto width1000">
                  <label
                    htmlFor="exampleInputPassword1"
                    className="form-label smalltitlefont2"
                  >
                    Password
                  </label>
                  <div style={{ display: "flex" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="exampleInputPassword1"
                      placeholder="Enter your Password"
                      value={Password}
                      onChange={(e) => {
                        SetPassword(e.target.value);
                      }}
                      required
                    />
                    <button
                      className="btn btn-outline-primary"
                      type="button"
                      onClick={togglePasswordVisibility}
                      style={{ marginLeft: "5px" }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3 w-100 justify-content-center gap-5 d-flex">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={Loading}
                  style={{ width: "10rem" }}
                >
                  {Loading ? "Loading..." : "Login"}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={() => {
                    navigate("/ForgotPassword");
                  }}
                >
                  Forgot Password
                </button>
              </div>
            </div>
          </form>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                handleGoogleLogin();
              }}
              disabled={Loading}
            >
              {Loading ? "Loading..." : "Login with Google"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
