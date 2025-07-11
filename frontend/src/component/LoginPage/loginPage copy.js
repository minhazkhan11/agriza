import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  makeStyles,
  Typography,
  Divider,
  Grid,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import AdminBannerImage from "../images/LoginpageImage/coachingbackground.png";
import MobileBackgroundImage from "../images/LoginpageImage/coachingmobile.png";
import CoachingLogo from "../images/LoginpageImage/coachinlogo.png";
import CallIcon from "@material-ui/icons/Call";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { encryptData } from "../../crypto";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "100vw",
    height: "100vh",
    margin: 0,
    display: "flex",
    position: "relative",
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(225, 225, 225, 1)",
      borderWidth: "1px",
    },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(225, 225, 225, 1)",
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      background: `url(${MobileBackgroundImage}) `,
      backgroundSize: "100% 31%",
      backgroundRepeat: "no-repeat",
    },
  },
  backgroundContainer: {
    flex: 1,
    background: `url(${AdminBannerImage}) center/cover no-repeat`,
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      display: "none",
    },
  },
  textContainer: {
    position: "absolute",
    top: "45%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    color: "white",
    whiteSpace: "nowrap",
    [theme.breakpoints.down("sm")]: {
      position: "absolute",
      top: "45%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
  },
  heading: {
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "700",
    fontSize: "38px",
    color: "rgba(255, 255, 255, 1)",
    [theme.breakpoints.down("sm")]: {
      fontSize: "28px",
    },
  },
  Subheading: {
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "500",
    fontSize: "20px",
    lineHeight: "40px",
    color: "rgba(255, 255, 255, 1)",
    [theme.breakpoints.down("sm")]: {
      fontSize: "16px",
      lineHeight: "20px",
      color: "rgba(255, 187, 84, 1)",
    },
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  additionalCard: {
    width: "450px",
    height: "530px",
    position: "relative",
    top: "50%",
    transform: "translateY(-50%)",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: "auto",
      minHeight: "auto",
      padding: "20px",
      position: "relative",
      top: "26%",
      left: "auto",
      transform: "none",
    },
  },

  headingText: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: "30px",
    color: "rgba(48, 48, 48, 1)",
    fontWeight: "700",
    margin: "20px 0px 0px -53px",
    [theme.breakpoints.down("sm")]: {
      margin: "18px 0px 0px 0px",
      fontSize: "25px",
    },
  },
  inputContainer: {
    width: "80%",
    margin: "30px auto 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    [theme.breakpoints.down("sm")]: {
      margin: "3px auto 0",
    },
  },
  inputField: {
    margin: "15px 0",
    width: "100%",
    borderRadius: "6px",
    backgroundColor: "rgba(249, 249, 255, 1)",
    boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.05)",
  },
  inputLabel: {
    fontSize: "18px",
    fontWeight: "500",
    fontFamily: "Satoshi",
    color: "rgba(39, 39, 39, 1)",
    transform: "translateY(60%)",
  },
  button: {
    margin: "35px 0",
    width: "100%",
    fontWeight: "600",
    fontSize: "16px",
    FontFamily: "Poppins",
    height: "55px",
    borderRadius: "6px",
    backgroundColor: "rgba(248, 158, 23, 1)",
    color: "rgba(255, 255, 255, 1)",
    "&:hover": {
      backgroundColor: "rgba(248, 158, 23, 1)",
    },
    [theme.breakpoints.down("sm")]: {
      background: "linear-gradient(90.73deg, #F7971E -6.1%, #FFD200 111.16%)",
      textTransform: "uppercase",
      margin: "15px 0",
    },
  },
  loginWithOtp: {
    fontFamily: "Plus Jakarta Sans",
    alignSelf: "end",
    fontSize: "1rem",
    fontWeight: "500",
    color: "rgba(36, 84, 255, 1)",
    textDecoration: "none",
    [theme.breakpoints.down("sm")]: {
      margin: "2px auto",
    },
  },
  inputText: {
    fontSize: "15px",
    FontFamily: "Satoshi",
    fontWeight: "500",
  },
  inputFieldWithIcon: {
    display: "flex",
    alignItems: "center",
  },
  icon: {
    color: "rgba(202, 202, 202, 1)",
  },
  passwordInput: {
    display: "flex",
    margin: "15px 0",
    width: "100%",
    backgroundColor: "rgba(249, 249, 255, 1)",
  },
  logoIcon: {
    position: "absolute",
    top: "29%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    color: "white",
    [theme.breakpoints.down("sm")]: {
      top: "20%",
    },
  },
  divider: {
    margin: "10px 0",
  },
  dividerText: {
    color: "rgba(39, 39, 39, 1)",
    backgroundColor: "rgba(255, 255, 255, 1)",
    fontWeight: "bold",
    padding: "0 10px",
  },
  horizontalLine: {
    margin: "20px 0",
    color: "red",
  },
  red: {
    color: "red", // or any other styling you want
  },
  loginText: {
    fontFamily: "Plus Jakarta Sans",
    margin: "30px auto",
    textAlign: "center",
    fontSize: "19px",
    fontWeight: "500",
    color: "rgba(26, 61, 147, 1)",
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      margin: "2px auto",
    },
  },
  dividerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "10px 0",
    width: "100%",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      margin: "15px 0",
    },
  },

  dividerLeft: {
    flex: 1,
    margin: "0 30px 0 0",
    height: "1px",
    backgroundColor: "rgba(76, 77, 77, 1)",
  },

  dividerRight: {
    flex: 1,
    height: "1px",
    backgroundColor: "rgba(76, 77, 77, 1)",
    margin: "0 5px 0 0",
  },

  orText: {
    padding: "0 16px",
    fontFamily: "Poppins",
    fontWeight: "400",
    fontSize: "16px",
    color: "rgba(0, 0, 0, 0.54)",
    position: "absolute",
    top: "-10px",
    left: "50%",
    transform: "translateX(-50%)",
  },
  mobileContainer: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "block",
      position: "absolute",
      top: "6%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
      color: "white",
      whiteSpace: "nowrap",
    },
  },
}));

