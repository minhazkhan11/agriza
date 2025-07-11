import React from "react";
import PageHeader from "../../../PageHeader";

import { ReactComponent as LicenseIcon } from "../../../../images/headericon/licenseIcon.svg";
import useStyles from "../../../../../styles";
import AddLicenseForm from "./AddLicenseForm";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";


function AddLicense() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <LicenseIcon />,
      mainheading: "Add License",

      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path:"/license-list",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
    },
  ];
  return (
    <div className={`${classes.p2}`}>
      <PageHeader Heading={Heading} />
      <AddLicenseForm />
    </div>
  );
}
export default AddLicense;
