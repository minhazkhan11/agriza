import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as FeedbackIcon } from "../../../images/mainheadingicon/feedback.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";
import EditFeedbackForm from "./EditFeedbackForm";

function EditFeedback () {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <FeedbackIcon />,
      mainheading: "Edit Feedback",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/admin/feedback",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading} />
      <EditFeedbackForm />
    </div>
  );
}
export default EditFeedback ;
