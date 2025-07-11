import React from "react";
import PageHeader from "../../PageHeader";
import EditLearnerForm from "./EditLearnerForm";
import { ReactComponent as LearnerIcon } from "../../../images/learnersimage/learnericon.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";

function EditLearner() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <LearnerIcon />,
      mainheading: "Edit Learner",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/admin/learner",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading} />
      <EditLearnerForm />
    </div>
  );
}
export default EditLearner;
