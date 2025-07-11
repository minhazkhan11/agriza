import React from "react";
import PageHeader from "../../../PageHeader";
import { ReactComponent as EmailIcon } from "../../../../images/EmailIcon/emailicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";
import ViewEmail from "./ViewEmail";

function Email() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <EmailIcon />,
      mainheading: "Emails",
      addbtntext: "Compose Email",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/compose-email",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewEmail />
    </div>
  );
}
export default Email;
