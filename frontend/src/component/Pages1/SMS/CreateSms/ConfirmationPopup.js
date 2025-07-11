import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Fade, Typography } from "@material-ui/core";
import "react-toastify/dist/ReactToastify.css";
import useStyles from "../../../../styles";
import { Divider } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";

const ConfirmationPopup = (props) => {
  const {
    open,
    handleOpenClose,
    selectedCourse,
    handleFormSubmit,
    selectedLearner,
    learners,
  } = props;

  const classes = useStyles();


  return (
    <>
      <Fade in={open}>
        <div
          className={`${classes.ebookpopup} ${classes.p1} ${classes.positionrelative} `}
        >
          <Button className={`${classes.closebtn}`}>
            <ClearIcon
              className={`${classes.textcolorwhite}`}
              onClick={() => {
                handleOpenClose();
              }}
            />
          </Button>

          <Typography
            className={`${classes.lightblackcolor} ${classes.fontfamilyDMSans} ${classes.fontsize5} ${classes.fw600} ${classes.lineheight} `}
          >
            Confirmation Required !
          </Typography>
          <Divider className={`${classes.mt1} ${classes.background00577B}`} />
          <div
            className={`${classes.pagescroll} ${classes.maxh75} ${classes.mt1}`}
          >
            <div>
              {!selectedCourse && selectedLearner.length === 0 && (
                <Typography>
                  Are you want to send SMS to all learners?
                </Typography>
              )}

              {selectedLearner.length === 0 && selectedCourse && (
                <>
                <Typography className={classes.mb1}>
                  Are you want to send SMS to selected learners?
                </Typography>
                  {learners.map((data, index) => (
                    <Typography key={index}>
                      {`${index + 1}) ${data.full_name} - ${data.phone}`}
                    </Typography>
                  ))}
                </>
              )}

              {selectedLearner.length !== 0 && (
                <>
                <Typography className={classes.mb1}>
                  Are you want to send SMS to selected learners ?
                </Typography>
                  {selectedLearner.map((data, index) => (
                    <Typography key={index}>
                      {`${index + 1}) ${data.full_name} - ${data.phone}`}
                    </Typography>
                  ))}
                </>
              )}
            </div>

            <div
              className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1} `}
            >
              <Button
                className={`${classes.border1}  ${classes.fontFamilyJost} ${classes.fw600}  ${classes.lightbrowncolor} ${classes.borderradius0375} ${classes.m0_5} ${classes.w30}`}
                onClick={() => {
                  handleOpenClose();
                }}
              >
                Cancel
              </Button>
              <Button
                className={`${classes.fontFamilyJost} ${classes.fw600} ${classes.bgdarkblue} ${classes.textcolorwhite}  ${classes.m0_5} ${classes.w30}`}
                onClick={() => handleFormSubmit()}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </Fade>
    </>
  );
};

export default ConfirmationPopup;
