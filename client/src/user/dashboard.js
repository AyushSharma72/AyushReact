import React, { useEffect, useState } from "react";
import Layout from "../components/layout/layout";
import { NavLink } from "react-router-dom";
import { Button, Drawer, Space } from "antd";
import { Tag } from "antd";
import { FaCircleUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaQuestionCircle } from "react-icons/fa";
import { SiAnswer } from "react-icons/si";
import { IoMdCall } from "react-icons/io";
import { FaUserClock } from "react-icons/fa";
import { FaCode } from "react-icons/fa";
import { useAuth } from "../context/auth";
import {
  FaUserEdit,
  FaPlusSquare,
  FaHandsHelping,
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaThumbsUp,
} from "react-icons/fa";
import { MdPublishedWithChanges, MdLocationPin } from "react-icons/md";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import moment from "moment";

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
        `http//localhost8000/api/v1/Questions/AskedUserQuestion/${auth?.user?._id}`
      );

      if (AllQuestion.status === 200) {
        const AllQue = await AllQuestion.json();
        SetQuestionAsked(AllQue.questionCount);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function GetAllUserAnswers() {
    try {
      const AllAnswer = await fetch(
        `http://localhost:8000/api/v1/Answer/GetNumberOfQuestions/${auth?.user?._id}`
      );

      if (AllAnswer.status === 200) {
        const AllAns = await AllAnswer.json();
        SetAnswerAsked(AllAns.AnswerCount);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function GetUserReputation() {
    try {
      const resp = await fetch(
        `http://localhost:8000/api/v1/auth/GetReputation/${auth?.user?._id}`
      );

      if (resp.status === 200) {
        const reputation = await resp.json();
        SetReputation(reputation.Rep.Reputation);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    GetAllUserQuestion();
    GetAllUserAnswers();
    GetUserReputation();
  }, []);

  return (
    <Layout>
      <div className="d-flex justify-content-center align-items-center p-3 h-100 Profilebg hauto">
        <div className="d-flex flex-column justify-content-center align-items-center"></div>
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
                className="list-group-item list-group-item-action d-flex justify-content-center align-items-center"
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
                className="list-group-item list-group-item-action d-flex justify-content-center align-items-center"
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
                className="list-group-item list-group-item-action d-flex justify-content-center align-items-center"
                style={{ gap: "0.5rem" }}
              >
                <MdPublishedWithChanges /> Update Product
              </NavLink>
            </button>
            <button
              className="btn btn-dark ButtonBorder w-100"
              style={{ fontWeight: "700" }}
            >
              <NavLink
                to="/dashboard/user/questions"
                className="list-group-item list-group-item-action d-flex justify-content-center align-items-center"
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
                className="list-group-item list-group-item-action d-flex justify-content-center align-items-center"
                style={{ gap: "0.5rem" }}
              >
                <FaHandsHelping /> Your Contributions
              </NavLink>
            </button>
          </div>
        </Drawer>

        {/* user information  */}
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
                src={`http://localhost:8000/api/v1/auth/get-userPhoto/${auth?.user?._id}`}
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
                className="d-flex gap-4 align-items-center text-decoration-none text-dark border-bottom p-1"
              >
                <FaGlobe />
                <p className="m-0 d-flex flex-wrap">
                  {auth?.user?.Website?.substring(0, 35) ?? "Website"}
                </p>
              </a>

              <a
                href={auth?.user?.Github ?? "#"}
                className="d-flex gap-4 align-items-center text-decoration-none text-dark border-bottom p-1"
              >
                <FaGithub />
                <p className="m-0 d-flex flex-wrap">
                  {auth?.user?.Github?.substring(0, 35) ?? "Github"}
                </p>
              </a>
              <a
                href={auth?.user?.LinkedIn ?? "#"}
                className="d-flex gap-4 align-items-center text-decoration-none text-dark border-bottom p-1"
              >
                <FaLinkedin />
                <p className="m-0 d-flex flex-wrap">
                  {auth?.user?.LinkedIn?.substring(0, 35) ?? "LinkedIn"}
                </p>
              </a>
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

            {/* skills */}

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
            <Button type="primary w-25 width50 auto" onClick={showDrawer}>
              User Dashboard
            </Button>

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
