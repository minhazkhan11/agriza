import React from "react";
import PageHeader from "../../PageHeader";
import AddCoachingForm from "./AddCoachingForm";
import { ReactComponent as TeachersIcon } from "../../../images/teachersimage/teachersicon.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";

function AddCoaching() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <TeachersIcon />,
      mainheading: "Add Coaching",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/admin/coaching",
    },
  ];
  return (
    <div className={`${classes.p2}`}>
      <PageHeader Heading={Heading} />
      <AddCoachingForm />
    </div>
  );
}
export default AddCoaching;
