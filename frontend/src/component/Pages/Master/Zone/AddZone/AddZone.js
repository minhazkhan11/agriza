import React from "react";
import PageHeader from "../../../PageHeader";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";
// import AddTeacherForm from "./AddTeacherForm";

import { ReactComponent as ZoneIcon } from "../../../../images/headericon/addbussinessicon.svg";
import useStyles from "../../../../../styles";
import AddZoneForm from "./AddZoneForm";

function AddZone() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <ZoneIcon />,
      mainheading: "Add Zone",

      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/zone-list",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
    },
  ];
  return (
    <div className={`${classes.p2}`}>
      <PageHeader Heading={Heading} />
      <AddZoneForm />
    </div>
  );
}
export default AddZone;
