import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as QuizzIcon } from "../../../images/quizzimage/quizzicon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";
import ViewQuizz from "./ViewQuizz";


function Quizz() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<QuizzIcon />,
      mainheading: "Quiz",
      // subhead: "Want to Add Bulk Quizes ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create Quiz",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/admin/addquizz",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading}/>
      <ViewQuizz/>
    </div>
  );
}
export default Quizz;