import React from "react";
import PageHeader from "../../../PageHeader";
import AddProductCategoryForm from "./AddProductCategoryForm";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../../styles";

function AddProductCategory({ style }) {
  const classes = useStyles();

  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Create Product Category",
      // Conditional fields
      addbtntext: style?.isPopUp ? undefined : "Back",
      addbtnicon: style?.isPopUp ? undefined : <BackIcon />,
      addbtnstyle: style?.isPopUp ? undefined : "transparentbtn",
      path: "/product-category-list",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes[style?.width]} ${classes[style?.bgcolor]}`}>
      <PageHeader Heading={Heading} />
      <AddProductCategoryForm style={style} />
    </div>
  );
}
export default AddProductCategory;
