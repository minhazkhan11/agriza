import React from "react";
import PageHeader from "../../../PageHeader";
import { ReactComponent as WhatsappIcon } from "../../../../images/Whatsapp/whatsappicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";
import ViewWhatsapp from "./ViewWhatsapp";

function Whatsapp() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <WhatsappIcon />,
      mainheading: "WhatsApp",
      // subhead: "Want to Add Bulk Quizes ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Create WhatsApp",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/create-whatsapp",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewWhatsapp />
    </div>
  );
}
export default Whatsapp;
