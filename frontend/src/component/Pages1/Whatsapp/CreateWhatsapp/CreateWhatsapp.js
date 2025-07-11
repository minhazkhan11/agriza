import React from "react";
import { ReactComponent as WhatsApp} from "../../../images/Whatsapp/whatsappicon.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";
import PageHeader from "../../PageHeader";
import CreateSmsTab from "./CreateSmsTab";


function CreateWhatsapp() {
  const classes = useStyles();

  const Heading = [
    {
      id: 1,
      pageicon:<WhatsApp />,
      mainheading: "Create WhatsApp Message",
      addbtntext:"Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path:"/admin/whatsapp",
    },
  ];

  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading}/>
      <CreateSmsTab />


    </div>
  );
}
export default CreateWhatsapp;

