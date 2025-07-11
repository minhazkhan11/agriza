import React from "react";
import PageHeader from "../PageHeader";
import { ReactComponent as UpgradeIcon } from "../../images/mainheadingicon/upgrade.svg";
import useStyles from "../../../styles";
import WebDesignTable from "./WebDesignTable";


function WebDesign() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <UpgradeIcon />,
      mainheading: "Web Design",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <WebDesignTable />
    </div>
  );
}
export default WebDesign;
