import HomeLayout from "../components/layout/HomePageLayout";
import News from "../assests/Illustrations/News.svg";
import Question from "../assests/Illustrations/Question.svg";
import Websirehomepage from "../assests/Illustrations/Websirehomepage.svg";
import React, { useEffect } from "react";
import Card from "react-bootstrap/Card";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaCartShopping } from "react-icons/fa6";
import { NavLink, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Swiper, SwiperSlide } from "swiper/react";
import { MdOutlineConnectingAirports } from "react-icons/md";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCoverflow, Pagination } from "swiper/modules";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
  transition: "opacity 0.3s ease-in-out",
}));

function Home() {
  useEffect(() => {
    AOS.init({
      offset: 150,
      duration: 700,
      once: true,
      mirror: false,
    });
  }, []);

  const [expanded, setExpanded] = React.useState("false");
  const [product, setProduct] = React.useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://ayushreactbackend.onrender.com/api/v1/product/get-product"
        );
        const data = await response.json();

        setProduct(data.products.slice(0, 10));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const theme = createTheme({
    palette: {
      ochre: {
        darker: blue[900],
        danger: "#f90707",
        dangerHover: "rgb(195, 23, 23)",
      },
    },
  });

  return (
    <HomeLayout>
      {/* home */}
      <div className=" d-flex flex-column">
        <div className="homepage-section d-flex justify-content-around align-items-center">
          <div
            className=" d-flex flex-column justify-content-center align-items-center "
            style={{ gap: "1rem" }}
            data-aos="fade-right"
          >
            <h1 className=" mt-3 text-center WelcomeText">
              {" "}
              Welcome to <mark>TalkOfCode</mark>
              <br></br>
              Your Dynamic Tech Community
            </h1>
            <p className="text-center">
              Empowering Tech Enthusiasts to Learn, Connect, and Innovate.
            </p>
            <ThemeProvider theme={theme}>
              <NavLink to="/About">
                <Button variant="contained" sx={{ bgcolor: "ochre.darker" }}>
                  About us
                </Button>
              </NavLink>
            </ThemeProvider>
          </div>
          <img
            src={Websirehomepage}
            data-aos="fade-left"
            style={{ width: "30%" }}
            className="width50"
          ></img>
        </div>{" "}
      </div>

      {/* products */}
      <div className=" d-flex align-items-center flex-column justify-content-center w-100  mb-3">
        <h1 className=" w-50 text-center WelcomeText mt-5">
          {" "}
          More than 30+ Products Listed. Checkout Now!
        </h1>
        <div style={{ width: "100%", marginTop: "0%", marginBottom: "2rem" }}>
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            spaceBetween={20}
            slidesPerView={4}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              modifier: 0,
              slideShadows: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              576: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              992: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
              1200: {
                slidesPerView: 5,
                spaceBetween: 50,
              },
            }}
            pagination={{
              clickable: true,
            }}
            modules={[EffectCoverflow, Pagination]}
            className="mySwiper"
            style={{ marginBottom: "2rem" }}
            initialSlide={0}
          >
            {product.map((p) => (
              <SwiperSlide key={p._id}>
                <Card
                  style={{
                    width: "16rem",
                    height: "auto",
                    margin: "5px",
                    position: "relative",
                  }}
                >
                  <div className="user-image2 boxshadow">
                    <Card.Img
                      variant="top"
                      src={`https://ayushreactbackend.onrender.com/api/v1/product/get-productPhoto/${p._id}`}
                      style={{
                        width: "100%",
                        height: "17rem",
                        objectFit: "cover",
                      }}
                      className="unselectable img-fluid"
                    />

                    <div
                      style={{
                        position: "absolute",
                        top: "0.5rem",
                        right: "0.5rem",
                      }}
                    >
                      <div className="bg-primary rounded-circle p-2 d-flex align-items-center justify-content-center">
                        <FaCartShopping
                          className="text-white"
                          style={{ width: "1.5rem", height: "1.5rem" }}
                        />
                      </div>
                    </div>
                  </div>

                  <Card.Body>
                    <div className="d-flex justify-content-around smalltitlefont4">
                      <Card.Title className="ff smalltitlefont4 unselectable mb-0 w-60">
                        {p.name}
                      </Card.Title>
                      <p className="text-gray-600 mb-3 w-35">₹{p.price}</p>
                    </div>
                  </Card.Body>
                </Card>
              </SwiperSlide>
            ))}

            <div className="center3">
              <NavLink to="/products">
                <button className="btn btn-primary mt-4">See More</button>
              </NavLink>
            </div>
          </Swiper>
        </div>
      </div>

      {/* connect */}
      <div className=" justify-content-around align-items-center">
        <h1 className="text-center WelcomeText mb-4 mt-4">
          Code <MdOutlineConnectingAirports /> Connect, <br></br>
          <span className="text-center">
            where Knowledge Meets Collaboration.{" "}
          </span>
        </h1>
        <div className="d-flex codechatgpt justify-content-around mt-5">
          {" "}
          <div className="w-25 width1000">
            <img src={Question} className="w-100" c></img>
          </div>
          <div
            className="w-50 user-tile d-flex flex-column p-3 gap-2 "
            style={{ backgroundColor: "white" }}
          >
            <span className="fs-3 fw-bold tc"> Have Doubts?</span>
            <div className="fs-5 ">
              Ask questions from experienced people. Share knowledge and learn
              from others in the community. Explore resources for expanding your
              skills.
            </div>

            <NavLink to="/interaction ">
              <button className=" btn btn-primary mt-2">Explore</button>
            </NavLink>
          </div>
        </div>
      </div>

      {/* news */}

      <div className="  mt-5 ">
        <h1 className="text-center WelcomeText ">
          Get instant technical <span className="d-block">news</span>
        </h1>

        <div className="d-flex  justify-content-around w-100 m-auto mt-5 directionrev">
          <div
            className="d-flex flex-column justify-content-center align-items-center  gap-2  p-3 width1000 tc"
            style={{ width: "40%" }}
          >
            <h2 className="fw-bold">
              Stay updated with the latest tech news on our website!
            </h2>
            <h5>
              Explore the latest in tech news and stay informed about
              cutting-edge developments, innovations, and trends in the
              ever-evolving world of technology.
            </h5>

            <Link to="/technews">
              <button className="btn btn-primary">Explore &rarr;</button>
            </Link>
          </div>

          {/* Right side */}
          <div style={{ width: "25%" }} className="width70 auto ">
            <img src={News} className="w-100"></img>
          </div>
        </div>
        <div className=" AccordianParent">
          <h1 className=" w-100 text-center WelcomeText mb-3">
            {" "}
            Frequently Asked Questions
          </h1>
          <div className="Accordian1">
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Typography style={{ fontFamily: "unset", fontWeight: "600" }}>
                  What is TalkOfCode?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography style={{ fontFamily: "unset", fontWeight: "600" }}>
                  TalkOfCode is a dynamic tech community platform that brings
                  together tech enthusiasts, students, developers, and
                  entrepreneurs to learn, connect, and innovate in the world of
                  technology.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
            >
              <AccordionSummary
                aria-controls="panel2d-content"
                id="panel2d-header"
              >
                <Typography style={{ fontFamily: "unset", fontWeight: "600" }}>
                  How can I join TalkOfCode?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography style={{ fontFamily: "unset", fontWeight: "600" }}>
                  Joining TalkOfCode is simple! Click on the "Sign Up" button on
                  our homepage, fill in your details, and become part of our
                  vibrant community.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel3"}
              onChange={handleChange("panel3")}
            >
              <AccordionSummary
                aria-controls="panel3d-content"
                id="panel3d-header"
              >
                <Typography style={{ fontFamily: "unset", fontWeight: "600" }}>
                  What services does TalkOfCode offer?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography style={{ fontFamily: "unset", fontWeight: "600" }}>
                  TalkOfCode offers a range of services, including tech news
                  updates, a platform for solving student doubts, and a
                  marketplace for buying and selling study materials.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel4"}
              onChange={handleChange("panel4")}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel4d-header"
              >
                <Typography style={{ fontFamily: "unset", fontWeight: "600" }}>
                  How can I contribute to TalkOfCode?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography style={{ fontFamily: "unset", fontWeight: "600" }}>
                  You can contribute to TalkOfCode by sharing your knowledge,
                  answering questions, participating in discussions, and helping
                  fellow members of the community.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>{" "}
        </div>
      </div>
    </HomeLayout>
  );
}

export default Home;
