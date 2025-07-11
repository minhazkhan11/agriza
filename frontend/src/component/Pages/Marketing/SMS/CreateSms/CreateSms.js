import React from "react";
import { ReactComponent as SmsIcon } from "../../../../images/SmsIcon/smsicon.svg";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";

// import ExamLogo from "../../../images/questionimage/examlogo.jpg";
import useStyles from "../../../../../styles";
import PageHeader from "../../../PageHeader";
import CreateSmsTab from "./CreateSmsTab";

function CreateSms() {
  const classes = useStyles();

  const Heading = [
    {
      id: 1,
      pageicon: <SmsIcon />,
      mainheading: "Create SMS",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/text-sms-list",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <CreateSmsTab />
    </div>
  );
}
export default CreateSms;
