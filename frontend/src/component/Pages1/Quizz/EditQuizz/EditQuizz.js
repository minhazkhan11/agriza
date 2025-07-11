import React from "react";
import PageHeader from "../../PageHeader";
import AddQuizzForm from "./EditQuizzForm";
import { ReactComponent as QuizzIcon } from "../../../images/quizzimage/quizzicon.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";

function EditQuizz() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <QuizzIcon />,
      mainheading: "Edit Quizz",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/admin/quizz",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading} />
      <AddQuizzForm />
    </div>
  );
}
export default EditQuizz;
