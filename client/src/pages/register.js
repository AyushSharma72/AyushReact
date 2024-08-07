import { useEffect, useState } from "react";
import React from "react";
import Layout from "../components/layout/layout";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Signup from "../assests/Illustrations/signup.svg";

const Register = () => {
  const Locate = useLocation();
  const [Name, SetName] = useState("");
  const [Email, SetEmail] = useState("");
  const [Password, SetPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [Answer, SetAnswer] = useState("");
  const [SecurityQuestion, SetSecurityQuestion] = useState("");
  const [MobileNo, SetMobileNo] = useState("");
  const [photo, SetPhoto] = useState("");
  const [country, setCountry] = useState(""); // Added country state
  const [region, setRegion] = useState(""); // Added region state
  const [Location, setLocation] = useState("");
  const navigate = useNavigate();
  const [Loading, SetLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const Setlocation = () => {
    setLocation(region + ", " + " " + country);
  };

  useEffect(() => {
    Setlocation();
  }, [region]);

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      const formData = new FormData();
      formData.append("Name", Name);
      formData.append("Email", Email);
      formData.append("Password", Password);
      formData.append("Answer", Answer);
      formData.append("SecurityQuestion", SecurityQuestion);
      formData.append("Location", Location);
      formData.append("photo", photo);
      formData.append("MobileNo", MobileNo);
      if (Password.length < 6) {
        toast.error("Password length must be more than 6");
        SetLoading(false);
        return;
      }
      const response = await fetch(
        "https://ayushreactbackend.onrender.com/api/v1/auth/register",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.status === 201) {
        SetLoading(false);

        toast.success("Registration Successful");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else if (response.status === 409) {
        // User already exists
        SetLoading(false);
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      SetLoading(false);
      toast.error(error.message);
    }
  }
  return (
    <Layout>
      <div className="d-flex justify-content-around ">
        <div
          className=" displayno d-flex justify-content-center align-items-center "
          style={{ width: "30%" }}
        >
          {" "}
          <img src={Signup} className="w-100"></img>
        </div>
        <div
          className="w-50 overflow-auto width1000 no-scrollbar"
          style={{ height: "80vh" }}
        >
          {" "}
          <div
            className="Registerlayout bg-light border width1000 "
            style={{
              padding: "20px",
              borderRadius: "10px",
            }}
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
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <div style={{ textAlign: "center" }}>
                <h1 style={{ fontWeight: "600" }}>Register</h1>
                <p style={{ fontSize: "20px" }}>
                  Already have an account? <a href="/login">Login</a> here
                </p>
              </div>

              <div style={{ width: "100%" }}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label smalltitlefont2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Enter your name"
                    aria-describedby="emailHelp"
                    value={Name}
                    onChange={(e) => {
                      SetName(e.target.value);
                    }}
                    required
                    style={{ fontSize: "16px" }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label smalltitlefont2">
                    Email
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

                <div className="mb-3 d-flex flex-col">
                  <div
                    style={{ width: "50%", marginRight: "10px" }}
                    className="width1000"
                  >
                    <label
                      htmlFor="password"
                      className="form-label smalltitlefont2"
                    >
                      Password
                    </label>
                    <div style={{ display: "flex" }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Password"
                        id="exampleInputPassword1"
                        value={Password}
                        onChange={(e) => {
                          SetPassword(e.target.value);
                        }}
                        required
                        style={{ fontSize: "16px" }}
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
                  <div style={{ width: "50%" }} className="width1000">
                    <label
                      htmlFor="mobile"
                      className="form-label smalltitlefont2"
                    >
                      Mobile No.
                    </label>
                    <PhoneInput
                      enableSearch={true}
                      country={"in"}
                      value={MobileNo}
                      onChange={SetMobileNo}
                      className="width70" // directly set the value here
                    />
                  </div>
                </div>

                <div className="d-flex mb-3 flex-col">
                  <div>
                    <div style={{ width: "50%", marginRight: "10px" }}>
                      <label
                        htmlFor="country"
                        className="form-label smalltitlefont2"
                      >
                        Country
                      </label>
                    </div>
                    <div
                      style={{ width: "50%", marginRight: "10px" }}
                      className="width1000"
                    >
                      <CountryDropdown
                        value={country}
                        onChange={(val) => {
                          setCountry(val);
                        }}
                        classes="width1000"
                        style={{ height: "40px", fontSize: "16px" }}
                      />
                    </div>
                  </div>

                  <div>
                    <div>
                      <label
                        htmlFor="city"
                        className="form-label smalltitlefont2"
                      >
                        City
                      </label>
                    </div>
                    <div style={{ width: "100%" }}>
                      <RegionDropdown
                        country={country}
                        value={region}
                        onChange={(val) => {
                          setRegion(val);
                        }}
                        style={{ height: "40px", fontSize: "16px" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="securityQuestion"
                    className="form-label smalltitlefont2"
                  >
                    Security Question
                  </label>
                  <select
                    id="Questions"
                    className="w-100 mb-1"
                    onChange={(e) => {
                      SetSecurityQuestion(e.target.value);
                    }}
                    required
                    style={{ height: "40px", fontSize: "16px" }}
                  >
                    <option value="What is your mother's maiden name ?">
                      What is your mother's maiden name?
                    </option>
                    <option value="In which city were you born ?">
                      In which city were you born?
                    </option>
                    <option value="What is the name of your first pet ?">
                      What is the name of your first pet?
                    </option>
                    <option value="What is your favorite book?">
                      What is your favorite book?
                    </option>
                    <option value="What was the model of your first car?">
                      What was the model of your first car?
                    </option>
                  </select>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="securityAnswer"
                    className="form-label smalltitlefont2"
                  >
                    Security Answer
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Your Answer"
                    value={Answer}
                    onChange={(e) => {
                      SetAnswer(e.target.value);
                    }}
                    required
                    style={{ fontSize: "16px" }}
                  />
                </div>

                <div className="d-flex justify-content-start w-100 border-2">
                  <label className="btn border border-3 w-100 btn-outline-primary">
                    {photo ? photo.name : "Upload Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        SetPhoto(e.target.files[0]);
                      }}
                      hidden
                      required
                    />
                  </label>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn btn-primary align-items-center"
                    disabled={Loading}
                  >
                    {Loading ? "Loading..." : " Register"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
