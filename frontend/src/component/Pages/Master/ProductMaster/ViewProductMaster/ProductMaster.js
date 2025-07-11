import React from "react";
import PageHeader from "../../../PageHeader";
import ViewProductMaster from "./ViewProductMaster";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function ProductMaster() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Product",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Product",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-product",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewProductMaster />
  </div>
  );
}
export default ProductMaster;