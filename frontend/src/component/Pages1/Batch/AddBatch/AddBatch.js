import React from "react";
import PageHeader from "../../PageHeader";
import AddBatchForm from "./AddBatchForm";
import { ReactComponent as SubjectIcon } from "../../../images/subjectimage/subjecticon.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";

function AddBatch() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <SubjectIcon />,
      mainheading: "Add Batch",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/admin/subject",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <AddBatchForm />
    </div>
  );
}
export default AddBatch;
