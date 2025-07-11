import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Fade,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  endAdornment,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import "react-toastify/dist/ReactToastify.css";
import useStyles from "../../../styles";
import { Avatar, Divider, IconButton } from "@material-ui/core";
import clsx from "clsx";
import InputAdornment from "@material-ui/core/InputAdornment";
import kycicon from "../../images/PopupScreenIcon/kycicon.png";

const PlanPopup = (props) => {
  const { open, handleOpenClose, fetchData, info } = props;

  const classes = useStyles();
  const dummyData = [
    {
      id: 1,
      title: "Includes - Test Series",
      image: kycicon,
    },
    {
      id: 2,
      title: "Notes",
      image: kycicon,
    },
    {
      id: 3,
      title: "Online Video",
      image: kycicon,
    },
    {
      id: 4,
      title: "Live Classes",
      image: kycicon,
    },
    {
      id: 5,
      title: "Book selling",
      image: kycicon,
    },
    {
      id: 6,
      title: "Publishing and earning",
      image: kycicon,
    },
    {
      id: 7,
      title: "Website",
      image: kycicon,
    },
    {
      id: 8,
      title: "Doubt forum",
      image: kycicon,
    },
    {
      id: 9,
      title: "Faculty upfront in Parikshado",
      image: kycicon,
    },
    {
      id: 10,
      title: "Institute upfront",
      image: kycicon,
    },
  ];
  const lmsdata = [
    {
      id: 1,
      title:
        "Includes - 3 full test on exam center with complete bio verification",
      image: kycicon,
    },
    {
      id: 2,
      title: "Test Series",
      image: kycicon,
    },
    {
      id: 3,
      title: "Notes",
      image: kycicon,
    },
    {
      id: 4,
      title: "Online Video  ",
      image: kycicon,
    },
    {
      id: 5,
      title: "Live Classes",
      image: kycicon,
    },
    {
      id: 6,
      title: "Infra 3D video",
      image: kycicon,
    },
    {
      id: 7,
      title: "Doubt forum",
      image: kycicon,
    },
    {
      id: 8,
      title: "Faculty upfront",
      image: kycicon,
    },
    {
      id: 9,
      title: "Institute upfront",
      image: kycicon,
    },
    {
      id: 10,
      title: "Book Selling",
      image: kycicon,
    },
    {
      id: 11,
      title: "Website",
      image: kycicon,
    },
    {
      id: 12,
      title: "Publishing and earning",
      image: kycicon,
    },
    {
      id: 13,
      title: "Application access",
      image: kycicon,
    },
  ];
  const limitedlmsdata = [
    {
      id: 1,
      title: "Includes - 3 test series - 5 exams in month",
      image: kycicon,
    },
    {
      id: 2,
      title: "Notes - 512 mb space",
      image: kycicon,
    },
    {
      id: 3,
      title: "Online video 1 GB space",
      image: kycicon,
    },
    {
      id: 4,
      title: "Live classes 10 hours streming",
      image: kycicon,
    },
    {
      id: 5,
      title: "book selling",
      image: kycicon,
    },
    {
      id: 6,
      title: "Publishing and earning",
      image: kycicon,
    },
    {
      id: 7,
      title: "Doubt forum",
      image: kycicon,
    },
  ];

  return (
    <>
      <Fade in={open}>
        <div
          className={`${classes.planpopup} ${classes.p1} ${classes.bgbackground1} ${classes.backgroundnorepeat} ${classes.backgroundcover}`}
        >
          <div
            className={`${classes.dflex}   ${classes.justifyspaceevenly} ${classes.alignitemscenter} ${classes.mx2} ${classes.mt3}`}
          >
            <div
              className={`${classes.boxshadow1} ${classes.p1} ${classes.bgwhite} ${classes.w30}`}
            >
              <Typography
                className={`${classes.textcolorblue} ${classes.fontfamilyoutfit} ${classes.fontsize6} ${classes.fw500}`}
              >
                Basic LMS
              </Typography>
              <Typography
                className={`${classes.textcolorblue} ${classes.fontfamilyoutfit} ${classes.fontsize2} ${classes.fw500}`}
              >
                250/Student
              </Typography>
              <Typography
                className={`${classes.color7A7A} ${classes.fontfamilyoutfit} ${classes.fontSize11} ${classes.fw400}  ${classes.mb1}`}
              >
                Get our Basic LMS plan for getting small scale services.
              </Typography>
              {dummyData.map((data, i) => (
                <>
                  <div
                    className={`${classes.dflex} ${classes.alignitemscenter}`}
                  >
                    <Typography key={i}>
                      <img src={data.image} alt="img" />
                    </Typography>
                    <Typography
                      className={`${classes.pl0_5} ${classes.color7A7A}  ${classes.fontfamilyoutfit} ${classes.fontSize11} ${classes.fw400}`}
                    >
                      {data.title}
                    </Typography>
                  </div>
                </>
              ))}

              <Button
                className={`${classes.textcolorblue} ${classes.fontfamilyoutfit} ${classes.fontsize2}  ${classes.fw500} ${classes.w100} ${classes.px0} ${classes.py2} ${classes.borderblue}`}
              >
                Choose Your Plan
              </Button>
            </div>
            <div
              className={`${classes.boxshadow1} ${classes.p1} ${classes.bgwhite} ${classes.w30} ${classes.borderskyblue} ${classes.borderradius0375}`}
            >
              <Typography
                className={`${classes.textcolorblue} ${classes.fontfamilyoutfit} ${classes.fontsize6} ${classes.fw500}`}
              >
                Complete LMS
              </Typography>
              <Typography
                className={`${classes.textcolorblue} ${classes.fontfamilyoutfit} ${classes.fontsize2} ${classes.fw500}`}
              >
                500/Student
              </Typography>
              <Typography
                className={`${classes.color7A7A} ${classes.fontfamilyoutfit} ${classes.fontSize11} ${classes.fw400} ${classes.mb1}`}
              >
                Get our Complete LMS plan for getting all services.
              </Typography>
              {lmsdata.map((data, i) => (
                <>
                  <div
                    className={`${classes.dflex} ${classes.alignitemscenter}`}
                  >
                    <div key={i}>
                      <img src={data.image} alt="img" />
                    </div>
                    <div
                      className={`${classes.pl0_5} ${classes.color7A7A}  ${classes.fontfamilyoutfit} ${classes.fontSize11} ${classes.fw400}`}
                    >
                      {data.title}
                    </div>
                  </div>
                </>
              ))}

              <Button
                className={`${classes.textcolorblue} ${classes.fontfamilyoutfit} ${classes.fontsize2}  ${classes.fw500} ${classes.w100} ${classes.px0}  ${classes.borderblue}`}
              >
                Choose Your Plan
              </Button>
            </div>
            <div
              className={`${classes.boxshadow1} ${classes.p1} ${classes.bgwhite} ${classes.w30}`}
            >
              <Typography
                className={`${classes.textcolorblue} ${classes.fontfamilyoutfit} ${classes.fontsize6} ${classes.fw500}`}
              >
                Limited LMS
              </Typography>
              <Typography
                className={`${classes.textcolorblue} ${classes.fontfamilyoutfit} ${classes.fontsize2} ${classes.fw500}`}
              >
                150/Student
              </Typography>
              <Typography
                className={`${classes.color7A7A} ${classes.fontfamilyoutfit} ${classes.fontSize11} ${classes.fw400} ${classes.mb1}`}
              >
                Get our Limited LMS plan for getting an idea of Parikshado
                services.
              </Typography>
              {limitedlmsdata.map((data, i) => (
                <>
                  <div
                    className={`${classes.dflex} ${classes.alignitemscenter}`}
                  >
                    <div key={i}>
                      <img src={data.image} alt="img" />
                    </div>
                    <div
                      className={`${classes.pl0_5} ${classes.color7A7A}  ${classes.fontfamilyoutfit} ${classes.fontSize11} ${classes.fw400}`}
                    >
                      {" "}
                      {data.title}
                    </div>
                  </div>
                </>
              ))}
              <div className={`${classes.mt5}`}>
                <Button
                  className={`${classes.textcolorblue} ${classes.fontfamilyoutfit} ${classes.fontsize2}  ${classes.fw500} ${classes.w100} ${classes.px0} ${classes.py2} ${classes.borderblue}`}
                >
                  Choose Your Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Fade>
    </>
  );
};

export default PlanPopup;
