import React from "react";
import PageHeader from "../../../PageHeader";
import ViewShipToParty from "./ViewShipToParty";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";

function ShipToParty() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Ship To Party",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Create New Ship To Party",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/create-ship-to-party",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewShipToParty />
    </div>
  );
}
export default ShipToParty;
