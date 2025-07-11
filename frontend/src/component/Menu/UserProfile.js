import React, { useEffect, useState } from "react";
import useStyles from "../../styles";
import { Paper } from "@material-ui/core";
import LinearProgress from "./LinearProgress";
import CircularProgress from "./CircularProgress copy";
import { decryptData } from "../../crypto";
import axios from "axios";

export default function UserProfile({ menuCollapse }) {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      mainheading: "Create Item Variants",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Back",
      addbtnstyle: "transparentbtn",
      path: "/variant-list",
    },
  ];

  const [progress, setProgress] = useState();

  const [progressData, setProgressData] = useState();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/auth/check/details`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      const data = response.data;
      sessionStorage.setItem("checkDetails", JSON.stringify(data));
      const totalFields = Object.keys(data).length;

      const completedFields = Object.values(data).filter(
        (value) => value
      ).length;

      const progressValue = (completedFields / totalFields) * 100;

      setProgress(progressValue);
      setProgressData(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Paper
        className={`${classes.px1} ${classes.w100} ${classes.dflex} ${classes.bgcream} ${classes.boxshadow7} ${classes.py1} ${classes.flexdirectioncolumn} ${classes.boxshadow1}`}
      >
      {menuCollapse && <CircularProgress Heading={progress}/>}
      {!menuCollapse && <LinearProgress Heading={progress} progressData={progressData}/>}
      {/* <LinearProgress /> */}
        {/* {!menuCollapse ? <LinearProgress /> : <CircularProgress />} */}
      </Paper>
    </>
  );
}
