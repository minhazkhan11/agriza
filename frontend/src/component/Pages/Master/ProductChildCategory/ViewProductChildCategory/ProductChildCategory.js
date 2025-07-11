import React from "react";
import PageHeader from "../../../PageHeader";
import ViewProductChildCategory from "./ViewProductChildCategory";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function ProductChildCategory() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Product Child Category",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Product Child Category",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-product-child-category",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewProductChildCategory />
  </div>
  );
}
export default ProductChildCategory;