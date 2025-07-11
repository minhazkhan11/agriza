import React from "react";
import PageHeader from "../../PageHeader";
import ViewVendor from "./ViewVendor";
import { ReactComponent as CoursesIcon } from "../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";


function Vendor() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Vendor",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Vendor",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-vendor",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewVendor />
  </div>
  );
}
export default Vendor;