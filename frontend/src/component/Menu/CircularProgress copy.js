import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { decryptData } from "../../crypto";
import axios from "axios";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles({
  root: {
    width: "100%",
    display: "inline-flex",
    position: "relative",
    "& .MuiCircularProgress-colorPrimary": {
      color: "#30581A",
    },
    "& .MuiCircularProgress-barcolorPrimary": {
      color: "#30581A",
    },  
  },
  box: {
    inset: "0px",
    display: "flex",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});
function CircularProgressWithLabel(props) {
  const classes = useStyles();
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box
        className={classes.box}
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default function CircularStatic({Heading}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgressWithLabel value={Heading} />
    </div>
  );
}
