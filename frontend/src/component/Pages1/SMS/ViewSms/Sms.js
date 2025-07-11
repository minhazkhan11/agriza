import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as SmsIcon } from "../../../images/SmsIcon/smsicon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";
import ViewSms from "./ViewSms";


function Sms() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<SmsIcon />,
      mainheading: "Text SMS",
      // subhead: "Want to Add Bulk Quizes ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create SMS",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/admin/createsms",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading}/>
      <ViewSms/>
    </div>
  );
}
export default Sms;