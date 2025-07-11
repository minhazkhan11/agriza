import React from "react";
import PageHeader from "../../PageHeader";

import { ReactComponent as StaffIcon } from "../../../images/headericon/addstafficon.svg";

import useStyles from "../../../../styles";
import AddStaffForm from "./AddStaffForm";

function AddStaff({ fetchDataFromAPI }) {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <StaffIcon />,
      mainheading: "Add Staff",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
    },
  ];
  return (
    <div className={`${classes.p2}`}>
      <PageHeader Heading={Heading} />
      <AddStaffForm fetchDataFromAPI={fetchDataFromAPI} />
    </div>
  );
}
export default AddStaff;
