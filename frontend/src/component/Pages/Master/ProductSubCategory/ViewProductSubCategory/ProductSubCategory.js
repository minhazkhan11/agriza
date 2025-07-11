import React from "react";
import PageHeader from "../../../PageHeader";
import ViewProductSubCategory from "./ViewProductSubCategory";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function ProductSubCategory() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Product Sub Category",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Product Sub Category",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-product-sub-category",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewProductSubCategory />
  </div>
  );
}
export default ProductSubCategory;