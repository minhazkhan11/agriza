import React from "react";
import useStyles from "../../styles";
import { Button } from "@material-ui/core";

function AddMoreAndRemoveButton({handleAdd, handleRemove, data}) {
  const classes = useStyles();
  return (
    <div
      className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt0_5}`}
    >
      <Button
        onClick={handleAdd}
        style={{ marginRight: "1rem" }}
        className={classes.addmorebtn}
      >
        Add More
      </Button>
      {data.length > 1 && (
        <Button
          onClick={handleRemove}
          className={classes.removebtn}
        >
          Remove
        </Button>
      )}
    </div>
  );
}

export default AddMoreAndRemoveButton;
