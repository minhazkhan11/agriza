import React from "react";
import PageHeader from "../../../PageHeader";
import AddProductMasterForm from "./AddProductMasterForm";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../../styles";

function AddProductMaster({ style }) {
  const classes = useStyles();

  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Create Product",
      // Conditional fields
      addbtntext: style?.isPopUp ? undefined : "Back",
      addbtnicon: style?.isPopUp ? undefined : <BackIcon />,
      addbtnstyle: style?.isPopUp ? undefined : "transparentbtn",
      path: "/product-list",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes[style?.width]} ${classes[style?.bgcolor]}`}>
      <PageHeader Heading={Heading} />
      <AddProductMasterForm style={style} />
    </div>
  );
}
export default AddProductMaster;
