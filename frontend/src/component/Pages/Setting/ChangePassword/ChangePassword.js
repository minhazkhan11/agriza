import React, { useState } from "react";
import useStyles from "../../../../styles";
import {
  Button,
  FormLabel,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import ChangePasswordImg from "../../../images/changepassword/changepassword.png";

import axios from "axios";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const classes = useStyles();
  const navigate = useNavigate();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  // State variables for the form fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  const [oldPasswordError, setOldPasswordError] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [retypePasswordError, setRetypePasswordError] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case "old":
        setShowOldPassword(!showOldPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "retype":
        setShowRetypePassword(!showRetypePassword);
        break;
      default:
        break;
    }
  };

  const isValidPassword = (value) => {
    const hasNumbers = /\d/.test(value);
    const hasLetters = /[a-zA-Z]/.test(value);
    return hasNumbers && hasLetters && value.length >= 6;
  };

  const handlePasswordChange = (setter, value) => {
    setter(value);
    // Set error state to true if fewer than 6 characters are entered
    if (value.length < 6) {
      switch (setter) {
        case setOldPassword:
          setOldPasswordError(true);
          break;
        case setNewPassword:
          setNewPasswordError(true);
          break;
        case setRetypePassword:
          setRetypePasswordError(true);
          break;
        default:
          break;
      }
    } else {
      // Reset error state when input length is 6 or more characters
      setOldPasswordError(false);
      setNewPasswordError(false);
      setRetypePasswordError(false);
    }
  };

  const handleSavePassword = async () => {
    // Check if all passwords match
    // debugger;

    if (!oldPassword.trim()) {
      toast.error("Old password is required.");
      return;
    }
    if (!newPassword.trim()) {
      toast.error("New password is required.");
      return;
    }
    if (!retypePassword.trim()) {
      toast.error("Retype password is required.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be minimum 6 characters long.");
      return;
    }

    if (newPassword !== retypePassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/auth/changepassword`,
        {
          current_password: oldPassword,
          password: newPassword,
          password_confirmation: retypePassword,
        },
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Password updated successfully!");
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 2000);
      } else {
        toast.error("Failed to update password.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Error updating password.";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className={`${classes.p2}`}>
        <div
          className={`${classes.p2} ${classes.bgwhite} ${classes.dflex} ${classes.borderradius6px} ${classes.justifyspacebetween} ${classes.boxshadow3}`}
        >
          <div
            className={`${classes.p2} ${classes.inputpadding} ${classes.inputborder} ${classes.dflex} ${classes.flexdirectioncolumn} ${classes.justifyspacebetween} ${classes.w45}`}
          >
            <Typography
              variant="h3"
              className={`${classes.fontsize} ${classes.fontfamilyDMSans} ${classes.fw700}`}
            >
              Change Password <span className={classes.textcolorred}>*</span>
            </Typography>
            <div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} `}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Old Password <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  name="password"
                  type={showOldPassword ? "text" : "password"}
                  onChange={(e) =>
                    handlePasswordChange(setOldPassword, e.target.value)
                  }
                  variant="outlined"
                  error={oldPasswordError}
                  value={oldPassword}
                  helperText={
                    oldPasswordError
                      ? "Password must be at least 6 characters"
                      : ""
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => togglePasswordVisibility("old")}
                          edge="end"
                        >
                          {showOldPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.mt1} ${classes.flexdirectioncolumn}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Type New Password{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  onChange={(e) =>
                    handlePasswordChange(setNewPassword, e.target.value)
                  }
                  variant="outlined"
                  value={newPassword}
                  error={newPasswordError}
                  helperText={
                    newPasswordError
                      ? "Password must be at least 6 characters"
                      : ""
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => togglePasswordVisibility("new")}
                          edge="end"
                        >
                          {showNewPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.mt1} ${classes.flexdirectioncolumn}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Retype Password{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  name="retypePassword"
                  variant="outlined"
                  type={showRetypePassword ? "text" : "password"}
                  onChange={(e) =>
                    handlePasswordChange(setRetypePassword, e.target.value)
                  }
                  error={retypePasswordError}
                  value={retypePassword}
                  helperText={
                    retypePasswordError
                      ? "Password must be at least 6 characters"
                      : ""
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => togglePasswordVisibility("retype")}
                          edge="end"
                        >
                          {showRetypePassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
            <Button
              className={`${classes.custombtnblue} ${classes.mt1}`}
              fullWidth
              onClick={handleSavePassword}
            >
              Save Password
            </Button>
          </div>
          <div className={`${classes.w50}`}>
            <img src={ChangePasswordImg} alt="img" width="90%" />
          </div>
        </div>
      </div>
    </>
  );
}
export default ChangePassword;
