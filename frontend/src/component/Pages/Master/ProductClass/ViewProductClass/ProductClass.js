import React from "react";
import PageHeader from "../../../PageHeader";
import ViewProductClass from "./ViewProductClass";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function ProductClass() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Product Class",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Product Class",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-product-class",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewProductClass />
  </div>
  );
}
export default ProductClass;