import React from "react";
import PageHeader from "../../PageHeader";

import { ReactComponent as LicenseIcon } from "../../../images/headericon/licenseIcon.svg";
import useStyles from "../../../../styles";
import AddLicenseForm from "./AddLicenseForm";

function AddLicense({ fetchDataFromAPI }) {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <LicenseIcon />,
      mainheading: "Add License",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
    },
  ];
  return (
    <div className={`${classes.p2}`}>
      <PageHeader Heading={Heading} />
      <AddLicenseForm fetchDataFromAPI={fetchDataFromAPI} />
    </div>
  );
}
export default AddLicense;
