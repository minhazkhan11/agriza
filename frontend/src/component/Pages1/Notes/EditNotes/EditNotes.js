import React from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as NotesIcon } from "../../../images/EbooksIcon/ebookicon.svg";
import { ReactComponent as BackIcon } from "../../../images/pageheadingicon/backicon.svg";
import useStyles from "../../../../styles";
import EditNotesForm from "./EditNotesForm";

function AddNotes() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <NotesIcon />,
      mainheading: "Edit Notes",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/admin/notes",
    },
  ];
  return (
    <div className={`${classes.p2} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <EditNotesForm/>
    </div>
  );
}
export default AddNotes;
