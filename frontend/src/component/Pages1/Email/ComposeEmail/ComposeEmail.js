import React from "react";
import { ReactComponent as EmailIcon } from "../../../images/EmailIcon/emailicon.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";
import PageHeader from "../../PageHeader";
import ComposeMailTab from "./ComposeMailTab";


function ComposeEmail() {
  const classes = useStyles();

  const Heading = [
    {
      id: 1,
      pageicon:<EmailIcon />,
      mainheading: "Compose Email",
      addbtntext:"Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path:"/admin/email",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading}/>
      <ComposeMailTab />
    </div>
  );
}
export default ComposeEmail;

