import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import { NavLink } from "react-router-dom";
import { Button, Drawer, Space, Tag } from "antd";
import { useAuth } from "../../context/auth";
import { FaGithub, FaLinkedin, FaGlobe, FaThumbsUp } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { FaCircleUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaQuestionCircle } from "react-icons/fa";
import { SiAnswer } from "react-icons/si";
import { IoMdCall } from "react-icons/io";
import { FaUserClock } from "react-icons/fa";
import moment from "moment";
import { FaCode } from "react-icons/fa";

const UserDashboard = () => {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("left");
  const [auth, SetAuth] = useAuth();
  const [QuestionAsked, SetQuestionAsked] = useState(0);
  const [AnswerAsked, SetAnswerAsked] = useState(0);
  const [Reputation, SetReputation] = useState(0);
  const onClose = () => {
    setOpen(false);
  };
  const showDrawer = () => {
    setOpen(true);
  };

  async function GetAllUserQuestion() {
    try {
      const AllQuestion = await fetch(
        `https://ayushreactbackend.onrender.com/api/v1/Questions/AskedUserQuestion/${auth.user._id}`
      );

      if (AllQuestion.status == 200) {
        const AllQue = await AllQuestion.json();
        SetQuestionAsked(AllQue.questionCount);
      }
      console.log(QuestionAsked);
    } catch (error) {
      console.log(error);
    }
  }

  async function GetAllUserAnswers() {
    try {
      const AllAnswer = await fetch(
        `https://ayushreactbackend.onrender.com/api/v1/Answer/GetNumberOfQuestions/${auth.user._id}`
      );

      if (AllAnswer.status == 200) {
        const AllAns = await AllAnswer.json();
        SetAnswerAsked(AllAns.AnswerCount);
      }
      console.log(QuestionAsked);
    } catch (error) {
      console.log(error);
    }
  }
  async function GetUserReputation() {
    const resp = await fetch(
      `https://ayushreactbackend.onrender.com/api/v1/auth/GetReputation/${auth.user._id}`
    );
    if (resp.status === 200) {
      const reputation = await resp.json();
      SetReputation(reputation.Rep.Reputation);
    }
  }

  useEffect(() => {
    GetAllUserQuestion();
    GetAllUserAnswers();
    GetUserReputation();
  }, []);

  return (
    <Layout>
      <div className="d-flex justify-content-center align-items-center h-100 p-3 Profilebg hauto">
        <div className="d-flex flex-column justify-content-center  align-items-center"></div>
        <Drawer
          title="Admin Dashboard"
          placement={placement}
          width={500}
          onClose={onClose}
          open={open}
          extra={
            <Space>
              <Button onClick={onClose}>Close</Button>
            </Space>
          }
        >
          <div
            className="d-flex  flex-column "
            style={{ gap: "1rem", width: "100%" }}
          >
            <button className="btn btn-dark btn-lg ButtonBorder">
              <NavLink
                to="/dashboard/admin/create-Category"
                className="list-group-item list-group-item-action d-flex justify-content-center  align-items-center"
              >
                Create Category
              </NavLink>
            </button>
            <button className="btn btn-dark  btn-lg  ButtonBorder">
              <NavLink
                to="/dashboard/admin/create-product"
                className="list-group-item list-group-item-action"
              >
                Create New Product
              </NavLink>
            </button>
            <button className="btn btn-dark  btn-lg ButtonBorder">
              <NavLink
                to="/dashboard/admin/Product"
                className="list-group-item list-group-item-action"
              >
                Edit a Product
              </NavLink>
            </button>

            <button className="btn btn-dark  btn-lg ButtonBorder">
              <NavLink
                to="/dashboard/Admin/Profile"
                className="list-group-item list-group-item-action"
              >
                Edit Your Profile
              </NavLink>
            </button>

            <button className="btn btn-dark  btn-lg ButtonBorder">
              <NavLink
                to="/dashboard/Admin/Users"
                className="list-group-item list-group-item-action"
              >
                Manage Users
              </NavLink>
            </button>

            <button className="btn btn-dark  btn-lg ButtonBorder">
              <NavLink
                to="/dashboard/admin/questions"
                className="list-group-item list-group-item-action d-flex justify-content-center  align-items-center"
              >
                Your Questions
              </NavLink>
            </button>

            <button className="btn btn-dark  btn-lg ButtonBorder">
              <NavLink
                to="/dashboard/admin/Contributions"
                className="list-group-item list-group-item-action d-flex justify-content-center  align-items-center"
                style={{ gap: "0.5rem" }}
              >
                Your Contributions
              </NavLink>
            </button>
          </div>
        </Drawer>

        <div className="w-100 d-flex justify-content-center gap-5 flex-col">
          {/* left div */}
          <div className="flex-column w-25  d-flex gap-3 width1000  alc">
            <div
              className="d-flex flex-column align-items-center border p-3 whitebg gap-2 width1000"
              style={{ borderRadius: "5px" }}
            >
              <img
                className="rounded-circle"
                style={{ width: "60%" }}
                src={`https://ayushreactbackend.onrender.com/api/v1/auth/get-userPhoto/${auth?.user?._id}`}
                alt="User"
              />
              <h3 className="m-0">
                <b>{auth?.user?.Name ?? "User Name"}</b>
              </h3>
              <span className="d-flex gap-2 align-items-center">
                <MdLocationPin />
                <h5 className="text-secondary m-0">
                  {auth?.user?.Location ?? "Location"}
                </h5>
              </span>
              <span className="d-flex gap-2 align-items-center">
                <FaThumbsUp />
                <h5 className="text-secondary m-0">
                  Reputation:{" "}
                  <span className="text-success fw-bold">
                    {Reputation ?? 0}
                  </span>
                </h5>
              </span>
            </div>

            <div
              className="mt-2 d-flex flex-column gap-3 whitebg p-2 width1000"
              style={{ borderRadius: "5px" }}
            >
              <a
                href={auth?.user?.Website ?? "#"}
                className="d-flex gap-4 align-items-center text-decoration-none text-dark border-bottom p-1 "
              >
                <FaGlobe />
                <p className="m-0 d-flex flex-wrap">
                  {auth?.user?.Website?.substring(0, 35) ?? "Website"}
                </p>
              </a>

              <a
                href={auth?.user?.Github ?? "#"}
                className="d-flex gap-4 align-items-center text-decoration-none text-dark border-bottom p-1 "
              >
                <FaGithub />
                <p className="m-0 d-flex flex-wrap">
                  {auth?.user?.Github?.substring(0, 35) ?? "Github"}
                </p>
              </a>
              <a
                href={auth?.user?.LinkedIn ?? "#"}
                className="d-flex gap-4 align-items-center text-decoration-none text-dark border-bottom p-1 "
              >
                <FaLinkedin />
                <p className="m-0 d-flex flex-wrap ">
                  {auth?.user?.LinkedIn?.substring(0, 35) ?? "LinkedIn"}
                </p>
              </a>
              <Button type="primary w-50  auto" onClick={showDrawer}>
                Admin Dashboard
              </Button>
            </div>
          </div>

          {/* right div */}
          <div
            className="w-50 whitebg d-flex flex-column gap-2 p-4 border width1000"
            style={{ borderRadius: "5px" }}
          >
            <hr className="m-0"></hr>

            <div className="d-flex ">
              <p className="fw-bold d-flex align-items-center gap-1 w-30 width50">
                <FaCircleUser /> Role
              </p>

              <p> {auth?.user?.Role == 0 ? "User" : "Admin"}</p>
            </div>
            <hr className="m-0"></hr>

            <div className="d-flex ">
              <p className="fw-bold d-flex align-items-center gap-1  w-30  width50">
                <MdEmail />
                Email
              </p>
              <p> {auth?.user?.Email}</p>
            </div>
            <hr className="m-0"></hr>

            <div className="d-flex ">
              <p className="fw-bold d-flex align-items-center gap-1  w-30 width50">
                <IoMdCall />
                Mobile
              </p>
              <p> {auth?.user?.MobileNo}</p>
            </div>

            <hr className="m-0"></hr>

            <div className="d-flex ">
              <p className="fw-bold d-flex align-items-center gap-1 w-30 width50">
                <FaQuestionCircle />
                Question asked
              </p>
              <p> {QuestionAsked}</p>
            </div>

            <hr className="m-0"></hr>

            <div className="d-flex ">
              <p className="fw-bold d-flex align-items-center gap-1 w-30 width50">
                <SiAnswer />
                Question answered
              </p>
              <p> {AnswerAsked}</p>
            </div>

            <hr className="m-0"></hr>
            <div className="d-flex  ">
              <p className="fw-bold d-flex align-items-center gap-1  w-30 width50">
                <FaUserClock />
                joined
              </p>
              <p> {moment(auth?.user?.createdAt).fromNow()}</p>
            </div>

            <hr className="m-0"></hr>
            <div className="d-flex ">
              <p className="fw-bold d-flex align-items-center gap-1  w-30 width50">
                <FaCode />
                Skills
              </p>
              <p className="d-flex flex-wrap">
                {" "}
                {auth?.user?.tags.map((t) => (
                  <Tag color="blue">{t}</Tag>
                ))}
              </p>
            </div>
            <hr className="m-0"></hr>
            <NavLink
              to="/dashboard/Admin/Profile"
              className="auto w-25 width50"
            >
              <Button type="primary w-100">Edit Profile</Button>
            </NavLink>
            <NavLink to="/" className="auto w-25 width50">
              <Button type="primary w-100">Home</Button>
            </NavLink>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