function LoginPage({ onLogin }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [formError, setFormError] = useState({});
  const [error, setError] = useState("Please enter your detail");
  const [showPassword, setShowPassword] = useState(false);
  const [errmsg, setErrMsg] = useState("");



  // const handleSubmit = () => {
  //   setIsSubmitClicked(true);
  //   setFormError(validateForm());
  // };
  const handleSubmit = () => {
    const formErrors = validateForm();

    
    if (Object.keys(formErrors).length === 0) {
      // If no errors, proceed with form submission
      setIsSubmitClicked(true);
      setFormError({});
      // Your existing code for submitting the form
    } else {
      // If there are errors, update the state to display them
      setFormError(formErrors);
      setIsSubmitClicked(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [pageURL, setPageURL] = useState("");

  useEffect(() => {
    setPageURL(window.location.href);
  }, []);

  const urlParams = new URLSearchParams(pageURL.split("?")[1]);
  const token = urlParams.get("token");
  const userName = urlParams.get("userName");

  useEffect(() => {
    if (token && userName) {
      // sessionStorage.setItem('token', token);
      // sessionStorage.setItem('userName', userName);

      const encryptedToken = encryptData(token);
      const encryptedUser = encryptData(userName);

      sessionStorage.setItem("token", encryptedToken);
      sessionStorage.setItem("userName", encryptedUser);

      onLogin();
      navigate("/admin/dashboard");
    }
  }, [token, userName, onLogin, navigate]);

  useEffect(() => {
    if (isSubmitClicked && Object.keys(formError).length === 0) {
      axios({
        method: "post",
        url: `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/coaching/auth/signin`,
        data: {
          user: {
            username: email,
            password: password,
          },
        },
      }).then(
        (response) => {
          if (response.data.success === true) {
            const encryptedToken = encryptData(response.data.token);

            const username = response.data.user.first_name;

            const encryptedUser = encryptData(username);

            sessionStorage.setItem("token", encryptedToken);
            sessionStorage.setItem("userName", encryptedUser);

            onLogin();
            navigate("/admin/dashboard");
          }
        },
        (error) => {
          sessionStorage.clear();
          setIsSubmitClicked(false);
          setError(error.response.data.message);
          setErrMsg(error.response.data.message);
        }
      );
    } else {
      setIsSubmitClicked(false);
    }
  }, [isSubmitClicked, formError, email, password, onLogin, navigate]);

  const validateForm = () => {
    var errors = {};

    // if (email.length === 0) {
    //   errors.email = "required";
    // }

    // if (password.length === 0) {
    //   errors.password = "required";
    // }
    const phoneRegex = /^\d{10}$/;
    if (email.length === 0) {
      errors.email = "Phone number is required";
    } else if (!phoneRegex.test(email)) {
      errors.email = "Invalid phone number format";
    }
    // Password validation (at least 8 characters)
    if (password.length === 0) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  return (
    <>
      <Card className={classes.card}>
        <div className={classes.mobileContainer}>
          <img
            src={CoachingLogo}
            alt=""
            className={classes.mobileIcon}
            style={{ width: "33%", marginTop: "41px" }}
          />
          <Typography variant="h3" className={classes.heading}>
            Welcome Back
          </Typography>
          <Typography variant="h4" className={classes.Subheading}>
            Enter Your Credentials
          </Typography>
        </div>
        <div className={classes.backgroundContainer}>
          <img src={CoachingLogo} alt="" className={classes.logoIcon} />
          <div className={classes.textContainer}>
            <Typography variant="h3" className={classes.heading}>
              Welcome Back
            </Typography>
            <Typography variant="h4" className={classes.Subheading}>
              Login to Your Admin Account
            </Typography>
          </div>
        </div>
        <CardContent className={classes.content}>
          <div className={classes.additionalCard}>
            <Grid container direction="column" alignItems="center">
              <Typography variant="h4" className={classes.headingText}>
                Coaching Admin Panel
              </Typography>
              <Typography variant="overline" display="block" className={classes.red}>
                     {error}
                   </Typography>
              <div className={classes.inputContainer}>
                <Typography className={classes.inputLabel}>
                  Enter Phone Number
                </Typography>
                <TextField
                  placeholder="+91 9876543210"
                  className={classes.inputField}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                  variant="outlined"
                  InputProps={{
                    classes: {
                      input: classes.inputText,
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton className={classes.icon}>
                          <CallIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <font align="left" color="red">
                  {formError.email}
                </font>
                <Link
                  variant="subtitle1"
                  className={classes.loginWithOtp}
                  onClick={() => {
                    axios({
                      method: "post",
                      url: `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/coaching/auth/signin_with_otp`,
                      data: {
                        user: {
                          username: email,
                        },
                      },
                    }).then(
                      (response) => {
                        navigate(`/otpscreen/${email}`);
                        // handle the response data as needed
                      },
                      (error) => {
                        console.error(
                          "OTP request failed:",
                          error.response.data.message
                        );
                        // handle the error as needed
                      }
                    );
                  }}
                >
                  Login With OTP
                </Link>
                <Typography className={classes.inputLabel}>
                  Enter Password
                </Typography>
                <TextField
                  placeholder="**********"
                  className={classes.passwordInput}
                  value={password}
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  InputProps={{
                    classes: {
                      input: classes.inputText,
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility}>
                          {showPassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <font align="left" color="red">
                  {formError.password}
                </font>
                <Button onClick={handleSubmit} className={classes.button}>
                  Login
                </Button>
              </div>
            </Grid>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
export default LoginPage;
