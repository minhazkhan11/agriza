import React, { useState } from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as Telecallerlogo} from "../../../images/Telecaller/telecallerlogo.svg";
import useStyles from "../../../../styles";
import ViewTelecallerList from "./ViewTelecallerList";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import bulkTelecaller from "../telecaller.csv";
function Telecaller() {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
const {state} = useLocation();

  const handleOpenClose = (data) => {
    setOpen(!open);
  };

  console.log("object" , open)

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = bulkTelecaller;
    link.setAttribute("download", "telecaller.csv");

    // Append to the document and trigger the download
    document.body.appendChild(link);
    link.click();

    // Check if the download started (link exists in document)
    if (document.body.contains(link)) {
      toast.success("Sample file for adding learners in bulk has been downloaded");
    } else {
      toast.error("Failed to download the bulk learners file. Please try again.");
    }

    // Clean up
    link.parentNode.removeChild(link);
  };

  const Heading = [
    {
      id: 1,
      pageicon:<Telecallerlogo   />,
      mainheading: `${state?.name} List`,
      subhead: "Want to Add in Bulk ?",
      onDownload: handleDownload, 
      showDownloadButton: true,
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/admin/telecaller",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading} handleOpenClose={handleOpenClose}/>
      <ViewTelecallerList rowId={state?.rowId}/>
    
    </div>
  );
}
export default Telecaller;