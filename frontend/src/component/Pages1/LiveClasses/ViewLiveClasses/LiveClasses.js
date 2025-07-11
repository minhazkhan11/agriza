import React from "react";
import useStyles from "../../../../styles";
import PageHeader from "../../PageHeader";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import { ReactComponent as ClassesIcon } from "../../../images/LiveClasses/ClassesIcon.svg";
import ViewLiveClasses from "./ViewLiveClasses";

const LiveClasses = () => {
  const classes = useStyles();

  const Heading = [
    {
      id: 1,
      pageicon: <ClassesIcon />,
      mainheading: "Live Classes",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Add Classes",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/admin/addliveclasses",
    },
  ];
  return (
    <>
      <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
        <PageHeader Heading={Heading} />
        <ViewLiveClasses />
      </div>
    </>
  );
};

export default LiveClasses;
