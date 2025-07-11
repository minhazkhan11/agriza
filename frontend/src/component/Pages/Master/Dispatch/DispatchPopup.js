import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import useStylesCustom from "../../../../styles";
import clsx from "clsx";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Check from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import SettingsIcon from "@material-ui/icons/Settings";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import VideoLabelIcon from "@material-ui/icons/VideoLabel";
import StepConnector from "@material-ui/core/StepConnector";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DispatcDispatchDetailshPopupForm from "./DispatchDetails";
import DispatchDetailsReview from "./DispatchDetailsReview";
import ItemQuantityDispatchForm from "./ItemQuantityDispatchForm";
import { toast, ToastContainer } from "react-toastify";
import { Fade } from "@material-ui/core";
import axios from "axios";
import { decryptData } from "../../../../crypto";

const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  active: {
    "& $line": {
      borderColor: "#FD6E38",
    },
  },
  completed: {
    "& $line": {
      borderColor: "#FD6E38",
    },
  },
  line: {
    borderColor: "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
  root: {
    color: "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
  },
  active: {
    color: "#FD6E38",
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  completed: {
    color: "#FD6E38",
    zIndex: 1,
    fontSize: 18,
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? (
        <Check className={classes.completed} />
      ) : (
        <div className={classes.circle} />
      )}
    </div>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
};

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  completed: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  },
  completed: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
    3: <VideoLabelIcon />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "relative",
    width: "60%",
    height: "83%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: "5px",
    "& .MuiTypography-h6": {
      color: "#000",
      fontSize: "1.125rem",
    },
    "& .MuiFormLabel-root": {
      margin: "0.5rem 0 0rem 0",
      color: "#5B5B5B",
      fontSize: "0.875rem",
    },
    "& .MuiOutlinedInput-root .Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0, 0, 0, 0.87) !important",
    },
    "& .MuiButtonBase-root": {
      padding: "7.5px 30px",
    },
    "& .MuiOutlinedInput-input": {
      padding: "10.5px 14px",
      fontSize: "0.875rem",
    },

    "& .MuiStepIcon-root.MuiStepIcon-active": {
      color: "#FD6E38",
    },

    "& .MuiStepIcon-root.MuiStepIcon-completed": {
      color: "#FD6E38",
    },
  },
  bgwhite: {
    background: "#FFFFFF !important",
  },
  closebtn: {
    position: "absolute",
    top: "-18px",
    right: "-18px",
    padding: "0px !important",
    backgroundColor: "#FD6E38 !important",
    height: "35px",
    minWidth: "35px",
    borderRadius: "50%",
    "&:hover": {
      backgroundColor: "#FD6E38 !important313866",
    },
  },
  closeicon: {
    fill: "#fff",
    width: "25px",
    height: "25px",
  },
  modalheading: {
    padding: "1rem 2rem 0rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dottedhr: {
    borderTop: "1px dashed #676767",
  },
  required: {
    color: "red",
  },
  form: {
    width: "100%",
    margin: "0 auto",
    display: "flex",
    height: "30vh",
    overflow: "scroll",
    justifyContent: "center",
    alignItems: "center",
    "&::-webkit-scrollbar ": {
      display: "none",
    },
  },
  forminner: {
    width: "90%",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    "&::file-selector-button": {
      display: "none",
    },
  },

  // btncontainer: {
  //   display: "flex",
  //   justifyContent: "space-between",
  //   margin: "1rem 0 2rem 0",
  //   "& .MuiButton-contained": {
  //     width: "55%",
  //   },
  //   "& .MuiButton-outlined": {
  //     width: "40%",
  //   },
  // },

  btncontainer: {
    display: "flex",
    justifyContent: "flex-end",
  },

  bluebtn: {
    background: "#FD6E38 !important",
    color: "#FFFFFF",
    fontSize: "0.875rem",
    marginRight: theme.spacing(1),
  },
  outlinebtn: {
    borderColor: "#676767",
    color: "#676767",
    fontSize: "0.875rem",
    marginRight: theme.spacing(1),
  },
  uploadlable: {
    borderColor: "rgba(0, 0, 0, 0.23)",
    fontSize: "0.875rem",
    borderStyle: "solid",
    borderWidth: "1px",
    borderRadius: "4px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: "14px",
    "&:hover": {
      borderColor: "rgba(0, 0, 0, 0.87)",
    },
    "& .MuiSvgIcon-root": {
      width: "0.9em",
      height: "0.9em",
      marginRight: "5px",
    },
  },
  descriptioninput: {
    "& .MuiOutlinedInput-multiline": {
      padding: "10px 14px",
    },
    "& .MuiOutlinedInput-inputMultiline": {
      padding: "0",
    },
  },
  root: {
    width: "100%",
    padding: "0rem 1rem 1rem 1rem",
    "& .MuiStepper-root": {
      padding: "0rem",
    },
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ["Dispatch Quantity", "Dispatch Details", "Dispatch Review"];
}

