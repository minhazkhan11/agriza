import React from "react";
import PageHeader from "../../../PageHeader";
import AddLeadCategoryForm from "./AddLeadCategoryForm";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../../styles";

function AddLeadCategory({ style }) {
  const classes = useStyles();

  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Create Lead Category",
      // Conditional fields
      addbtntext: style?.isPopUp ? undefined : "Back",
      addbtnicon: style?.isPopUp ? undefined : <BackIcon />,
      addbtnstyle: style?.isPopUp ? undefined : "transparentbtn",
      path: "/lead-category-list",
    },
  ];
  return (
    <div
      className={`${classes.p2} ${classes.pb0} ${classes[style?.width]} ${
        classes[style?.bgcolor]
      }`}
    >
      <PageHeader Heading={Heading} />
      <AddLeadCategoryForm style={style} />
    </div>
  );
}
export default AddLeadCategory;
