import React from "react";
import PageHeader from "../../PageHeader";
// import AddTeacherForm from "./AddTeacherForm";

import { ReactComponent as WareHouseIcon } from "../../../images/headericon/warehouseicon.svg";
import useStyles from "../../../../styles";
import AddWareHouseForm from "./AddWareHouseForm";

function AddWareHouse({ fetchDataFromAPI }) {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <WareHouseIcon />,
      mainheading: "Add Ware House",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
    },
  ];
  return (
    <div className={`${classes.p2}`}>
      <PageHeader Heading={Heading} />
      <AddWareHouseForm fetchDataFromAPI={fetchDataFromAPI} />
    </div>
  );
}
export default AddWareHouse;
