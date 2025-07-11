import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import useStylesCustom from "../../styles";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { IconButton } from "@material-ui/core";
import { decryptData } from "../../crypto";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CircularProgressWithLabel from "./CircularProgress";
function LinearProgressWithLabel({ value, onNavigate }) {
  const classes = useStylesCustom();

  return (
    <div
      className={`${classes.dflex}  ${classes.alignitemscenter} ${classes.justifyspacebetween}`}
    >
      <Box className={`${classes.w100}`}>
        <Box
          className={` ${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemsend}`}
        >
          <Typography
            className={`${classes.fontsize18px} ${classes.fontFamilyJost} ${classes.fw600}`}
          >
            Your Profile
          </Typography>
          <Typography
            className={`${classes.textcolororange} ${classes.fontFamilyJost} ${classes.fontsize12px}`}
          >
            ({`${Math.round(value)}%`} Completed){" "}
          </Typography>
        </Box>
        <Box width="100%" mr={1}>
          <LinearProgress variant="determinate" value={value} />
        </Box>
      </Box>
      <IconButton className={classes.customiconbtn} onClick={onNavigate}>
        <ChevronRightIcon />
      </IconButton>
    </div>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

const useStyles = makeStyles({
  root: {
    width: "100%",
    "& .MuiLinearProgress-colorPrimary": {
      backgroundColor: "#C0DDB1",
      borderRadius: "30px",
    },
    "& .MuiLinearProgress-barColorPrimary": {
      backgroundColor: "#30581A",
    },
  },
});

export default function LinearWithValueLabel({ Heading, progressData }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const decryptedUserRole = decryptData(sessionStorage.getItem("userRole"));
  const decryptedAddedBy = decryptData(sessionStorage.getItem("addedBy"));

  const entityDetailsNew = JSON.parse(sessionStorage?.getItem("entityDetails"));

  const handleCheck = () => {
    const data = {
      be_information: {
        pan_number: entityDetailsNew.pan_number,
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/business_entity_basic/profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        const localState = response.data;
        navigate("/myprofile", { state: localState });
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const fieldRoutes = {
    authorised: "/myprofile",
    bank_details: "/myprofile",
    basicinformation: "/myprofile",
    business_area: "/region-list",
    document: "/myprofile",
    license: "/license-list",
    product_area: "/product-area-list",
    warehouse: "/warehouse-list",
  };

  const handleNavigate = () => {
    if (!progressData) return;

    const nextIncompleteField = Object.keys(progressData).find(
      (key) => !progressData[key]
    );

    if (nextIncompleteField) {
      const nextRoute = fieldRoutes[nextIncompleteField];
      if (nextRoute === "/myprofile") {
        handleCheck();
      } else {
        navigate(nextRoute);
      }
    }
  };
  return (
    <div className={classes.root}>
      <LinearProgressWithLabel value={Heading} onNavigate={handleNavigate} />
    </div>
  );
}
