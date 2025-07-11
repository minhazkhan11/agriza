import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as Dashboard } from "../../../images/mainheadingicon/Dashboard.svg";
import useStyles from "../../../../styles";
import ViewCustomerLead from "./ViewCustomerLead";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import customerInBulk from "../../../../customerInBulk.csv";
import { toast } from "react-toastify";

function CustomerLead() {
  const classes = useStyles();
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = customerInBulk;
    link.setAttribute("download", "customerInBulk.csv");
    // Append to the document and trigger the download
    document.body.appendChild(link);
    link.click();
    // Check if the download started (link exists in document)
    if (document.body.contains(link)) {
      toast.success(
        "Sample file for adding customers in bulk has been downloaded"
      );
    } else {
      toast.error(
        "Failed to download the bulk customers file. Please try again."
      );
    }
    // Clean up
    link.parentNode.removeChild(link);
  };
  const Heading = [
    {
      id: 1,
      pageicon: <Dashboard />,
      mainheading: "Customer Lead ",
      subhead: "Want to Add in Bulk ? ",
      downloadlink: "Download bulk Sample Files",
      onDownload: handleDownload,
      showDownloadButton: true,
      // addbtntext: "Back",
      // addbtnicon: <BackIcon />,
      // addbtnstyle: "transparentbtn",
      // path: "/product-list",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewCustomerLead />
    </div>
  );
}
export default CustomerLead;
