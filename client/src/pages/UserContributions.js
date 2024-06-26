import React, { useEffect, useState } from "react";
import Layout from "../components/layout/layout";
import { Card } from "antd";
import { useAuth } from "../context/auth";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { Modal } from "antd";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { blue } from "@mui/material/colors";
import UserMEnu from "../components/layout/UserMEnu";
import AdminMenu from "../components/layout/AdminMenu";

const UserContributions = () => {
  const [auth, setAuth] = useAuth();
  const [answer, setAnswer] = useState("");
  const [response, setResponse] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null); // State to store the selected contribution ID
  const [expandedId, setExpandedId] = useState(null);
  const isSmallScreen1 = window.innerWidth <= 450;

  async function getUserAnswer() {
    try {
      const response = await fetch(
        `https://ayushreactbackend.onrender.com/api/v1/Answer/Get_User_Answers/${auth.user._id}`
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

  const theme = createTheme({
    palette: {
      ochre: {
        danger: "#f90707",
        dangerHover: "rgb(195, 23, 23)",
        Update: blue[900],
        UpdateHover: "#05a8a8",
      },
    },
  });

  useEffect(() => {
    getUserAnswer();
  }, []);

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
      <div className="bg w-100 d-flex justify-content-around usercontributiondiv">
        <div className="w-25 usermenu">
          {auth.user.Role == 0 ? <UserMEnu /> : <AdminMenu></AdminMenu>}
        </div>
        <div className="d-flex flex-column align-items-center w-50 usercontributions">
          <h1>Your Contributions</h1>
          <div className="w-100 d-flex flex-column" style={{ gap: "1rem" }}>
            {response.length > 0 ? (
              response.map((R) => (
                <div key={R._id}>
                  <Card
                    title={
                      <span className="smalltitlefont3 bullet-circle">
                        {R.questionid.title}
                      </span>
                    }
                    style={{
                      width: "100%",
                      border: "2px solid black",
                      paddingBottom: "0px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      {R.answer.substring(0, 50)}....
                    </p>
                  </Card>
                  <div className="d-flex justify-content-start mt-1 gap-3 w-100">
                    <ThemeProvider theme={theme}>
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: "ochre.Update",
                        }}
                        onClick={() => handleUpdateClick(R._id, R.answer)}
                      >
                        Update
                      </Button>
                    </ThemeProvider>
                    <ThemeProvider theme={theme}>
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: "ochre.danger",
                          "&:hover": {
                            bgcolor: "ochre.dangerHover",
                          },
                        }}
                        startIcon={<DeleteIcon />}
                        onClick={() =>
                          deleteContribution(R._id, R.questionid._id)
                        }
                      >
                        Delete
                      </Button>
                    </ThemeProvider>
                  </div>
                </div>
              ))
            ) : (
              <div className="d-flex flex-column justify-content-center align-items-center">
                <h2 className="text-center">
                  You haven't made any Contributions
                </h2>
                <NavLink to="/dashboard/user/interaction">
                  <Button variant="contained" color="success">
                    Answer
                  </Button>
                </NavLink>
              </div>
            )}
          </div>
          <Modal
            title={<h2 className="modaltitle ff">Enter Updated Answer</h2>}
            centered
            visible={open}
            onOk={() => updateContribution(selectedId)} // Pass the selected ID to the update function
            onCancel={() => setOpen(false)}
            width={1000}
          >
            <textarea
              onChange={(e) => setAnswer(e.target.value)}
              value={answer}
              rows="4"
              cols={`${isSmallScreen1 ? "10" : "140"}`}
            ></textarea>
          </Modal>
        </div>
      </div>
    </Layout>
  );
};

export default UserContributions;
