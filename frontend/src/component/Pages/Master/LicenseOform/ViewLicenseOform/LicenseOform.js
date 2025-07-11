import React, { useState } from "react";
import { Backdrop, Modal } from "@material-ui/core";
import PageHeader from "../../../PageHeader";
import ViewLicense from "./ViewLicenseOform";
import { ReactComponent as CoursesIcon } from "../../../../images/courseimage/coursesicon.svg";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import useStyles from "../../../../../styles";
import AddLicenseProduct from "./AddLicenseOformProduct";

function LicenseOform() {
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
      mainheading: "O-Form",
      // subhead: "Want to Add in Bulk ? ?",
      // downloadlink: "Download bulk Sample Files",
      // addmultitext: "Create New O-Form",
      // addmultiicon: <AddIcon />,
      // addmultistyle: "bluebtn",
      // onClick: handlePopUp,
      addbtntext: "Create New O-Form",
      addbtnicon: <AddIcon />,
      addbtnstyle: "bluebtn",
      path: "/create-oform-versioning",
    },
  ];
  return (
    <div className={`${classes.p1} ${classes.pb0}`}>
      <PageHeader Heading={Heading} />
      <ViewLicense handlePopUp={handlePopUp} setRowId={setRowId} />
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
        <AddLicenseProduct handlePopUp={handlePopUp} rowId={rowId} />
      </Modal>
    </div>
  );
}
export default LicenseOform;
