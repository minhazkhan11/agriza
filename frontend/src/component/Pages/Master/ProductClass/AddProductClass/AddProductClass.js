import React from "react";
import PageHeader from "../../../PageHeader";
import AddProductClassForm from "./AddProductClassForm";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../../styles";

function AddProductClass({ style }) {
  const classes = useStyles();

  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Create Product Class",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: style?.isPopUp ? undefined : "Back",
      addbtnicon: style?.isPopUp ? undefined : <BackIcon />,
      addbtnstyle: style?.isPopUp ? undefined : "transparentbtn",
      path: "/product-class-list",
    },
  ];
  return (
    <div
      className={`${classes.p2} ${classes.pb0} ${classes[style?.width]} ${
        classes[style?.bgcolor]
      }`}
    >
      <PageHeader Heading={Heading} />
      <AddProductClassForm style={style} />
    </div>
  );
}
export default AddProductClass;
