import React from "react";
import PageHeader from "../PageHeader";
import { ReactComponent as UpgradeIcon } from "../../images/mainheadingicon/upgrade.svg";
import useStyles from "../../../styles";
import ViewUpgrade from "./ViewUpgrade";

function Upgrade({planName}) {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <UpgradeIcon />,
      mainheading: "Upgrade",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pt1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewUpgrade planName={planName} />
    </div>
  );
}
export default Upgrade;