export default function DispatchPopup(props) {
  const {
    open,
    handleOpenClose,
    setRemark,
    remark,
    rowId,
    fetchData,
    selectedStatus,
  } = props;
  const classes = useStyles();
  const customClasses = useStylesCustom();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [activeStep, setActiveStep] = useState(0);
  const [itemDispatch, setItemDispatch] = useState([]);

  const [order, setOrder] = useState();
  const [orderItems, setOrderItems] = useState([]);

  const [formDetails, setFormDetails] = useState({
    id: rowId,
    order_status: "",
    bilty_number: "",
    order_invoice_number: "",
    transporter_name: "",
    transporter_contact_number: "",
    payment_type: "",
    driver_name: "",
    driver_contact_number: "",
    vehicle_number: "",
    broker_details: "",
    freight: "",
    note: "",
    dispatch_image: "",
  });

  const [thumbnailImagePreview, setThumbnailImagePreview] = useState("");

  const steps = getSteps();

  // const handleFormSubmit = async () => {

  // };

  const fetchDataFromAPI = async (rowId) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/admin/order_so_po/${rowId}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200) {
        const data = response?.data?.order;
        setOrder(data);
        setOrderItems(data?.order_items);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data from the API:", error);
    }
  };

  useEffect(() => {
    if (rowId) {
      fetchDataFromAPI(rowId);
    }
  }, [rowId]);

  const handleNext = () => {
    if (activeStep === 0) {
      // Validation for Step 0
      const hasError = itemDispatch.some((item) => {
        if (item.item_variants_id) {
          const quantity = item.dispatch_quantity ?? ""; // if null/undefined, default to empty string
          return String(quantity).trim() === "";
        }
        return false;
      });

      if (!itemDispatch || itemDispatch.length === 0) {
        toast.error("Please add at least one item for dispatch.");
        return;
      }

      if (hasError) {
        toast.error("Please enter dispatch quantity for all selected items.");
        return;
      }
    }

    if (activeStep === 1) {
      // Example condition - you need to actually fetch and validate the data from form (e.g., via ref or prop drilling)
      // if (!dispatchDetailsValid) {
      //   toast.error("Please fill all dispatch details.");
      //   return;
      // }
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <ItemQuantityDispatchForm
            rowId={rowId}
            setItemDispatch={setItemDispatch}
            itemDispatch={itemDispatch}
            orderItems={orderItems}
          />
        );
      case 1:
        return (
          <DispatcDispatchDetailshPopupForm
            setFormDetails={setFormDetails}
            formDetails={formDetails}
            setThumbnailImagePreview={setThumbnailImagePreview}
            thumbnailImagePreview={thumbnailImagePreview}
          />
        );
      case 2:
        return (
          <DispatchDetailsReview
            formDetails={formDetails}
            thumbnailImagePreview={thumbnailImagePreview}
            orderItems={orderItems}
            setItemDispatch={setItemDispatch}
            itemDispatch={itemDispatch}
          />
        );
      default:
        return "Unknown step";
    }
  }

  const handleSubmit = async () => {
    // 👈 Add async here
    try {
      const allFullyDispatched = orderItems.every((orderItem) => {
        const dispatchedItem = itemDispatch.find((d) => d.item_variants_id === orderItem.id);
        return (
          dispatchedItem && dispatchedItem.dispatch_quantity === parseInt(orderItem.quantity)
        );
      });



      const payload = {
        order: {
          id: rowId,
          order_status: allFullyDispatched ? "dispatch" : "partial dispatch",
          bilty_number: formDetails.bilty_number,
          order_invoice_number: formDetails.order_invoice_number,
          transporter_name: formDetails.transporter_name,
          transporter_contact_number: formDetails.transporter_contact_number,
          payment_type: formDetails.payment_type,
          driver_name: formDetails.driver_name,
          driver_contact_number: formDetails.driver_contact_number,
          vehicle_number: formDetails.vehicle_number,
          broker_details: formDetails.broker_details,
          freight: formDetails.freight,
          note: formDetails.note,
          dispatch_image: thumbnailImagePreview,
          item_order: itemDispatch,
        },
      };

      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/order_so_po/order/dispatch`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Order Dispatched changed successfully");
        handleOpenClose(); // Close popup or reset form
      } else {
        toast.error(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error("Submission failed!");
      console.error("Submit error:", error);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <>
      <Fade in={open}>
        <div className={`${classes.paper} ${classes.bgwhite}`}>
          <Button onClick={handleOpenClose} className={classes.closebtn}>
            <CloseIcon className={classes.closeicon} />
          </Button>
          <div className={classes.modalheading}>
            <Typography variant="h6">Dispatch</Typography>
          </div>
          <hr className={classes.dottedhr} />
          <div className={classes.root}>
            <Stepper
              alternativeLabel
              activeStep={activeStep}
              connector={<QontoConnector />}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel></StepLabel>
                </Step>
              ))}
            </Stepper>
            <div>
              <div>
                <Typography className={classes.instructions}>
                  {getStepContent(activeStep)}
                </Typography>
                <div className={classes.btncontainer}>
                  {/* <Button
                className={customClasses.bluebtn}
                variant="contained"
                // onClick={handleStatusChange}
              >
                Submit
              </Button>
              <Button
                className={customClasses.outlinebtn}
                // onClick={handleOpenClose}
                variant="outlined"
              >
                Cancel
              </Button> */}
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    // className={classes.button}
                    variant="outlined"
                    className={classes.outlinebtn}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    // onClick={handleNext}
                    onClick={
                      activeStep === steps.length - 1
                        ? handleSubmit
                        : handleNext
                    }
                    // className={classes.button}
                    className={classes.bluebtn}
                  >
                    {/* {activeStep === steps.length - 1 ? "Finish" : "Next"} */}
                    {activeStep === 0 && "Proceed"}
                    {activeStep === 1 && "Review"}
                    {activeStep === 2 && "Confirm"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fade>
    </>
  );
}
