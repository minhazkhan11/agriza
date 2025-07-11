import React from "react";
import PageHeader from "../../../PageHeader";
import ViewProductCategory from "./ViewProductCategory";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function ProductCategory() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Product Category",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Product Category",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-product-category",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewProductCategory />
  </div>
  );
}
export default ProductCategory;