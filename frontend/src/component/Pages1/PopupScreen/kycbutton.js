import React, { useState } from "react";
import useStyles from "../../../styles";
import { Button, Modal, Backdrop } from "@material-ui/core";
import KycPopup from "./KycPopup";

const Kycbutton = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState();

  const handleOpenClose = (data) => {
    setOpen(!open);
    setInfo(data);
  };



  return (
    <>
      <div
        className={`${classes.dflex} ${classes.justifycenter} ${classes.mt2} ${classes.justifyaround}`}
      >
        <Button
          className={`${classes.bggreen}`}
          onClick={() => {
            handleOpenClose();
          }}
        >
        KYC Verification
        </Button>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleOpenClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <KycPopup
            handleOpenClose={handleOpenClose}
            open={open}
            info={info}
          />
        </Modal>
        
      
      </div>
    </>
  );
};

export default Kycbutton;
