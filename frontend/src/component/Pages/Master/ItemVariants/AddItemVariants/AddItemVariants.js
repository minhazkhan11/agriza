import React from "react";
import PageHeader from "../../../PageHeader";
import AddItemVariantsForm from "./AddItemVariantsForm";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../../styles";

function AddItemVariants() {
  const classes = useStyles();

  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Create Item Variants (SKU)",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/variant-list",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <AddItemVariantsForm />
    </div>
  );
}
export default AddItemVariants;
