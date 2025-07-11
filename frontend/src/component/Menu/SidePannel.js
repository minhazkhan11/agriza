import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import { Avatar, Typography, useTheme } from "@material-ui/core";
import useStyles from "../../styles";
import SidePannelList from "../CustomComponent/SidePannelList";
import agrizafaveIcon from "../images//headericon/agrizafavicon.png";
import agrizaLogo from "../images/headericon/agrizaLogo.png";
import axios from "axios";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import { decryptData } from "../../crypto";
import UserProfile from "./UserProfile";

export default function SidePannel({
  menuCollapse,
  globalProfileImageState,
  header,
  handleMenuCollapse,
  setMenuCollapse,
}) {
  const classes = useStyles();
  const [clientName, setClientName] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const decryptedUserRole = decryptData(sessionStorage.getItem("userRole"));
  const decryptedUserName = decryptData(sessionStorage.getItem("userName"));
  const decryptedAddedBy = decryptData(sessionStorage.getItem("addedBy"));
  const decryptedBusinessName = decryptData(
    sessionStorage.getItem("businessName")
  );

  const [instituteName, setInstitutename] = useState("");

  // const fetchDataFromAPI = async () => {
  //   try {
  //     const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/auth/profile`;
  //     const response = await axios.get(apiUrl, {
  //       headers: {
  //         Authorization: `Bearer ${decryptedToken}`,
  //       },
  //     });

  //     if (response.status === 200) {
  //       const data = response.data.user;
  //       setClientName(data.user_information.contact_person_name);
  //     } else {

  //     }
  //   } catch (error) {
  //     console.error("Error fetching data from the API:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchDataFromAPI();
  // }, []);

  const [currentDate, setCurrentDate] = useState(new Date());
  // const currentDate = new Date();

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date()); // Use setCurrentDate to update the state
    }, 60 * 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const currentMonth = currentDate.toLocaleString("default", {
    month: "short",
  });
  const currentDay = currentDate.getDate();
  const currentYear = currentDate.getFullYear();

  let currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }); // 11:18 AM

  const getInitials = (name) => {
    return name && name.trim() ? name.charAt(0).toUpperCase() : "A";
  };
  const theme = useTheme();
  const imageStyle = {
    height: "80px",
    borderRadius: "6px",
    padding: "0.5rem",
    marginLeft: "0.5rem",
    marginRight: "1rem",
  };
  return (
    <>
      <Paper
        className={`${classes.w100} ${classes.dflex} ${classes.h100vh} ${classes.flexdirectioncolumn} ${classes.boxshadow1}`}
      >
        <div
          // className={classes.profilename}
          className={`${classes.bgdarkblue1} ${classes.h62px} ${classes.textcolorwhite} ${classes.dflex} ${classes.alignitemscenter} `}
        >
          {decryptedUserRole === "superadmin" ||
          (decryptedUserRole === "user" && decryptedAddedBy === "1") ? (
            menuCollapse ? (
              <div
                className={`${classes.w100} ${classes.dflex} ${classes.justifycenter}`}
              >
                <img src={agrizafaveIcon} alt="img of client" />
              </div>
            ) : (
              <div
                className={`${classes.w100} ${classes.dflex} ${classes.justifycenter}`}
              >
                <img
                  src={agrizaLogo}
                  width="150px"
                  height="55px"
                  alt="img of client"
                />
              </div>
            )
          ) : menuCollapse ? (
            <div
              className={`${classes.px1} ${classes.w100}  ${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter}`}
            >
              <Avatar
                style={{
                  width: theme.spacing(4.5),
                  height: theme.spacing(4.5),
                  fontSize: "1.5rem",
                  backgroundColor: "#FE7C4C",
                  color: "#fff",
                  fontFamily: '"Roboto", sans-serif',
                }}
              >
                {getInitials(decryptedBusinessName)}
              </Avatar>
            </div>
          ) : (
            <div
              className={`${classes.px1} ${classes.dflex} ${classes.alignitemscenter}`}
            >
              <Avatar
                style={{
                  width: theme.spacing(4.5),
                  height: theme.spacing(4.5),
                  fontSize: "1.5rem",
                  backgroundColor: "#FE7C4C",
                  color: "#fff",
                  fontFamily: '"Roboto", sans-serif',
                  marginRight: "10px",
                }}
              >
                {getInitials(decryptedBusinessName)}
              </Avatar>
              <div>
                {" "}
                <Typography
                  variant="h3"
                  className={`${classes.fontsize} ${classes.fontFamilyJost} ${classes.fw700}  ${classes.texttransformcapitalize}`}
                  style={{
                    color: "#FE7C4C",
                  }}
                >
                  Welcome,
                </Typography>
                <Typography
                  variant="h3"
                  className={`${classes.fontsize1} ${classes.fontFamilyJost} ${classes.fw700}  ${classes.texttransformcapitalize}`}
                  style={{
                    color: "#000",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "60%",
                  }}
                >
                  {decryptedBusinessName}
                </Typography>
              </div>
            </div>
          )}
        </div>
        {decryptedUserRole === "admin" && (
          <div className={` ${classes.bgcream} ${classes.boxshadow7}`}>
            <UserProfile menuCollapse={menuCollapse}/>
          </div>
        )}

        <Tabs
          orientation="vertical"
          variant="scrollable"
          scrollButtons="off"
          indicatorColor="none"
          aria-label="Vertical tabs example"
          className={`${classes.w90} ${classes.m0auto}`}
        >
          <SidePannelList setMenuCollapse={setMenuCollapse} menuCollapse={menuCollapse} MainHeading={header} />
        </Tabs>
      </Paper>
    </>
  );
}
