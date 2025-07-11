import React, { useRef, useState, useEffect } from "react";
import {
  AppBar,
  Avatar,
  Badge,
  ClickAwayListener,
  Divider,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ReactComponent as MenuIcon } from "../images/headericon/hamburgericon.svg";
import { ReactComponent as ThemeIcon } from "../images/headericon/themechangeicon.svg";
import { ReactComponent as NotificationIcon } from "../images/headericon/notificationicon.svg";
import { ReactComponent as LogoutIcon } from "../images/headericon/logouticon.svg";
import { ReactComponent as ProfileIcon } from "../images/headericon/profileicon.svg";
import { ReactComponent as ChangePasswordIcon } from "../images/headericon/changepasswordicon.svg";
import { ReactComponent as SettingIcon } from "../images/headericon/settingicon.svg";
import { ReactComponent as UserIcon } from "../images/headericon/usericon.svg";
import { ReactComponent as Logout1Icon } from "../images/headericon/logouticon1.svg";
import { ReactComponent as BusinessIcon } from "../images/headericon/addbussinessicon.svg";
import { ReactComponent as BankIcon } from "../images/headericon/bankicon.svg";
import { ReactComponent as WarehouseIcon } from "../images/headericon/warehouseicon.svg";
import { ReactComponent as AddStaffIcon } from "../images/headericon/addstafficon.svg";
import { ReactComponent as LicenseIcon } from "../images/headericon/licenseIcon.svg";
import ShoppingCartSharpIcon from "@material-ui/icons/ShoppingCartSharp";
import { Button } from "@mui/material";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useStyles from "../../styles";
import { Link } from "react-router-dom";
import axios from "axios";
import { decryptData } from "../../crypto";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@material-ui/core/styles";
import NotificationEmptyImage from "../images/headericon/notificationimg.jpg";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { toast } from "react-toastify";
import useCartLive from "./useCartLive";

