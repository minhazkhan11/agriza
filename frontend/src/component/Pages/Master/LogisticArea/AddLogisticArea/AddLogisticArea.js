import React from "react";
import PageHeader from "../../../PageHeader";
import { ReactComponent as LogisticIcon } from "../../../../images/headericon/addbussinessicon.svg";
import useStyles from "../../../../../styles";
import AddLogisticAreaFrom from "./AddLogisticAreaForm";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";

function AddLogisticArea() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <LogisticIcon />,
      mainheading: "Add Logistic Area",

      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/logistic-area-list",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
    },
  ];
  return (
    <div className={`${classes.p2}`}>
      <PageHeader Heading={Heading} />
      <AddLogisticAreaFrom />
    </div>
  );
}
export default AddLogisticArea;
