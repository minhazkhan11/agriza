import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as TeachersIcon } from "../../../images/teachersimage/teachersicon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";
import ViewTeacher from "./ViewTeacher";
import { toast } from "react-toastify";
import bulkTeachers from "../../../../TeachersInBulk.csv"; // Adjust the path as needed

function Teacher() {
  const classes = useStyles();

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = bulkTeachers;
    link.setAttribute("download", "TeachersInBulk.csv");

    // Append to the document and trigger the download
    document.body.appendChild(link);
    link.click();

    // Check if the download started (link exists in document)
    if (document.body.contains(link)) {
      toast.success("Sample file for adding teachers in bulk has been downloaded.");
    } else {
      toast.error("Failed to download the bulk teachers file. Please try again.");
    }

    // Clean up
    link.parentNode.removeChild(link);
  };

  const Heading = [
    {
      id: 1,
      pageicon: <TeachersIcon />,
      mainheading: "Teachers",
      subhead: "Want to Add Bulk Teachers?",
      onDownload: handleDownload,
      addbtntext: "Add Teacher",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/admin/addteacher",
      showDownloadButton: true,
    },
  ];

  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading} />
      <ViewTeacher />
    </div>
  );
}

export default Teacher;
