import React from "react";
import PageHeader from "../../PageHeader";
import ViewContactUs from "./ViewContactUs";
import { ReactComponent as CoursesIcon } from "../../../images/courseimage/coursesicon.svg";
import useStyles from "../../../../styles";


function ContactUs() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Contact Us",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      // addbtntext:"Create New Product",
      // addbtnicon: <AddIcon />,
      // addbtnstyle: "bluebtn",
      // path:"/create-product",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewContactUs />
  </div>
  );
}
export default ContactUs;