function Header(props) {
  const { toggleDarkMode, handleMenuCollapse } = props;

  const navigate = useNavigate();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const decryptedUserRole = decryptData(sessionStorage.getItem("userRole"));
  const decryptedUserName = decryptData(sessionStorage.getItem("userName"));
  const decryptedAddedBy = decryptData(sessionStorage.getItem("addedBy"));
  const decryptedCartData = useCartLive();

  const entityDetailsNew = JSON.parse(sessionStorage?.getItem("entityDetails"));

  const handleClose = (event) => {
    if (
      event &&
      anchorRef.current &&
      anchorRef.current.contains(event.target)
    ) {
      return;
    }
    setOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  };
  const handleLogout = (event) => {
    handleClose({ target: document.body });
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    // Clear sessionStorage
    sessionStorage.clear();
    // Navigate to home URL
    window.location.href = "/";

    // setOpen(false);
  };

  const handleCheck = (type, rowId) => {
    const data = {
      be_information: {
        pan_number: entityDetailsNew.pan_number,
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/business_entity_basic/profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        const localState = response.data;
        navigate("/myprofile", { state: localState });
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleCheckStaff = (type, rowId) => {
    navigate("/profile");
  };

  const getInitials = (name) => {
    return name && name.trim() ? name.charAt(0).toUpperCase() : "A";
  };

  return (
    <AppBar
      className={`${classes.headermain} ${classes.dflex} ${classes.w100} ${classes.h62px} ${classes.bgblue} ${classes.boxshadow0} ${classes.justifycenter}`}
      position="static"
    >
      <Toolbar className={`${classes.justifyspacebetween} ${classes.p0}`}>
        <IconButton
          edge="start"
          className={`${classes.ml1} ${classes.mr1}`}
          color="inherit"
          aria-label="menu"
          onClick={handleMenuCollapse}
        >
          <MenuIcon />
        </IconButton>

        <div
          className={`${classes.dflex} ${classes.bgdarkblue} ${classes.bgdarkblue} ${classes.h62px} ${classes.py5px}  ${classes.pr4} ${classes.pl2} ${classes.alignitemscenter}`}
        >
          <div className={`${classes.dflex} ${classes.alignitemscenter}`}>
            {/* {decryptedUserRole === "superadmin" && <div></div>} */}

            {decryptedUserRole !== "superadmin" && (
              <>
                <div>
                  <Button
                    className={`${classes.custombtnblue} ${classes.mr1} ${classes.ml1}`}
                    onClick={() => {
                      window.open(
                        `${process.env.REACT_APP_API_AGRIZA_WEBSITE_URL}/?token=${decryptedToken}&userName=${decryptedUserName}`,
                        "_blank"
                      );
                    }}
                  >
                    Access Market Place
                  </Button>
                </div>

                {/* <Button
                  className={`${classes.mr1} ${classes.bgtransparent} ${classes.bghoverwhite} ${classes.boxshadow0} ${classes.w27px} ${classes.p0_5} `}
                  variant="contained"
                  color="primary"
                  ref={anchorRef}
                  aria-controls={open ? "menu-list-grow" : undefined}
                  aria-haspopup="true"
                  onClick={handleToggle}
                >
                  <SettingIcon />
                  {open ? (
                    <ExpandLess className={classes.textcolorwhite} />
                  ) : (
                    <ExpandMore className={classes.textcolorwhite} />
                  )}
                </Button> */}
              </>
            )}

            {decryptedUserRole !== "superadmin" && (
              <Button
                className={`${classes.mr0_5} ${classes.bgtransparent} ${classes.badgeOrange} ${classes.muiIconSize} ${classes.bghoverwhite} ${classes.boxshadow0} ${classes.w27px} ${classes.p0_5} `}
                variant="contained"
                color="primary"
                onClick={() => navigate("/checkout-view")}
              >
                <Badge
                  badgeContent={decryptedCartData?.length || 0}
                  color="secondary"
                >
                  <ShoppingCartSharpIcon />
                </Badge>
              </Button>
            )}
            <Button
              className={`${classes.mr1} ${classes.bgtransparent} ${classes.bghoverwhite} ${classes.boxshadow0} ${classes.w27px} ${classes.p0_5} `}
              variant="contained"
              color="primary"
              onClick={() => {
                decryptedUserRole === "user"
                  ? handleCheckStaff("profile")
                  : handleCheck("myprofile");
              }}
            >
              <UserIcon />
            </Button>
            <Typography
              variant="h3"
              className={`${classes.mr1} ${classes.fontsize} ${classes.fontfamilyDMSans} ${classes.fw700}  ${classes.texttransformcapitalize}`}
            >
              {decryptedUserRole}
            </Typography>
            <Button
              className={`${classes.mr1} ${classes.bgtransparent} ${classes.bghoverwhite} ${classes.boxshadow0} ${classes.w27px} ${classes.p0_5} `}
              onClick={handleLogout}
            >
              <Logout1Icon />
            </Button>
          </div>

          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            className={`${classes.dropdowncard} `}
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      autoFocusItem={open}
                      id="menu-list-grow"
                      onKeyDown={handleListKeyDown}
                    >
                      <Link to="" className={classes.dropdownlink}>
                        <Link to="/add-bank">
                          <Button
                            fullWidth
                            onClick={handleClose}
                            className={` ${classes.justifyleft} `}
                          >
                            <span
                              className={`${classes.headname} ${classes.dflex} ${classes.alignitemscenter}`}
                            >
                              <BankIcon className={`${classes.mr0_5}`} /> Add
                              Bank
                            </span>
                          </Button>
                        </Link>
                        <Link to="/add-business-area">
                          <Button
                            fullWidth
                            onClick={handleClose}
                            className={` ${classes.justifyleft}`}
                          >
                            <span
                              className={`${classes.headname} ${classes.dflex} ${classes.alignitemscenter}`}
                            >
                              <BusinessIcon className={`${classes.mr0_5}`} />{" "}
                              Add Business Area
                            </span>
                          </Button>
                        </Link>
                        <Link to="/add-staff">
                          <Button
                            fullWidth
                            onClick={handleClose}
                            className={` ${classes.justifyleft} ${classes.bghoverwhite}`}
                          >
                            <span
                              className={`${classes.headname}   ${classes.dflex} ${classes.alignitemscenter}`}
                            >
                              <AddStaffIcon className={`${classes.mr0_5}`} />
                              Add Staff
                            </span>
                          </Button>
                        </Link>
                        <Link to="/add-ware-house">
                          <Button
                            fullWidth
                            onClick={handleClose}
                            className={` ${classes.justifyleft}`}
                          >
                            <span
                              className={`${classes.headname} ${classes.dflex} ${classes.alignitemscenter}`}
                            >
                              <WarehouseIcon className={`${classes.mr0_5}`} />{" "}
                              Add Warehouse
                            </span>
                          </Button>
                        </Link>
                        <Link to="/add-license">
                          <Button
                            fullWidth
                            onClick={handleClose}
                            className={` ${classes.justifyleft}`}
                          >
                            <span
                              className={`${classes.headname} ${classes.dflex} ${classes.alignitemscenter}`}
                            >
                              <LicenseIcon className={`${classes.mr0_5}`} />
                              Add License
                            </span>
                          </Button>
                        </Link>

                        <Link
                          to="/changepassword"
                          className={classes.menuButton}
                        >
                          <Button
                            fullWidth
                            onClick={handleClose}
                            className={` ${classes.justifyleft}`}
                          >
                            <span
                              className={`${classes.headname} ${classes.dflex} ${classes.alignitemscenter}`}
                            >
                              <ChangePasswordIcon
                                className={`${classes.mr0_5}`}
                              />{" "}
                              Change Password
                            </span>
                          </Button>
                        </Link>

                        <Divider />
                      </Link>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </Toolbar>
    </AppBar>
  );
}
export default Header;
