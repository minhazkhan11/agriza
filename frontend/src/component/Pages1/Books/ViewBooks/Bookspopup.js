import React, { useState } from "react";
import { Button, Fade, FormControlLabel, Checkbox, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Bookspopup = (props) => {
  const navigate = useNavigate();
  const { open, handleOpenClose } = props;
  const [checked, setChecked] = useState(false);

  const handleChange = (e) => {
    setChecked(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checked) {
      navigate("/admin/addbook");
    } else {
      toast.error("Please click on checked button then proceed.");
    }
  };

  // Inline styles with updated width and text wrapping
  const styles = {
    popup: {
      width: "80%", // Set a specific width or max-width as needed, e.g., "500px" or "80%"
      maxWidth: "600px", // You can also use maxWidth to ensure responsiveness
      padding: "1rem",
      position: "relative",
      backgroundColor: "#fff",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      overflowWrap: "break-word", // Ensures long text wraps and doesn't overflow
      textAlign: "justify", // Justify the text for better readability
    },
    closeBtn: {
      position: "absolute",
      top: "0.5rem",
      right: "0.5rem",
      color: "#fff",
      backgroundColor: "#333",
      borderRadius: "50%",
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "center",
      marginTop: "1rem",
    },
    cancelButton: {
      borderColor: "#BDBDBD",
      color: "#333",
      marginRight: "0.5rem",
    },
    okButton: {
      backgroundColor: "#1565C0",
      color: "#fff",
      marginLeft: "0.5rem",
    },
  };

  return (
    <>
      <ToastContainer />

      <Fade in={open}>
        <div style={styles.popup}>

          {/* <IconButton style={styles.closeBtn} onClick={handleOpenClose}>
            <CloseIcon />
          </IconButton> */}

          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={handleChange}
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            }
            label="Books will be directly published on the Pariksha Do website. Any orders will reflect in the content orders section, and a commission of 20% will be applied to every book priced within this range."
            style={{ textAlign: "justify" }} // Make sure the label text also justifies correctly
          />

          <div style={styles.buttonGroup}>
            <Button style={styles.cancelButton} onClick={handleOpenClose}>
              Cancel
            </Button>
            <Button style={styles.okButton} onClick={handleSubmit}>
              Ok
            </Button>
          </div>
        </div>
      </Fade>
    </>
  );
};

export default Bookspopup;
