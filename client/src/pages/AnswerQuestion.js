import React, { useEffect, useState } from "react";
import Layout from "../components/layout/layout";
import { useParams, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth";
import Button from "@mui/material/Button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AnswerQuestion = () => {
  const params = useParams();
  const [Answer, SetAnswer] = useState("");
  const [Title, SetTitle] = useState("");
  const [Description, SetDescription] = useState("");
  const [auth, SetAuth] = useAuth();
  const [Email, SetEmail] = useState("");
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "code-block"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "code-block",
  ];

  async function GetSingleQuestion() {
    try {
      const que = await fetch(
        `https://ayushreactbackend.onrender.com/api/v1/Questions/getSingleQuestion/${params.id}`
      );
      const data = await que.json();
      if (data) {
        SetTitle(data.question[0].title);
        SetDescription(data.question[0].question);
        SetEmail(data.question[0].user.Email);
      } else {
        toast.error("Error! getting title");
      }
    } catch (error) {
      toast.error("Something Went Wrong");
      console.log(error);
    }
  }

  async function PostAnswer(e) {
    e.preventDefault();
    try {
      if (Answer == "") {
        toast.error("please add answer");
        return;
      }
      const response = await fetch(
        `https://ayushreactbackend.onrender.com/api/v1/Answer/post_Answer/${auth.user._id}/${params.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Answer,
          }),
        }
      );
      const answer = await response.json();
      if (answer) {
        toast.success("Answer Posted Succesfully");
        SetAnswer("");
        await SendEmail();
      } else {
        toast.error("Answer was not posted");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  async function SendEmail() {
    try {
      const response = await fetch(
        `https://ayushreactbackend.onrender.com/api/v1/Answer/EmailUser/${Email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status == 200) {
        console.log("Email sent ");
      }
    } catch (error) {
      toast.error("EmailSent");
    }
  }

  useEffect(() => {
    GetSingleQuestion();
  }, []);

  return (
    <Layout>
      <div className="d-flex flex-column align-items-center p-1">
        <h1 className="Titlefont mt-2" style={{ marginBottom: "-1rem" }}>
          Contribute
        </h1>
        <div className="d-flex flex-column contactlayout width1000 ">
          <h3 className="mediumtitlefont  ">Question: {Title} </h3>
          <p>
            <strong>Description:</strong> {Description}
          </p>
        </div>
        <form
          className="w-100 d-flex flex-column justify-content-center align-items-center"
          onSubmit={(e) => {
            PostAnswer(e);
          }}
        >
          <div className="w-75 width90">
            <b>
              <label
                htmlFor="Question"
                className="mediumtitlefont"
                style={{ marginBottom: "1rem" }}
              >
                Answer :{" "}
              </label>
            </b>
            <ReactQuill
              value={Answer}
              onChange={SetAnswer}
              modules={modules}
              formats={formats}
              placeholder="Answer..."
            />
          </div>

          <Button
            variant="contained"
            color="success"
            type="submit"
            style={{ padding: "0.5rem 1rem", margin: "0.5rem" }}
          >
            Post Answer
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default AnswerQuestion;
