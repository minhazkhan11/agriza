import React from "react";
import PageHeader from "../../../PageHeader";
import ViewTehsil from "./ViewTehsil";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function Tehsil() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Tehsil",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Tehsil",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-tehsil",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewTehsil />
  </div>
  );
}
export default Tehsil;