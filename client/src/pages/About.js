import React, { useState, useEffect } from "react";
import Layout from "../components/layout/layout";
import Card from "react-bootstrap/Card";
import products from "../assests/products.jpg";
import stack from "../assests/stack.jpg";
import technews from "../assests/technews.jpg";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import VisibilitySensor from "react-visibility-sensor";
import { FaAddressBook, FaShoppingCart, FaComment } from "react-icons/fa";

function Productcard() {
  return (
    <Card className="boxlayout" style={{ width: "22rem" }}>
      <Card.Img variant="top" src={products} />
      <Card.Body>
        <Card.Title className="mediumtitlefont">Helping Students</Card.Title>
        <Card.Text>
          Help Students by providing them a plateform to buy and sell their
          study related materials
        </Card.Text>
        <Link to="/products">
          <button className="btn btn-primary w-100">See Products</button>
        </Link>
      </Card.Body>
    </Card>
  );
}

function Codeconnectcard() {
  return (
    <Card className="boxlayout" style={{ width: "22rem" }}>
      <Card.Img variant="top" src={stack} />
      <Card.Body>
        <Card.Title className="mediumtitlefont w-100">
          Student Doubts Solver
        </Card.Title>
        <Card.Text>
          Help Students by providing them a plateform to ask and provide
          solutions of their doubts
        </Card.Text>
        <Link to="/dashboard/user/interaction">
          <button className="btn btn-primary w-100">Visit Code-Connect</button>
        </Link>
      </Card.Body>
    </Card>
  );
}

function Technewscard() {
  return (
    <Card className="boxlayout" style={{ width: "22rem" }}>
      <Card.Img variant="top" src={technews} />
      <Card.Body>
        <Card.Title className="mediumtitlefont">Tech News Provider</Card.Title>
        <Card.Text>
          Help Students by providing them a plateform where they can get all
          current tech news
        </Card.Text>
        <Link to="/technews">
          <button className="btn btn-primary w-100">See TechNews</button>
        </Link>
      </Card.Body>
    </Card>
  );
}

const About = () => {
  // useEffect(() => {
  //   fetchTotalUsers();
  //   fetchProductCount();
  //   fetchQuestionCount();
  // }, []);

  // const fetchTotalUsers = async () => {
  //   try {
  //     const response = await fetch(
  //       "https://ayushreactbackend.onrender.com/api/v1/auth/count"
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch total users");
  //     }
  //     const data = await response.json();
  //     setTotalUsers(data.totalUsers);
  //   } catch (error) {
  //     console.error("Error fetching total users:", error);
  //   }
  // };

  // const fetchProductCount = async () => {
  //   try {
  //     const response = await fetch(
  //       "https://ayushreactbackend.onrender.com/api/v1/product/product-count"
  //     );
  //     const data = await response.json();
  //     setTotalProducts(data.Total);
  //   } catch (error) {
  //     console.error("Error fetching product count:", error);
  //   }
  // };

  // const fetchQuestionCount = async () => {
  //   try {
  //     const response = await fetch(
  //       "https://ayushreactbackend.onrender.com/api/v1/Questions/QuestionCount"
  //     );
  //     const data = await response.json();
  //     setTotalQuestions(data.Total);
  //   } catch (error) {
  //     console.error("Error fetching product count:", error);
  //   }
  // };
  const [usersCounted, setUsersCounted] = useState(false);
  const [questionsCounted, setQuestionsCounted] = useState(false);
  const [productsCounted, setProductsCounted] = useState(false);

  return (
    <Layout>
      <div className="d-flex flex-column">
        <p className="Titlefont center WelcomeTExt">
          Welcome to <mark>TALKOFCODE</mark>, your go-to destination for all
          things code-related!
        </p>
        <div className="cards flex-col">
          <Productcard />
          <Codeconnectcard />
          <Technewscard />
        </div>
        <p className="Titlefont center" style={{ marginTop: "2rem" }}>
          About us
        </p>
        <div className="d-flex justify-content-around align-items-center width1000 flex-col">
          <div
            className="d-flex justify-content-around align-items-center width1000 padding"
            style={{ width: "45%", gap: "1rem" }}
          >
            <div>
              <div className="gradient1 p-2">
                <div>
                  <FaAddressBook />
                </div>
                <VisibilitySensor
                  partialVisibility
                  offset={{ bottom: 200 }}
                  onChange={(isVisible) => {
                    if (isVisible && !usersCounted) {
                      setUsersCounted(true);
                    }
                  }}
                >
                  <div style={{ height: 50 }}>
                    {usersCounted ? (
                      <h2>
                        <CountUp end={900} duration={2} />
                      </h2>
                    ) : null}
                  </div>
                </VisibilitySensor>
                <b>Users</b>
              </div>
              <div className="statement">
                <p className="statement-heading">TechNews :</p>
                <p>"Stay Informed, Stay Ahead"</p>
              </div>
            </div>

            <div>
              <div className="gradient2 p-2">
                <div>
                  <FaComment />
                </div>
                <VisibilitySensor
                  partialVisibility
                  offset={{ bottom: 200 }}
                  onChange={(isVisible) => {
                    if (isVisible && !questionsCounted) {
                      setQuestionsCounted(true);
                    }
                  }}
                >
                  <div style={{ height: 50 }}>
                    {questionsCounted ? (
                      <h2>
                        <CountUp end={234} duration={2} />
                      </h2>
                    ) : null}
                  </div>
                </VisibilitySensor>
                <b>Questions Asked</b>
              </div>

              <div className="statement">
                <p className="statement-heading">CodeConnect :</p>
                <p>"Empowering Knowledge Exchange"</p>
              </div>
            </div>

            <div>
              <div className="gradient3 p-2">
                <div>
                  <FaShoppingCart />
                </div>
                <VisibilitySensor
                  partialVisibility
                  offset={{ bottom: 200 }}
                  onChange={(isVisible) => {
                    if (isVisible && !productsCounted) {
                      setProductsCounted(true);
                    }
                  }}
                >
                  <div style={{ height: 50 }}>
                    {productsCounted ? (
                      <h2>
                        <CountUp end={342} duration={2} />
                      </h2>
                    ) : null}
                  </div>
                </VisibilitySensor>
                <b>Products listed</b>
              </div>

              <div className="statement">
                <p className="statement-heading">TalkOfCode :</p>
                <p>"Sustainable Tech Solutions"</p>
              </div>
            </div>
          </div>

          <div
            style={{ width: "40%", marginBottom: "1rem" }}
            className="flex-column d-flex width1000"
          >
            <div className="boxlayout smalltitlefont">
              <p>
                At TalkOfCode, we're more than just a platform – we're a vibrant
                community of learners, creators, and enthusiasts united by our
                passion for technology. Our mission is simple: to provide a
                dynamic space where individuals from all backgrounds can come
                together to learn, share, and grow.
              </p>
              <p className="smalltitlefont">
                "Whether you're a seasoned developer, a student, or an
                entrepreneur, TalkOfCode is here to support you every step of
                the way."
              </p>
              <p className="smalltitlefont">
                TalkOfCode also offers a unique marketplace where members can
                buy and sell old tech products, fostering a culture of
                sustainability and resourcefulness within our community. Let's
                code, connect, and create together!
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default About;
