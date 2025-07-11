import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import { ReactComponent as WhatsApp} from "../../../images/Whatsapp/whatsappicon.svg";

import useStyles from "../../../../styles";
import ViewWhatsappList from "./ViewWhatsappList";


function Whatsapp() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<WhatsApp   />,
      mainheading: "WhatsApp Message",
      // subhead: "Want to Add Bulk Quizes ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create SMS",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/admin/createwhatsapp",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading}/>
      <ViewWhatsappList/>
    
    </div>
  );
}
export default Whatsapp;