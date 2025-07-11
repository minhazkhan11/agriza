import React, { useState } from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import { ReactComponent as WhatsApp} from "../../../images/Whatsapp/whatsappicon.svg";
import { ReactComponent as Telecallerlogo} from "../../../images/Telecaller/telecallerlogo.svg";
import useStyles from "../../../../styles";
import ViewTelecaller from "./ViewTelecaller";


function Telecaller() {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleOpenClose = (data) => {
    setOpen(!open);
  };

  console.log("object" , open)

  const Heading = [
    {
      id: 1,
      pageicon:<Telecallerlogo   />,
      mainheading: "Telecaller",
      // subhead: "Want to Add Bulk Quizes ?",
      // downloadlink: "Download bulk Sample Files",
      // addbtntext: "Add",
      // addbtnicon: <AddIcon />,
      // addbtnstyle: "bluebtn",
      // path:"/admin/createwhatsapp",
      publishbtn: "yes",
      publishIcon: <AddIcon />,
      publishtext: "Add",
      publishbtnstyle: "bluebtn",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading} handleOpenClose={handleOpenClose}/>
      <ViewTelecaller  open={open} handleOpenClose={handleOpenClose}/>
    
    </div>
  );
}
export default Telecaller;