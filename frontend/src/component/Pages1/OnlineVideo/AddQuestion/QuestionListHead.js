import React from "react";
import { Typography } from "@material-ui/core";
import { Link} from "react-router-dom";
import { Button } from "@mui/material";
import useStyles from "../../../../styles";
import { ReactComponent as ImportIcon } from "../../../images/commonicon/importicon.svg";
import { ReactComponent as QuestionIcon } from "../../../images/questionimage/questionicon.svg";

function PageHeader() {
  const classes = useStyles();

  return (
    <>
        <div className={`${classes.bgwhite} ${classes.boxshadow3}`}>
          <div
            className={`${classes.boxshadow4} ${classes.borderradius6px} ${classes.dflex} ${classes.alignitemscenter} ${classes.justifyspacebetween} ${classes.py0_5} ${classes.px1_5}`}
          >
            <div className={classes.heading}>
              <div className={`${classes.dflex} `}>
                <div className={classes.mr0_5}> <QuestionIcon /></div>
                <Typography
                  variant="h3"
                  className={`${classes.fontsize} ${classes.fontfamilyDMSans} ${classes.fw700}`}
                >
                  Questions
                </Typography>
              </div>
              <div className={`${classes.dflex} ${classes.alignitemscenter} `}>
                <Typography
                  variant="subtitle1"
                  className={`${classes.fontfamilyoutfit} ${classes.fw400} ${classes.fontsize3}`}
                >
                  Want to Add in Bulk ? ?
                </Typography>
                <Link className={`${classes.fontfamilyoutfit} ${classes.fw400} ${classes.fw600} ${classes.fontsize3} ${classes.textcolorlink} ${classes.ml0_5} ${classes.textdecorationnone}`}> Download bulk Sample Files?</Link>
              </div>
            </div>
            <div className={classes.btnContainer}>
              <Button
                variant="contained"
                color="primary"
                className={classes.transparentbtn}
              >
              Import Excel File <ImportIcon className={`${classes.ml1}`} />
              </Button>
            </div>

           


          </div>
        </div>
    </>
  );
}
export default PageHeader;
