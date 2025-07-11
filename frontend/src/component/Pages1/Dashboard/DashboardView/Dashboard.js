import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import useStyles from "../../../../styles";
import TotalData from "../TotalData/TotalData";
import TodaysSchedule from "../TodaysSchedule/TodaysSchedule";
import DoubtForum from "../DoubtForum/DoubtForum";
import QuikLinks from "../QuikLinks/QuikLinks";
import UpcomingExam from "../UpcomingExam/UpcomingExam";
import RecentOrders from "../RecentOrders/RecentOrders";
import { decryptData } from "../../../../crypto";
import axios from "axios";

function Dashboard({ header }) {
  const classes = useStyles();

  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [dashboardData, setDashboardData] = useState();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/dashbord/limit/5`,
          {
            headers: {
              Authorization: `Bearer ${decryptedToken}`,
            },
          }
        );

        // Ensure that the API response contains the 'batch' property
        if (response.data) {
          setDashboardData(response.data);
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching dashbord:", error);
      }
    };

    fetchDashboard();
  }, [decryptedToken]);

  const isDoubtForum = header?.find((data) =>
    data.name === "Doubt Fourm" ? true : false
  );
  const isExam = header?.find((data) => (data.name === "Exam" ? true : false));
  const isMarketing = header?.find((data) =>
    data.name === "Marketing" ? true : false
  );

  return (
    <div
      className={`${classes.p2} ${classes.pb0} ${classes.pt1} ${classes.bgskylite} ${classes.pagescroll} ${classes.h89vh}`}
    >
      <div className={`${classes.dflex} ${classes.justifyspacebetween}`}>
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
      <RecentOrders dashboardData={dashboardData?.order} />
    </div>
  );
}
export default Dashboard;
