import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as NotesIcon } from "../../../images/EbooksIcon/ebookicon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";
import ViewTeacher from "./ViewNotes";
import ViewNotes from "./ViewNotes";


function Notes() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon:<NotesIcon />,
      mainheading: "Notes",
      addbtntext:"Add",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path:"/admin/addnotes",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading}/>
      <ViewNotes/>
    </div>
  );
}
export default Notes;