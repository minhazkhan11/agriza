import React, { useState } from "react";
import PageHeader from "../../PageHeader";
import ViewLead from "./ViewLead";
import { ReactComponent as CoursesIcon } from "../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../styles";
import { Backdrop, Modal } from "@material-ui/core";
import AddLeadProduct from "./AddLeadProduct";

function Lead() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [rowId, setRowId] = useState();

  const handlePopUp = () => {
    setOpen(!open);
  };
  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "Lead",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Create New Lead",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/create-lead",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewLead handlePopUp={handlePopUp} setRowId={setRowId} />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={`${classes.modal}`}
        open={open}
        onClose={handlePopUp}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <AddLeadProduct handlePopUp={handlePopUp} rowId={rowId} />
      </Modal>
    </div>
  );
}
export default Lead;
