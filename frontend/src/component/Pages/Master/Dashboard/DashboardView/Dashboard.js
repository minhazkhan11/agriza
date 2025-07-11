import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import useStyles from "../../../../../styles";
import TotalData from "../TotalData/TotalData";
import TodaysSchedule from "../TodaysSchedule/TodaysSchedule";
import DoubtForum from "../DoubtForum/DoubtForum";
import QuikLinks from "../QuikLinks/QuikLinks";
import UpcomingExam from "../UpcomingExam/UpcomingExam";
import RecentOrders from "../RecentOrders/RecentOrders";
import { decryptData } from "../../../../../crypto";
import axios from "axios";
import ScreenCapture from "../../../../../ScreenCapture";

function Dashboard({ header }) {
  const classes = useStyles();


  return (
    <div
      className={`${classes.p2} ${classes.pb0} ${classes.pt1} ${classes.bgskylite} ${classes.pagescroll} ${classes.h89vh}`}
    >
    Dashboard


    {/* <ScreenCapture /> */}
      {/* <div className={`${classes.dflex} ${classes.justifyspacebetween}`}>
        <div className={`${isDoubtForum ? classes.w69 : classes.w100}`}>
          <TotalData dashboardData={dashboardData?.dashbord} />
          <TodaysSchedule dashboardData={dashboardData?.scheduletable} />
        </div>
        {isDoubtForum && (
          <div className={`${classes.w29}`}>
            <DoubtForum dashboardData={dashboardData?.doubt} />
          </div>
        )}
      </div>
      {isMarketing && <QuikLinks />}
      {isExam && <UpcomingExam dashboardData={dashboardData?.exam} />}
      <RecentOrders dashboardData={dashboardData?.order} /> */}
    </div>
  );
}
export default Dashboard;
