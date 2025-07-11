import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as LearnerIcon } from "../../../images/learnersimage/learnericon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";
import ViewLearner from "./ViewLearner";
import { toast } from "react-toastify";
import bulkLearners from "../../../../LearnersInBulk.csv"; 

function Learner() {
  const classes = useStyles();

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = bulkLearners;
    link.setAttribute("download", "LearnersInBulk.csv");

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
      pageicon: <LearnerIcon />,
      mainheading: "Learners",
      subhead: "Want to Add in Bulk ?",
      onDownload: handleDownload, 
      addbtntext: "Add Learner",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/admin/addlearner",
      showDownloadButton: true,
    },
  ];

  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading} />
      <ViewLearner />
    </div>
  );
}

export default Learner;
