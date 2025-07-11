import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as SubjectIcon } from "../../../images/subjectimage/subjecticon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";
import ViewBatch from "./ViewBatch";


function Batch() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<SubjectIcon />,
      mainheading: "Batch",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext:"Create New Batch",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/admin/addbatch",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading}/>
      <ViewBatch/>
    </div>
  );
}
export default Batch;