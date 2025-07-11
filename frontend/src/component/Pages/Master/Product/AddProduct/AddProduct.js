import React from "react";
import PageHeader from "../../../PageHeader";
import AddProductForm from "./AddProductForm";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../../styles";
import { decryptData } from "../../../../../crypto";

function AddProduct() {
  const classes = useStyles();

  const decryptedUserRole = decryptData(sessionStorage.getItem("userRole"));

  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Create Item",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path:"/item-list",
    },
  ];

  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <AddProductForm />
    </div>
  );
}
export default AddProduct;
