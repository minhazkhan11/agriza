import React from "react";
import PageHeader from "../../../PageHeader";
// import AddTeacherForm from "./AddTeacherForm";

import { ReactComponent as ShipToPartyIcon } from "../../../../images/headericon/warehouseicon.svg";
import useStyles from "../../../../../styles";
import AddShipToPartyForm from "./AddShipToPartyForm";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";

function AddShipToParty() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <ShipToPartyIcon />,
      mainheading: "Add ship to party",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/ship-to-party-list",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
    },
  ];
  return (
    <div className={`${classes.p2}`}>
      <PageHeader Heading={Heading} />
      <AddShipToPartyForm />
    </div>
  );
}
export default AddShipToParty;
