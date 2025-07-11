import React from "react";
import PageHeader from "../../PageHeader";
import ViewBrandApproval from "./ViewBrandApproval";
import { ReactComponent as CoursesIcon } from "../../../images/courseimage/coursesicon.svg";
import useStyles from "../../../../styles";


function BrandApproval() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Brand Approval",
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
    <ViewBrandApproval />
  </div>
  );
}
export default BrandApproval;