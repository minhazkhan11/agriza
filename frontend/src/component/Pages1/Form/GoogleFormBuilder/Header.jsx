import { Fragment, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FormLabel } from "@material-ui/core";
import useStyles from "../../../../styles";

const Header = ({ headerData, handleHeaderData }) => {
  const classes = useStyles();
  return (
    <Fragment>
      <FormLabel
        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw600} ${classes.lineheight}`}
      >
        Title <span className={classes.textcolorred}>*</span>{" "}
      </FormLabel>
      <ReactQuill
        value={headerData?.form_title}
        placeholder="Form Title"
        onChange={(content) => handleHeaderData(content, "form_title")}
        style={{
          marginBottom: "20px",
        }}
      />
      <FormLabel
        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw600} ${classes.lineheight}`}
      >
        Description
      </FormLabel>
      <ReactQuill
      value={headerData?.form_description}
        placeholder="Form Description"
        onChange={(content) => handleHeaderData(content, "form_description")}
      />
    </Fragment>
  );
};

export default Header;
