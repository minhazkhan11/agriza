import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as TeachersIcon } from "../../../images/teachersimage/teachersicon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";
import ViewCoaching from "./ViewCoaching";


function Coaching() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<TeachersIcon />,
      mainheading: "Coaching",
      subhead: "Want to Add in Bulk ? ?",
      downloadlink: "Download bulk Sample Files",
      addbtntext:"Add Coaching",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/admin/addcoaching",
    },
  ];
  return (
    <div className={`${classes.p2}`}>
      <PageHeader Heading={Heading}/>
      <ViewCoaching/>
    </div>
  );
}
export default Coaching;