import React, { useEffect, useState } from "react";
import Layout from "../components/layout/layout";
import { NavLink } from "react-router-dom";
import { Button, Drawer, Radio, Space } from "antd";

import { useAuth } from "../context/auth";
import { FaUserEdit } from "react-icons/fa";
import { FaPlusSquare } from "react-icons/fa";
import { MdPublishedWithChanges } from "react-icons/md";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { FaHandsHelping } from "react-icons/fa";
import moment from "moment";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { FaThumbsUp } from "react-icons/fa";
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
      <div className="d-flex justify-content-center align-items-center h-100 p-3 Profilebg">
        <div className="d-flex flex-column justify-content-center  align-items-center"></div>
        <Drawer
          title="User Dashboard"
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
            className="d-flex justify-content-center flex-column align-items-center"
            style={{ gap: "2rem" }}
          >
            <button
              className="btn btn-dark ButtonBorder w-100"
              style={{ fontWeight: "700" }}
            >
              <NavLink
                to="/dashboard/user/Profile"
                className="list-group-item list-group-item-action d-flex justify-content-center  align-items-center"
                style={{ gap: "0.5rem" }}
              >
                <FaUserEdit /> Edit Profile
              </NavLink>
            </button>

            <button
              className="btn btn-dark ButtonBorder w-100"
              style={{ fontWeight: "700" }}
            >
              <NavLink
                to="/dashboard/user/Create-Product"
                className="list-group-item list-group-item-action d-flex justify-content-center  align-items-center"
                style={{ gap: "0.5rem" }}
              >
                <FaPlusSquare /> Create Product
              </NavLink>
            </button>
            <button
              className="btn btn-dark ButtonBorder w-100"
              style={{ fontWeight: "700" }}
            >
              <NavLink
                to="/dashboard/user/Product"
                className="list-group-item list-group-item-action d-flex justify-content-center  align-items-center"
                style={{ gap: "0.5rem" }}
              >
                <MdPublishedWithChanges />
                Update Product
              </NavLink>
            </button>
            <button
              className="btn btn-dark ButtonBorder w-100"
              style={{ fontWeight: "700" }}
            >
              <NavLink
                to="/dashboard/user/questions"
                className="list-group-item list-group-item-action d-flex justify-content-center  align-items-center"
                style={{ gap: "0.5rem" }}
              >
                <BsFillQuestionSquareFill /> Your Questions
              </NavLink>
            </button>
            <button
              className="btn btn-dark ButtonBorder w-100"
              style={{ fontWeight: "700" }}
            >
              <NavLink
                to="/dashboard/user/Contributions"
                className="list-group-item list-group-item-action d-flex justify-content-center  align-items-center"
                style={{ gap: "0.5rem" }}
              >
                <FaHandsHelping />
                Your Contributions
              </NavLink>
            </button>
          </div>
        </Drawer>

        {/* user information  */}

        <div className="w-100 d-flex justify-content-center gap-5">
          {/* left div */}
          <div className="flex-column w-25 d-flex gap-3">
            <div
              className="d-flex flex-column align-items-center border p-3 whitebg gap-2"
              style={{ borderRadius: "5px" }}
            >
              <img
                className=" rounded-circle"
                style={{ width: "60%" }}
                src={`https://ayushreactbackend.onrender.com/api/v1/auth/get-userPhoto/${auth.user._id}`}
              />
              <h3 className="m-0">
                <b>{auth.user.Name}</b>
              </h3>
              <span className="d-flex gap-2 align-items-center">
                {" "}
                <MdLocationPin />{" "}
                <h5 className="text-secondary m-0">{auth.user.Location}</h5>
              </span>
              <span className="d-flex gap-2 align-items-center">
                <FaThumbsUp />{" "}
                <h5 className=" text-secondary m-0">
                  Reputation:{" "}
                  <span className="text-success fw-bold">
                    {auth.user.Reputation}
                  </span>
                </h5>
              </span>
            </div>

            <div
              className="mt-2 d-flex flex-column gap-3 whitebg p-2"
              style={{ borderRadius: "5px" }}
            >
              <a
                href={auth.user.Website}
                className="d-flex gap-4 align-items-center text-decoration-none text-dark border-bottom p-1"
              >
                <FaGlobe />
                <p className="m-0">{auth.user.Website.substring(0, 35)}</p>
              </a>

              <a
                href={auth.user.Github}
                className="d-flex gap-4 align-items-center text-decoration-none text-dark border-bottom p-1   "
              >
                <FaGithub />
                <p className="m-0">{auth.user.Github.substring(0, 35)}</p>
              </a>
              <a
                href={auth.user.LinkedIn}
                className="d-flex gap-4 align-items-center text-decoration-none text-dark border-bottom p-1"
              >
                <FaLinkedin />
                <p className="m-0">{auth.user.LinkedIn.substring(0, 35)}</p>
              </a>
            </div>
          </div>

          {/* right div */}

          <div className="w-50 whitebg"></div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;

// <Button type="primary" onClick={showDrawer}>
// User Dashboard
// </Button>
