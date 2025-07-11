import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as FeedbackIcon } from "../../../images/mainheadingicon/feedback.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";
import ViewFeedback from "./ViewFeedback";

function Feedback() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <FeedbackIcon />,
      mainheading: "Feedback",
      addbtntext: "Add",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/admin/addfeedback",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading} />
      <ViewFeedback />
    </div>
  );
}
export default Feedback;
