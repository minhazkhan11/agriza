import React from "react";
import PageHeader from "../../../PageHeader";
import ViewSupplierType from "./ViewSupplierType";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";


function SupplierType() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<CoursesIcon />,
      mainheading: "Supplier Type",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Supplier Type",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/create-supplier-type",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
    <PageHeader Heading={Heading} />
    <ViewSupplierType />
  </div>
  );
}
export default SupplierType;