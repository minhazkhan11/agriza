import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as SmsIcon } from "../../../images/SmsIcon/smsicon.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";
import ViewInnerSmsList from "./ViewInnerSmsList";
import { useLocation } from "react-router-dom";


function InnerSmsList() {
  const {state} = useLocation();
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<SmsIcon />,
      mainheading: `${state?.name} Campaign's Sms List`,
      addbtntext:"Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path:"/text-sms-list",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading}/>
      <ViewInnerSmsList/>
    </div>
  );
}
export default InnerSmsList;