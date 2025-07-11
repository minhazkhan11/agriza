import React, { useState } from "react";
import useStyles from "../../../../styles";
import Basic from "./Basic/Basic";
import { useLocation } from "react-router-dom";

export default function AddAlreadyCustomersForm() {
  const classes = useStyles();
  const { state } = useLocation();
  const editbusinessEntityId = state?.be_information.id;

  const [businessEntityId, setBusinessEntityId] =
    useState(editbusinessEntityId);

  return (
    <div className={`${classes.pb0} ${classes.pt1} `}>
      <div className={classes.root}>
        <Basic setBusinessEntityId={setBusinessEntityId} businessEntityId={businessEntityId}/>
      </div>
    </div>
  );
}
