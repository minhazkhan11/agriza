import React from "react";
import PageHeader from "../../PageHeader";
// import AddTeacherForm from "./AddTeacherForm";

import { ReactComponent as BusinessIcon } from "../../../images/headericon/addbussinessicon.svg";
import useStyles from "../../../../styles";
import AddBusinessAreaForm from "./AddBusinessFormArea";

function AddBusinessArea({ fetchDataFromAPI }) {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <BusinessIcon />,
      mainheading: "Add Business Area",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
    },
  ];
  return (
    <div className={`${classes.p2}`}>
      <PageHeader Heading={Heading} />
      <AddBusinessAreaForm fetchDataFromAPI={fetchDataFromAPI} />
    </div>
  );
}
export default AddBusinessArea;
