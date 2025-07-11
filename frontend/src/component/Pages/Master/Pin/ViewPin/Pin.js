import React from "react";
import PageHeader from "../../../PageHeader";
import ViewPin from "./ViewPin";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function Pin() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Pin",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Pin",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-pin",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewPin />
  </div>
  );
}
export default Pin;