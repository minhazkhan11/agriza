import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Divider,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import loginscreenImage from "../images/LoginpageImage/loginscreen.jpg";
import loginscreenImage2 from "../images/LoginpageImage/loginScreen2.jpg";
import leftimgImage from "../images/LoginpageImage/leftimg.png";
import { ReactComponent as CallIcon } from "../images/LoginpageImage/call.svg";
import { ReactComponent as LockIcon } from "../images/LoginpageImage/lock.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { encryptData } from "../../crypto";
import { toast, ToastContainer } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  container: {
    background: `url(${loginscreenImage2}) center/cover no-repeat`,
    width: "100vw",
    height: "100vh",
    display: "flex",
    position: "relative",
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(225, 225, 225, 1)",
      borderWidth: "1px",
    },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(225, 225, 225, 1)",
    },
  },
  imgcard: {
    background: `url(${leftimgImage}) center/cover no-repeat`,
    width: "40%",
    height: "90vh",
    margin: "2rem",
    borderRadius: "15px",
  },
  formcard: {
    width: "50%",
    height: "90vh",
    margin: "2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  heading: {
    color: "white",
    width: "85%",
    fontWeight: "600",
  },
  Subheading: {
    color: "white",
    fontSize: "12px",
  },
  dividercont: {
    display: "flex",
    width: "130px",
    justifyContent: "space-between",
  },
  colororange: {
    color: "#FF984F",
  },
  colorwhite: {
    color: "#fff",
  },
  dividerorange: {
    width: "60px",
    height: "2px",
    backgroundColor: "#FF984F",
  },
  dividerwhite: {
    width: "60px",
    height: "2px",
    backgroundColor: "#fff",
  },
  formcardinner: {
    width: "50%",
  },
  formcontainer: {
    width: "50%",
    "& .MuiTypography-root": {
      marginTop: "0.5rem",
    },
    "& .MuiFormControl-root": {
      marginTop: "0.5rem",
      color: "white",
      background: "#2F2B34",
    },
    "& .MuiInputBase-input": {
      color: "white",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#6C6C6C",
    },
  },

  inputContainer: {
    marginTop: "3rem",
    color: "white",
    display: "flex",
    flexDirection: "column",
  },
  inputLabel: {
    fontSize: "14px",
  },

  //   inputField:{
  //   backgroundColor: "#5A6645",
  //   color: "#FFF",
  //   borderRadius: "8px",
  //   border: "1px solid white",
  //   // padding: "10px",
  // },

  button: {
    marginTop: "2rem",
    backgroundColor: "#FF984F",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#FF984F",
      color: "#fff",
    },
  },
}));

function LoginPage({ onLogin }) {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [formError, setFormError] = useState({});
  const [error, setError] = useState("Please enter your detail");
  const [errmsg, setErrMsg] = useState("");
  const navigate = useNavigate();

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

  useEffect(() => {
    if (isSubmitClicked && Object.keys(formError).length === 0) {
      axios({
        method: "post",
        url: `${process.env.REACT_APP_API_BASE_URL}/v1/admin/auth/signin`,
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
            const entityDetails = response.data.entity_details || "";
            const assigned_to = response.data?.assigned_to || "";
            const encryptedUser = encryptData(username);
            const encryptedUserROle = encryptData(response.data.user.role);
            const encryptedAddedBy = encryptData(response.data.user.added_by);
            const encryptedBusinessName = encryptData(
              response?.data?.entity_details?.business_name
            );
       

            sessionStorage.setItem("token", encryptedToken);
            sessionStorage.setItem("userName", encryptedUser);
            sessionStorage.setItem("businessName", encryptedBusinessName);
            sessionStorage.setItem("userRole", encryptedUserROle);
            sessionStorage.setItem("addedBy", encryptedAddedBy);
            sessionStorage.setItem(
              "entityDetails",
              JSON.stringify(entityDetails)
            );
                 sessionStorage.setItem(
              "assigned_to",
              JSON.stringify(assigned_to)
            );

            onLogin();
            navigate("/dashboard");
          }
        },
        (error) => {
          sessionStorage.clear();
          setIsSubmitClicked(false);
          setError(error.response.data.message);
          setErrMsg(error.response.data.message);
          toast.error("Please Enter Correct Mobile Number and Password");
        }
      );
    } else {
      setIsSubmitClicked(false);
    }
  }, [isSubmitClicked, formError, email, password, onLogin, navigate]);

  return (
    <>
      <ToastContainer />
      <Card className={classes.container}>
        <div className={classes.imgcard}></div>
        <div className={classes.formcard}>
          <div className={classes.formcardinner}>
            <Typography variant="h4" className={classes.heading}>
              <span className={classes.colororange}>sign up </span>
              into
            </Typography>
            <Typography variant="h4" className={classes.heading}>
              your account
            </Typography>
            <Typography className={classes.Subheading}>
              Let us make the circle bigger!
            </Typography>
            <div className={classes.dividercont}>
              <Divider className={classes.dividerorange} />
              <Divider className={classes.dividerwhite} />
            </div>
          </div>
          <div className={classes.formcontainer}>
            <div className={classes.inputContainer}>
              <Typography className={classes.inputLabel}>
                Enter Mobile Number
              </Typography>
              <TextField
                placeholder="+91 9876543210"
                className={classes.inputField}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                value={email}
                variant="outlined"
                InputProps={{
                  classes: {
                    input: classes.inputText,
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      {/* <IconButton className={classes.icon}> */}
                      <CallIcon />
                      {/* </IconButton> */}
                    </InputAdornment>
                  ),
                }}
              />
              <font align="left" color="red">
                {formError.email}
              </font>
              <Typography className={classes.inputLabel}>Password</Typography>
              <TextField
                placeholder="**********"
                className={classes.passwordInput}
                value={password}
                variant="outlined"
                // type={showPassword ? "text" : "password"}
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                InputProps={{
                  classes: {
                    input: classes.inputText,
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      {/* <IconButton
                      // onClick={togglePasswordVisibility}
                      > */}
                      <LockIcon />
                      {/* </IconButton> */}
                    </InputAdornment>
                  ),
                }}
              />
              <font align="left" color="red">
                {formError.password}
              </font>
              <Button
                onClick={handleSubmit}
                className={classes.button}
                fullWidth
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
export default LoginPage;
