import React from "react";
import PageHeader from "../../PageHeader";
import ViewMarketerApproval from "./ViewMarketerApproval";
import { ReactComponent as CoursesIcon } from "../../../images/courseimage/coursesicon.svg";
import useStyles from "../../../../styles";


function MarketerApproval() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Marketer Approval",
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
    <ViewMarketerApproval />
  </div>
  );
}
export default MarketerApproval;