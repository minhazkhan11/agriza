import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as SettlementIcon } from "../../../images/mainheadingicon/settlementicon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";
import ViewSettlement from "./ViewSettlement";


function Settlement() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<SettlementIcon />,
      mainheading: "Settlement",
      
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading}/>
      <ViewSettlement/>
    </div>
  );
}
export default Settlement;