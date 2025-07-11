import React from "react";
import PageHeader from "../../../PageHeader";
import ViewMarketer from "./ViewMarketer";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function Marketer() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Marketer",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Marketer",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-marketer",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewMarketer />
  </div>
  );
}
export default Marketer;