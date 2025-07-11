import React from "react";
import useStyles from "../../../../styles";
import { ReactComponent as SubjectIcon } from "../../../images/DashboardIcon/totalsubject.svg";
import { ReactComponent as LearnerIcon } from "../../../images/DashboardIcon/totallearner.svg";
import { ReactComponent as TeacherIcon } from "../../../images/DashboardIcon/totalteacher.svg";
import { ReactComponent as PublishedIcon } from "../../../images/DashboardIcon/totalpublished.svg";
import { ReactComponent as BooksIcon } from "../../../images/DashboardIcon/totalbooks.svg";
import { ReactComponent as ExamIcon } from "../../../images/DashboardIcon/totalexam.svg";
import { Typography } from "@material-ui/core";

const icons = [
  { name: "Total Course", icon: <BooksIcon /> },
  { name: "Total Batch", icon: <ExamIcon /> },
  { name: "Total Subject", icon: <SubjectIcon /> },
  { name: "Total Learner", icon: <LearnerIcon /> },
  { name: "Total Teacher", icon: <TeacherIcon /> },
];

function TotalData({ dashboardData }) {
  const classes = useStyles();
  return (
    <div
      className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter} ${classes.flexwrapwrap}`}
    >
      {dashboardData?.map((data, ind) => (
        <div
          key={ind}
          className={`${ind === 3 || ind === 4 ? classes.w49 : classes.w32} ${
            classes.py0_5x1
          } ${classes.dflex} ${classes.bgwhite} ${classes.borderradius6px} ${
            classes.alignitemscenter
          } ${classes.boxshadow1} ${ind === 3 || ind === 4 ? classes.mt1 : ""}`}
        >
          <div
            className={`${classes.boxshadow6} ${classes.py0_8x1} ${classes.borderradius6px} ${classes.bgwhite}`}
          >
            {icons.find((icon) => icon.name === data?.title)?.icon}
          </div>
          <div className={`${classes.ml1}`}>
            <Typography
              className={`${classes.fontfamilyoutfit} ${classes.fontsize4} ${classes.fw700}`}
            >
              {data?.title}
            </Typography>
            <Typography
              className={`${classes.fontfamilyoutfit} ${classes.fontsize7} ${classes.fw700}`}
            >
              {data?.value}
            </Typography>
          </div>
        </div>
      ))}
      {/* <div
        className={`${classes.w32} ${classes.py0_5x1} ${classes.dflex} ${classes.bgwhite} ${classes.borderradius6px} ${classes.alignitemscenter} ${classes.boxshadow1}`}
      >
        <div
          className={`${classes.boxshadow6} ${classes.py0_8x1} ${classes.borderradius6px} ${classes.bgwhite}`}
        >
          <LearnerIcon />
        </div>
        <div className={`${classes.ml1}`}>
          <Typography
            className={`${classes.fontfamilyoutfit} ${classes.fontsize4} ${classes.fw700}`}
          >
            Total Batch
          </Typography>
          <Typography
            className={`${classes.fontfamilyoutfit} ${classes.fontsize7} ${classes.fw700}`}
          >
            75
          </Typography>
        </div>
      </div>

      <div
        className={`${classes.w32} ${classes.py0_5x1} ${classes.dflex} ${classes.bgwhite} ${classes.borderradius6px} ${classes.alignitemscenter} ${classes.boxshadow1}`}
      >
        <div
          className={`${classes.boxshadow6} ${classes.py0_8x1} ${classes.borderradius6px} ${classes.bgwhite}`}
        >
          <TeacherIcon />
        </div>
        <div className={`${classes.ml1}`}>
          <Typography
            className={`${classes.fontfamilyoutfit} ${classes.fontsize4} ${classes.fw700}`}
          >
            Total Subject
          </Typography>
          <Typography
            className={`${classes.fontfamilyoutfit} ${classes.fontsize7} ${classes.fw700}`}
          >
            75
          </Typography>
        </div>
      </div>

      <div
        className={`${classes.w49} ${classes.mt1_5} ${classes.py0_5x1} ${classes.dflex} ${classes.bgwhite} ${classes.borderradius6px} ${classes.alignitemscenter} ${classes.boxshadow1}`}
      >
        <div
          className={`${classes.boxshadow6} ${classes.py0_8x1} ${classes.borderradius6px} ${classes.bgwhite}`}
        >
          <PublishedIcon />
        </div>
        <div className={`${classes.ml1}`}>
          <Typography
            className={`${classes.fontfamilyoutfit} ${classes.fontsize4} ${classes.fw700}`}
          >
            Total Learner
          </Typography>
          <Typography
            className={`${classes.fontfamilyoutfit} ${classes.fontsize7} ${classes.fw700}`}
          >
            75
          </Typography>
        </div>
      </div>
      <div
        className={`${classes.w49} ${classes.mt1_5} ${classes.py0_5x1} ${classes.dflex} ${classes.bgwhite} ${classes.borderradius6px} ${classes.alignitemscenter} ${classes.boxshadow1}`}
      >
        <div
          className={`${classes.boxshadow6} ${classes.py0_8x1} ${classes.borderradius6px} ${classes.bgwhite}`}
        >
          <BooksIcon />
        </div>
        <div className={`${classes.ml1}`}>
          <Typography
            className={`${classes.fontfamilyoutfit} ${classes.fontsize4} ${classes.fw700}`}
          >
            Total Teacher
          </Typography>
          <Typography
            className={`${classes.fontfamilyoutfit} ${classes.fontsize7} ${classes.fw700}`}
          >
            75
          </Typography>
        </div>
      </div> */}

      {/* <div
        className={`${classes.w32} ${classes.mt1_5} ${classes.py0_5x1} ${classes.dflex} ${classes.bgwhite} ${classes.borderradius6px} ${classes.alignitemscenter} ${classes.boxshadow1}`}
      >
        <div
          className={`${classes.boxshadow6} ${classes.py0_8x1} ${classes.borderradius6px} ${classes.bgwhite}`}
        >
          <ExamIcon />
        </div>
        <div className={`${classes.ml1}`}>
          <Typography
            className={`${classes.fontfamilyoutfit} ${classes.fontsize4} ${classes.fw700}`}
          >
            Total Exam
          </Typography>
          <Typography
            className={`${classes.fontfamilyoutfit} ${classes.fontsize7} ${classes.fw700}`}
          >
            75
          </Typography>
        </div>
      </div> */}
    </div>
  );
}

export default TotalData;
