import React, { useState, useEffect } from "react";
import Layout from "../components/layout/layout";
import { useCart } from "../context/cart";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import toast from "react-hot-toast";
import cartimage from "../assests/cartimage.png";
import emptycart from "../assests/emptycart.png";
import { Image } from "antd";
import ".././App.css";
import { EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import DropIn from "braintree-web-drop-in-react";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";

const CartPage = () => {
  // const [Cart, setCart] = useCart();
  const [auth, SetAuth] = useAuth();
  const [Cartitems, SetCartItems] = useState([]);
  const Navigate = useNavigate();
  const [itemCount, setItemCount] = useState(0);
  const [totalprice, settotalprice] = useState(0);
  const [ClientToken, SetClientToken] = useState("");
  const [instance, Setinstance] = useState("");
  const [loading, SetLoading] = useState(false);

  function TotalPrice() {
    try {
      let total = 0;
      Cartitems?.map((item) => {
        total = total + item.product.price * item.quantity;
      });
      return total;
    } catch (error) {
      console.log(error);
    }
  }

  async function GetCartItems(id) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/product/getcartitems/${id}`
      );
      if (response.status == 200) {
        const { items, count } = await response.json();
        SetCartItems(items.CartItems);
        setItemCount(count);
      }
    } catch (error) {
      console.log(error);
      toast.error("cannot fetch cart items");
    }
  }

  async function RemoveCartitems(pid, uid) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/product/removecartitem/${pid}/${uid}`
      );
      if (response.status == 200) {
        GetCartItems(auth.user._id);
      } else {
        toast.error("Please try later");
      }
    } catch (error) {
      toast.error("Error in api");
    }
  }

  async function ChnageCartQuantity(pid, uid, val) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/product/changequantitycartitem/${pid}/${uid}`,
        {
          method: "post",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            value: val,
          }),
        }
      );
      if (response.status == 200) {
        GetCartItems(auth.user._id);
      } else {
        toast.error("error try later");
      }
    } catch (error) {
      toast.error("error try later");
    }
  }
  async function GetToken() {
    try {
      const response = await fetch(
        "https://ecomwebapp.onrender.com/api/v1/product/braintree/token"
      );
      const data = await response.json();
      if (data) {
        SetClientToken(data.clientToken);
      }
    } catch (error) {
      console.log(error);
    }
  }
  //handle payment

  async function HandlePayment() {
    try {
      SetLoading(true);

      const response = await fetch(
        "https://ecomwebapp.onrender.com/api/v1/product/braintree/payment",
        {
          headers: {
            "Content-Type": "application/json", // Specify the content type
            Authorization: auth?.token,
          },
          method: "POST",
          body: JSON.stringify(Cartitems),
        }
      );

      SetLoading(false);

      toast.success("Payment Succesfull");
      // setTimeout(() => {
      //   Navigate("/dashboard/user/orders");
      // }, 2000);
    } catch (error) {
      console.log(error);
      SetLoading(false);
    }
  }

  useEffect(() => {
    GetToken();
  }, [auth?.token]); //call the function only if the user is logged in
  //keep it to get drop in rendere
  useEffect(() => {
    settotalprice(TotalPrice());
  }, [Cartitems]);

  useEffect(() => {
    if (auth?.user?._id) {
      GetCartItems(auth.user._id);
    }
  }, [auth]);

  return (
    <Layout>
      <div style={{ width: "100%" }} className="mt-3">
        {auth?.token ? (
          //cart page items
          Cartitems.length > 0 ? (
            <div className="d-flex  justify-content-around flex-col align-items-center gap-4">
              <div style={{ width: "60%" }} className="width1000">
                <Swiper
                  effect={"coverflow"}
                  centeredSlides={true}
                  slidesPerView={3}
                  navigation={true}
                  spaceBetween={50}
                  coverflowEffect={{
                    rotate: 50,
                    stretch: 0,

                    modifier: 0,
                    slideShadows: true,
                  }}
                  modules={[EffectCoverflow, Pagination, Navigation]}
                  className="mySwiper"
                  initialSlide={1}
                  breakpoints={{
                    0: {
                      slidesPerView: 1,
                    },
                    500: {
                      slidesPerView: 3,
                      spaceBetween: 50,
                    },
                    // Add more breakpoints if needed
                  }}
                >
                  {Cartitems.map((item) => (
                    <SwiperSlide>
                      <div
                        className="card d-flex border border-3 boxlayoutproducts"
                        style={{ width: "16rem" }}
                      >
                        <div
                          style={{ width: "100%" }}
                          className="d-flex justify-content-center"
                        >
                          <Image
                            src={`http://localhost:8000/api/v1/product/get-productPhoto/${item.product._id}`}
                            className="card-Image-top productimage"
                            style={{ width: "100%", height: "10rem" }}
                          />
                        </div>

                        <div className="card-body text-start ProductDetailsCard">
                          <h5 className="card-title">
                            {item.product.name.substring(0, 15)}...
                          </h5>
                          {/* <p className="card-text" style={{ marginBottom: "7px" }}>
                      {item.product.description.substring(0, 40)}...
                    </p> */}
                          <p
                            className="card-text d-flex gap-2"
                            style={{ marginBottom: "0.2rem" }}
                          >
                            Quantity:{" "}
                            <span className="d-flex align-items-center gap-1">
                              <div className="minusplus">
                                {" "}
                                <FaMinus
                                  onClick={() => {
                                    ChnageCartQuantity(
                                      item.product._id,
                                      auth.user._id,
                                      -1
                                    );
                                  }}
                                />
                              </div>
                              {item.quantity}{" "}
                              <div className="minusplus">
                                <FaPlus
                                  onClick={() => {
                                    ChnageCartQuantity(
                                      item.product._id,
                                      auth.user._id,
                                      1
                                    );
                                  }}
                                />
                              </div>
                            </span>{" "}
                          </p>
                          <p className="card-text">
                            Price per item:{" "}
                            <span className="priceSpan">
                              ₹ {item.product.price}
                            </span>{" "}
                          </p>
                          <div className="d-flex justify-content-start gap-2  probuttons">
                            <button
                              className="btn btn-primary ButtonBorder "
                              onClick={() => {
                                Navigate(
                                  `/ProductDetails/${item.product.slug}`
                                );
                              }}
                            >
                              More details
                            </button>
                            <button
                              className="btn btn-danger  ButtonBorder "
                              onClick={() => {
                                RemoveCartitems(
                                  item.product._id,
                                  auth.user._id
                                );
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              {/* <div
                style={{ width: "30%", border: "2px solid black" }}
                className="d-flex flex-column p-2 width100 mb-4"
              >
                <h2 className="text-center">Cart Summary</h2>
                <p>
                  <b>Total Price :</b> {totalprice} Rs
                </p>
              </div> */}
              <div
                className="d-flex flex-column  width90"
                style={{ width: "40%" }}
              >
                <h2 className="text-center " style={{ margin: "0" }}>
                  Cart Summary
                </h2>

                <hr />
                <div className="card p-2">
                  <h5>
                    <b>Total Payable Amount:</b> ₹ {totalprice}.00 (This is only
                    for demo purpose you can pay)
                  </h5>
                  {/* <h5>
                    <b>Shipping Address:</b> {auth.user.Location}{" "}
                    <button
                      className="btn btn-dark"
                      onClick={() => {
                        Navigate("/dashboard/user/profile");
                      }}
                    >
                      Change Address
                    </button>
                  </h5> */}
                  <div className="d-flex flex-column align-items-center">
                    {!ClientToken || !Cartitems.length ? null : (
                      <>
                        <DropIn
                          options={{
                            authorization: ClientToken,
                          }}
                          onInstance={(instance) => Setinstance(instance)}
                        />
                        <button
                          className="btn btn-primary ButtonBorder"
                          onClick={() => {
                            HandlePayment();
                          }}
                          disabled={!instance}
                        >
                          {loading ? "Processing.." : "Make Payment"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <h4 className="text-center d-flex flex-column align-items-center">
              You have {itemCount} items in your cart.{" "}
              {itemCount == 0 ? (
                <>
                  {" "}
                  <img src={emptycart} style={{ margin: "auto" }}></img>
                  <NavLink to="/products">
                    <button className="btn btn-primary ">Add items</button>
                  </NavLink>
                </>
              ) : null}
            </h4>
          )
        ) : (
          //message if not login
          <div className="text-center d-flex flex-column align-items-center">
            <h4>Please login to access your cart</h4>
            <button
              className="btn btn-primary"
              onClick={() => {
                Navigate("/login");
              }}
            >
              Login
            </button>
            <Image src={cartimage}></Image>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
