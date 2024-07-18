// Import useState with alias to avoid conflict with Quill's useState
import React, { useEffect, useState as useStateReact } from "react";
import Layout from "../components/layout/layout";
import { useAuth } from "../context/auth";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { Modal } from "antd";
import Button from "@mui/material/Button";
import UserMenu from "../components/layout/UserMEnu";
import AdminMenu from "../components/layout/AdminMenu";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import React Quill styles
import { Pagination } from "antd";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const UserContributions = () => {
  const [auth, setAuth] = useAuth();
  const [answer, setAnswer] = useStateReact("");
  const [response, setResponse] = useStateReact([]);
  const [open, setOpen] = useStateReact(false);
  const [selectedId, setSelectedId] = useStateReact(null); // State to store the selected contribution ID
  const [expandedId, setExpandedId] = useStateReact(null);
  const [pagenumber, Setpagenumber] = useStateReact(1);
  const [answercount, Setanswercount] = useStateReact(0);

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

  async function getUserAnswer() {
    try {
      const response = await fetch(
        `https://ayushreactbackend.onrender.com/api/v1/Answer/Get_User_Answers/${auth.user._id}/${pagenumber}`
      );
      const answers = await response.json();
      if (answers) {
        setResponse(answers.answers);
      } else {
        toast("you haven't made any contributions");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  async function GetAnswerCount() {
    try {
      const response = await fetch(
        `https://ayushreactbackend.onrender.com/api/v1/Answer/Get_User_Answers_Count/${auth.user._id}`
      );

      const data = await response.json();

      if (response.status === 200) {
        Setanswercount(data.count);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  async function deleteContribution(aid, qid) {
    try {
      let confirmed = window.confirm(
        "Are you sure you want to delete this contribution?"
      );
      if (confirmed) {
        const del = await fetch(
          `https://ayushreactbackend.onrender.com/api/v1/Answer/delete_Answer/${aid}/${qid}/${auth.user._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (del.status === 200) {
          toast.success("Deleted Successfully");
          getUserAnswer();
        } else {
          toast.error("Try Again");
        }
      } else {
        return;
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  async function updateContribution(aid) {
    try {
      const updated = await fetch(
        `https://ayushreactbackend.onrender.com/api/v1/Answer/Update_Answer/${aid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answer,
          }),
        }
      );
      if (updated.status === 201) {
        toast.success("Answer Updated ");
        setOpen(false);
        getUserAnswer();
      } else {
        toast.error("Try Again");
      }
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  }

  useEffect(() => {
    getUserAnswer();
    GetAnswerCount();
  }, []);

  useEffect(() => {
    getUserAnswer();
  }, [pagenumber]);

  const handleUpdateClick = (id, answer) => {
    setSelectedId(id); // Set the selected ID when the update button is clicked
    setOpen(true);
    setAnswer(answer);
  };

  const handleSeeMore = (id) => {
    // Expand or collapse the content based on current state
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Layout>
      <div className="bg w-100 d-flex justify-content-around usercontributiondiv mt-3">
        <div className="w-25 usermenu">
          {auth.user.Role == 0 ? <UserMenu /> : <AdminMenu></AdminMenu>}
        </div>
        <div className="d-flex flex-column align-items-center w-50 usercontributions h-75 ">
          <h1>Your Contributions</h1>

          {response.length > 0 ? (
            <div className="w-100 d-flex flex-column gap-3">
              {response.map((R) => (
                <div
                  className="w-100 p-3  UserAnswerCard"
                  style={{
                    borderRadius: "5px",
                  }}
                >
                  <span className="fs-5 bold fw-bold">
                    Q: {R.questionid.title}
                  </span>
                  <hr></hr>
                  <p
                    className="ml-2"
                    style={{
                      fontSize: "14px",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: R.answer.substring(0, 100),
                    }}
                  ></p>
                  <MdDelete
                    onClick={() => deleteContribution(R._id, R.questionid._id)}
                    className="deleteicon"
                  />
                  <FaEdit
                    onClick={() => handleUpdateClick(R._id, R.answer)}
                    className="Editicon"
                  />
                </div>
              ))}
              <Pagination
                className=" m-auto"
                total={answercount}
                showQuickJumper
                pageSize={3}
                onChange={(value) => {
                  Setpagenumber(value);
                }}
              />
            </div>
          ) : (
            <div className="d-flex flex-column justify-content-center align-items-center">
              <h2 className="text-center">
                You haven't made any Contributions
              </h2>
              <NavLink to="/interaction">
                <Button variant="contained" color="success">
                  Answer
                </Button>
              </NavLink>
            </div>
          )}
        </div>
        <Modal
          title={<h2 className="modaltitle ">Enter Updated Answer</h2>}
          centered
          visible={open}
          onOk={() => updateContribution(selectedId)} // Pass the selected ID to the update function
          onCancel={() => setOpen(false)}
          width={1000}
          afterClose={() => setAnswer("")}
        >
          <ReactQuill
            key={selectedId} // Ensure React Quill reinitializes with updated content
            value={answer}
            onChange={setAnswer}
            modules={modules}
            formats={formats}
          />
        </Modal>
      </div>
    </Layout>
  );
};

export default UserContributions;
