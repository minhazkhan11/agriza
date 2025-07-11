import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useStyles from "../../../../styles";
import { Avatar, Divider, Button, Fade, Typography } from "@material-ui/core";
import { decryptData } from "../../../../crypto";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

function QAPopup(props) {
  const { open, handleOpenClose, responses } = props;
  const classes = useStyles();
  console.log(responses, "datadata");

  const handleDownloadFile = (url) => {
    window.open(url, "_blank");
  };

  function convertDateFormat(originalDate) {
    const [year, month, day] = originalDate.split("-");
    return `${day}-${month}-${year}`;
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Fade in={open}>
        <div
          className={`${classes.paperpopup} ${classes.p1} ${classes.positionrelative} ${classes.w50}`}
        >
          <Button className={`${classes.closebtn}`}>
            <CloseIcon
              className={`${classes.textcolorwhite}`}
              onClick={() => {
                handleOpenClose();
              }}
            />
          </Button>
          <div className={`${classes.pagescroll} ${classes.maxh75}`}>
            {responses?.map((data, i) => (
              <div
                className={`${classes.border1} ${classes.borderradius6px} ${classes.p1} ${classes.mt1}`}
              >
                <Typography
                  className={`${classes.fw600}`}
                  style={{ display: "flex", alignItems: "baseline" }}
                >
                  Ques. {i + 1}:
                  <span
                    style={{ marginLeft: "0.5rem", width: "88%" }}
                    dangerouslySetInnerHTML={{ __html: data.label }}
                  ></span>
                </Typography>
                <Typography
                  className={`${classes.fw500} ${classes.fontsize1} ${classes.ml1} ${classes.mt0_5}`}
                >
                  <b>Answer :</b>
                  {data.response ? (
                    data.type === "file" ? (
                      data.response[0]?.response ? (
                        <Button
                          className={`${classes.custombtnblue} ${classes.ml1}`}
                          onClick={() => {
                            handleDownloadFile(data.response[0]?.response);
                          }}
                        >
                          View File
                        </Button>
                      ) : (
                        <span style={{ marginLeft: "0.5rem" }}> N/A</span>
                      )
                    ) : data.type === "date" ? (
                      <span
                        style={{ marginLeft: "0.5rem", width: "88%" }}
                        dangerouslySetInnerHTML={{
                          __html: convertDateFormat(data.response[0]?.response),
                        }}
                      ></span>
                    ) : (
                      <span
                        style={{ marginLeft: "0.5rem", width: "88%" }}
                        dangerouslySetInnerHTML={{
                          __html: data.response[0]?.response,
                        }}
                      ></span>
                    )
                  ) : (
                    <span style={{ marginLeft: "0.5rem" }}> N/A</span>
                  )}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </Fade>
    </>
  );
}

export default QAPopup;
