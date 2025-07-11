import React from "react";
import PageHeader from "../../../PageHeader";
// import AddTeacherForm from "./AddTeacherForm";

import { ReactComponent as WareHouseIcon } from "../../../../images/headericon/warehouseicon.svg";
import useStyles from "../../../../../styles";
import AddWareHouseForm from "./AddWareHouseForm";
import { ReactComponent as BackIcon } from "../../../../images/pageheadingicon/backicon.svg";

function AddWareHouse() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <WareHouseIcon />,
      mainheading: "Add Warehouse",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/warehouse-list",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
    },
  ];
  return (
    <div className={`${classes.p2}`}>
      <PageHeader Heading={Heading} />
      <AddWareHouseForm />
    </div>
  );
}
export default AddWareHouse;
