import React, { useState } from "react";
import PageHeader from "../../../PageHeader";
import ViewSingleProduct from "./ViewSingleProduct";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../../styles";
import { Backdrop, Modal } from "@material-ui/core";
import RemarkPopup from "./RemarkPopup";

function SingleProduct() {
  const classes = useStyles();

  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Product Approval",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/product-approval-list",
    },
  ];

  const [open, setOpen] = useState(false);

  const handleOpenClose = (data) => {
    setOpen(!open);
  };

  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewSingleProduct handleOpenClose={handleOpenClose} open={open} />
    </div>
  );
}
export default SingleProduct;
