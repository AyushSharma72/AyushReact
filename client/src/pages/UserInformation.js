import React, { useEffect, useState } from "react";
import Layout from "../components/layout/layout";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/auth";
import moment from "moment";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FaCircleUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaQuestionCircle } from "react-icons/fa";
import { SiAnswer } from "react-icons/si";
import { IoMdCall } from "react-icons/io";
import { FaUserClock } from "react-icons/fa";
import { FaCode } from "react-icons/fa";
import { Tag } from "antd";
import { FaThumbsUp } from "react-icons/fa";
import { MdPublishedWithChanges, MdLocationPin } from "react-icons/md";
import { BsFillQuestionSquareFill } from "react-icons/bs";
const UserInformation = () => {
  const [auth, SetAuth] = useAuth();
  const [QuestionAsked, SetQuestionAsked] = useState(0);
  const [AnswerAsked, SetAnswerAsked] = useState(0);
  const [Reputation, SetReputation] = useState(0);
  const [User, SetUser] = useState("");
  const { Userid } = useParams();

  async function GetUserDetails() {
    try {
      const Response = await fetch(
        `http://localhost:8000/api/v1/auth/Getuserinfo/${Userid}`
      );
      if (Response) {
        const data = await Response.json();
        if (Response.status == 200) {
          SetUser(data.user);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }
  async function GetAllUserQuestion() {
    try {
      const AllQuestion = await fetch(
        `http://localhost:8000/api/v1/Questions/AskedUserQuestion/${Userid}`
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
        `http://localhost:8000/api/v1/Answer/GetNumberOfQuestions/${Userid}`
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
      `http://localhost:8000/api/v1/auth/GetReputation/${Userid}`
    );
    if (resp.status === 200) {
      const reputation = await resp.json();
      SetReputation(reputation.Rep.Reputation);
    }
  }

  useEffect(() => {
    GetUserDetails();
    GetAllUserQuestion();
    GetAllUserAnswers();
    GetUserReputation();
  }, []);

  return (
    <Layout>
      <div className="d-flex align-items-center h-100 flex-column justify-content-center gap-2  Profilebg">
        <div className="w-100 d-flex justify-content-center gap-5 flex-col">
          {/* left div */}
          <div className="flex-column w-25  d-flex gap-3 width1000 alc">
            <div
              className="d-flex flex-column align-items-center border p-3 whitebg gap-2 width1000"
              style={{ borderRadius: "5px" }}
            >
              <img
                className="rounded-circle userimg"
                style={{ width: "60%" }}
                src={`http://localhost:8000/api/v1/auth/get-userPhoto/${User?._id}`}
                alt="User"
              />
              <h3 className="m-0">
                <b>{User?.Name ?? "User Name"}</b>
              </h3>
              <span className="d-flex gap-2 align-items-center">
                <MdLocationPin />
                <h5 className="text-secondary m-0">
                  {User?.Location ?? "Location"}
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
                href={User?.Website ?? "#"}
                className="d-flex gap-4 align-items-center text-decoration-none text-dark border-bottom p-1"
              >
                <FaGlobe />
                <p className="m-0 d-flex flex-wrap">
                  {User?.Website?.substring(0, 35) ?? "Website"}
                </p>
              </a>

              <a
                href={User?.Github ?? "#"}
                className="d-flex gap-4 align-items-center text-decoration-none text-dark border-bottom p-1"
              >
                <FaGithub />
                <p className="m-0 d-flex flex-wrap">
                  {User?.Github?.substring(0, 35) ?? "Github"}
                </p>
              </a>
              <a
                href={User?.LinkedIn ?? "#"}
                className="d-flex gap-4 align-items-center text-decoration-none text-dark border-bottom p-1"
              >
                <FaLinkedin />
                <p className="m-0 d-flex flex-wrap">
                  {User?.LinkedIn?.substring(0, 35) ?? "LinkedIn"}
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

              <p> {User?.Role == 0 ? "User" : "Admin"}</p>
            </div>
            <hr className="m-0"></hr>

            <div className="d-flex ">
              <p className="fw-bold d-flex align-items-center gap-1  w-30  width50">
                <MdEmail />
                Email
              </p>
              <p> {User?.Email}</p>
            </div>
            <hr className="m-0"></hr>

            <div className="d-flex ">
              <p className="fw-bold d-flex align-items-center gap-1  w-30 width50">
                <IoMdCall />
                Mobile
              </p>
              <p> {User?.MobileNo}</p>
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
              <p> {moment(User?.createdAt).fromNow()}</p>
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
                {User?.tags?.map((t) => (
                  <Tag color="blue">{t}</Tag>
                ))}
              </p>
            </div>
            <hr className="m-0"></hr>
          </div>
        </div>

        <NavLink to="/Users">
          <button className="btn btn-primary">Back</button>
        </NavLink>
      </div>
    </Layout>
  );
};

export default UserInformation;
