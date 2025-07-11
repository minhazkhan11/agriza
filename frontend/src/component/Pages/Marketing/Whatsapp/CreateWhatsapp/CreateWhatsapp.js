import React from "react";
import { ReactComponent as WhatsappIcon } from "../../../../images/Whatsapp/whatsappicon.svg";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";

// import ExamLogo from "../../../images/questionimage/examlogo.jpg";
import useStyles from "../../../../../styles";
import PageHeader from "../../../PageHeader";
import CreateWhatsappTab from "./CreateWhatsappTab";

function CreateWhatsapp() {
  const classes = useStyles();

  const Heading = [
    {
      id: 1,
      pageicon:  <WhatsappIcon />,
      mainheading: "Create WhatsApp",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/whatsapp-list",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <CreateWhatsappTab />
    </div>
  );
}
export default CreateWhatsapp;
