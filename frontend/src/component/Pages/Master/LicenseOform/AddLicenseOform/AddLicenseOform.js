import React from "react";
import PageHeader from "../../../PageHeader";

import { ReactComponent as LicenseIcon } from "../../../../images/headericon/licenseIcon.svg";
import useStyles from "../../../../../styles";
import AddLicenseOformForm from "./AddLicenseOformForm";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";


function AddLicense() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <LicenseIcon />,
      mainheading: "Add O-Form",

      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path:"/oform-versioning-list",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
    },
  ];
  return (
    <div className={`${classes.p2}`}>
      <PageHeader Heading={Heading} />
      <AddLicenseOformForm />
    </div>
  );
}
export default AddLicense;
