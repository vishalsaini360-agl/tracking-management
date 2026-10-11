/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import Qrcode from "./qrcode";
import { socket } from "../../services/socket";
import { AuthContext } from "../../context/authContext";
import { LOGIN_API_URL, APPLICATION_ROUTES } from "../../utils/constants";
import { _GET, _POST } from "../../services/axios.method";
import { useHistory } from "react-router-dom";
import { postPlatormData } from "../../redux/action-creator/platformAction";
import { useDispatch } from "react-redux";
import { setUserProperty } from "../../analytics/EventController";
const Login = () => {
  const dispatch = useDispatch();
  let [qr, SetQr] = useState(null);
  const authContext = useContext(AuthContext);
  const { authData, authStateLoading } = authContext;
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const history = useHistory();

  useEffect(() => {
    (async () => {
      socket.on("connect", function () {
        // console.log("socket connection established");
        socket.emit("newQR");
      });

      socket.on("getQR", (data) => {
        SetQr(data.code);
        setLoading(false);
      });

      // if token is present as authData in the local storage, then navigate the user to main page
      if (authData) {
        await authContext.onLogin(authData, true);
        // Break the socket connection
        // socket.disconnect();
      }
      socket.on("authorized", async (data) => {
        await authContext.onLogin(data.token, true);
        // Break the socket connection
        // socket.disconnect();
      });

      socket.on("disconnect", () => {
        // console.log("Socket connection disconnected"); // Verification message
      });
    })();

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let isValid = true;
    setError("");

    // Validate email
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Invalid email");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };
  const handleLoginButton = async (e) => {
    e.preventDefault();
    const isValidForm = validateForm();
    if (isValidForm) {
      try {
        const data = { email: email, password: password };
        setLoading(true);
        const response = await _POST(LOGIN_API_URL, data);

        const token = response?.data?.data?.data;
        const platform = response?.data?.data?.allPlatforms;
        const currency = response?.data?.data?.currency;
        const currency_format = response?.data?.data?.currency_format;
        const client_name = response?.data?.data?.client_name;
        const userDetails = response?.data?.data?.userName;
        const client_id = response?.data?.data?.client_id;
        const user_id = response?.data?.data?.user_id;
        const role = response?.data?.data?.role;
        const email_id = response?.data?.data?.email_id;
        const client_projects = response?.data?.data?.client_projects;
        const active_client_project = response?.data?.data?.active_client_project;
        
        if (response.data.status.code === 400) {
          setError(response.data.status.message);
        }
        if (platform) {
          dispatch(postPlatormData(platform));
        }

        if (token) {
          localStorage.setItem("token", JSON.stringify(token));
          localStorage.setItem("name", userDetails);
          localStorage.setItem("currency", currency);
          localStorage.setItem("currency_format", currency_format);
          localStorage.setItem("client_id", client_id);
          localStorage.setItem("client_name", client_name);
          localStorage.setItem("user_id", user_id);
          localStorage.setItem("email_id", email_id);
          localStorage.setItem("client_projects", JSON.stringify(client_projects));
          localStorage.setItem("active_client_project", JSON.stringify(active_client_project));
          localStorage.setItem(
            "platforms",
            JSON.stringify({ platform: platform })
          );
          localStorage.setItem("role", role);
          setUserProperty(); //Firebase event to set client.

          await authContext.onLogin(token, true, userDetails);
          history.push(APPLICATION_ROUTES.COMMONSCREEN);
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <div className="loginpage">
        <div className="loginpage__card row items-stretch">
          <div className="loginpage__leftpanel">
            <div className="">
              <div className="loginpage__ebuxlogo">
                {/* <img src="assets/images/ebux-logo.png" /> */}
                {/* <img src="assets/images/ebux-logo-white-mini.png" /> */}
                <h1 className="rightpanel__heading">Digital Shelf Management</h1>                

              </div>
              <ul className="leftpanel__list">
                <li className="loginpage__items ">
                  {/* <img src="assets/images/icon-grey"/> */}
                  Omni-Channel Media Optimisation
                </li>

                <li className="loginpage__items">Retail Data Integration</li>

                <li className="loginpage__items">Bulk Action Management</li>

                <li className="loginpage__items">Comprehensive Reporting</li>
              </ul>
            </div>
          </div>
          <div className="loginpage__rightpanel col">
            <div className="loginpagerightpanel__logocontent">
              <div className="loginpagerightpanel__logo ">
                {" "}
                <img src="/assets/images/scan-line.svg" />
              </div>
            </div>
            <h1 className="rightpanel__heading">Scan QR Code</h1>
            <p className="rightpanel__subheading ">
              Scan this QR code in-app to verify a device
            </p>
            {/* {qr !== null && ( // Only render the QR code when it is available
              <div className="rightpanel__qrcode">
                <Qrcode qr={qr} />
              </div>
            )} */}

            <div>
              <form onSubmit={handleLoginButton}>
                <input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-4 px-4 py-2 rounded-md border border-gray-300 mr-3 focus:border-blue-500 focus:outline-none"
                />
                <input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mb-4 px-4 py-2 rounded-md border border-gray-300 mr-3 focus:border-blue-500 focus:outline-none"
                />
                <button
                  className="bg-blue-500 px-6 py-2 text-white rounded cursor-pointer"
                  type="submit"
                >
                  Login
                </button>
              </form>
            </div>

            {/* <div className="row justify-center items-center pt-1">
              <input
                type="checkbox"
                value=""
                className="rightpanel__chckbox mr-1"
              />
              <label for="default-checkbox" className="rightpanel__box ">
                Keep me signed in
              </label>
            </div> */}

            <div>
              {error && (
                <p
                  style={{
                    color: "red",
                    display: "flex",
                    justifyContent: "flex-start",
                    paddingLeft: 143,
                  }}
                >
                  * {error}
                </p>
              )}
              {emailError && (
                <p
                  style={{
                    color: "red",
                    display: "flex",
                    justifyContent: "flex-start",
                    paddingLeft: 143,
                  }}
                >
                  *{emailError}
                </p>
              )}
              {passwordError && (
                <p
                  style={{
                    color: "red",
                    display: "flex",
                    justifyContent: "flex-start",
                    paddingLeft: 143,
                  }}
                >
                  {" "}
                  *{passwordError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
