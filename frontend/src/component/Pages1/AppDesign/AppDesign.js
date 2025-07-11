import React from "react";
import PageHeader from "../PageHeader";
import { ReactComponent as UpgradeIcon } from "../../images/mainheadingicon/upgrade.svg";
import useStyles from "../../../styles";

function AppDesign() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <UpgradeIcon />,
      mainheading: "AppDesign",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
    </div>
  );
}
export default AppDesign;
