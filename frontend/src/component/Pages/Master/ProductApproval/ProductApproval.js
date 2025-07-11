import React from "react";
import PageHeader from "../../PageHeader";
import ViewProductApproval from "./ViewProductApproval";
import { ReactComponent as CoursesIcon } from "../../../images/courseimage/coursesicon.svg";
import useStyles from "../../../../styles";


function ProductApproval() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Product Approval",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      // addbtntext:"Create New Product",
      // addbtnicon: <AddIcon />,
      // addbtnstyle: "bluebtn",
      // path:"/create-product",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewProductApproval />
  </div>
  );
}
export default ProductApproval;