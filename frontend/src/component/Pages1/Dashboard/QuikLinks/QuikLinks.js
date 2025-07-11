import React from "react";
import useStyles from "../../../../styles";
import { Button, Typography } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as SmsIcon } from "../../../images/DashboardIcon/smsicon.svg";
import { ReactComponent as WhatsappIcon } from "../../../images/DashboardIcon/whatsappicon.svg";
import { ReactComponent as TelecallerIcon } from "../../../images/DashboardIcon/telecallericon.svg";
import { ReactComponent as EmailIcon } from "../../../images/DashboardIcon/emailicon.svg";
import { ReactComponent as FolderIcon } from "../../../images/DashboardIcon/foldericon.svg";

function QuikLinks() {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <div
      className={`${classes.mt1_5} ${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter} ${classes.bgwhite} ${classes.px3} ${classes.py2} ${classes.boxshadow1} ${classes.borderradius6px}`}
    >
      <div className={`${classes.w20}`}>
        <Typography
          className={`${classes.my1} ${classes.fontfamilyoutfit} ${classes.fontsize5} ${classes.fw700}`}
        >
          Quik Links
        </Typography>
        <Typography
          className={`${classes.my1} ${classes.textcolorgrey} ${classes.fontfamilyoutfit} ${classes.fontsize6} ${classes.fw600}`}
        >
          To directly go to the marketing section{" "}
          {/* <Link to={"#"} className={`${classes.textdecorationnone} ${classes.textcolorblue1}`}> Click Here !</Link> */}
        </Typography>
      </div>
      <div
        className={`${classes.w69} ${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter}`}
      >
        <Button
         onClick={() =>  navigate(`/admin/textsms`)}
          className={`${classes.py2} ${classes.w18} ${classes.bgwhite} ${classes.borderradius6px} ${classes.buttonlabelblock} ${classes.boxshadow1}`}
        >
          <SmsIcon />
          <Typography
            className={`${classes.textcolorgrey} ${classes.fontfamilyoutfit} ${classes.fontsize6} ${classes.fw600}`}
          >
            Text SMS
          </Typography>
        </Button>
        {/* <Button
         onClick={() =>  navigate(`/admin/whatsapp`)}
          className={`${classes.py2} ${classes.w18} ${classes.bgwhite} ${classes.borderradius6px} ${classes.buttonlabelblock} ${classes.boxshadow1}`}
        >
          <WhatsappIcon />
          <Typography
            className={`${classes.textcolorgrey} ${classes.fontfamilyoutfit} ${classes.fontsize6} ${classes.fw600}`}
          >
            Whatsapp
          </Typography>
        </Button> */}
        <Button
         onClick={() =>  navigate(`/admin/email`)}
          className={`${classes.py2} ${classes.w18} ${classes.bgwhite} ${classes.borderradius6px} ${classes.buttonlabelblock} ${classes.boxshadow1}`}
        >
          <EmailIcon />
          <Typography
            className={`${classes.textcolorgrey} ${classes.fontfamilyoutfit} ${classes.fontsize6} ${classes.fw600}`}
          >
            Email
          </Typography>
        </Button>
        <Button
         onClick={() =>  navigate(`/admin/telecaller`)}
          className={`${classes.py2} ${classes.w18} ${classes.bgwhite} ${classes.borderradius6px} ${classes.buttonlabelblock} ${classes.boxshadow1}`}
        >
          <TelecallerIcon />
          <Typography
            className={`${classes.textcolorgrey} ${classes.fontfamilyoutfit} ${classes.fontsize6} ${classes.fw600}`}
          >
            telecaller
          </Typography>
        </Button>
        <Button
         onClick={() =>  navigate(`/admin/forms`)}
          className={`${classes.py2} ${classes.w18} ${classes.bgwhite} ${classes.borderradius6px} ${classes.buttonlabelblock} ${classes.boxshadow1}`}
        >
          <FolderIcon />
          <Typography
            className={`${classes.textcolorgrey} ${classes.fontfamilyoutfit} ${classes.fontsize6} ${classes.fw600}`}
          >
            forms
          </Typography>
        </Button>
      </div>
    </div>
  );
}

export default QuikLinks;
