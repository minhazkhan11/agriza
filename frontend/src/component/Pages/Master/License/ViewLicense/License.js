import React, { useState } from "react";
import { Backdrop, Modal } from "@material-ui/core";
import PageHeader from "../../../PageHeader";
import ViewLicense from "./ViewLicense";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";
import AddLicenseProduct from "./AddLicenseProduct";

function License() {
  const classes = useStyles();

  const [open, setOpen] = useState();
  const [rowId, setRowId] = useState();

  const handlePopUp = () => {
    setOpen(!open);
  };

  const Heading = [
    {
      id: 1,
      pageicon: <CoursesIcon />,
      mainheading: "License",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      addbtntext: "Create New License",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/create-license",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewLicense handlePopUp={handlePopUp} setRowId={setRowId}/>
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
        <AddLicenseProduct handlePopUp={handlePopUp} rowId={rowId}/>
      </Modal>
    </div>
  );
}
export default License;
