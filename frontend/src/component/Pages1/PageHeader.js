import React, { useState, useEffect } from "react";
import { Link, Typography, Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useStyles from "../../styles";

function PageHeader(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const { Heading, handleOpenClose } = props;
  const [downloadInitiated, setDownloadInitiated] = useState(false);

  useEffect(() => {
    if (downloadInitiated) {
      toast.success("Your exam player has been downloaded successfully.");
      // Reset the state
      setDownloadInitiated(false);
    }
  }, [downloadInitiated]);

  const handleDownloadClick = () => {
    const link = document.createElement("a");
    link.href = `${process.env.REACT_APP_API_BASE_URL}/uploads/ExamApp/ExamPannelByParikshaDo Setup 0.1.0.exe`;
    // link.href = ExamPlayerApp;
    link.download = "ExamPannelByParikshaDo.exe";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Set the state to true to trigger the toast notification
    setDownloadInitiated(true);
  };

  return (
    <>
      {Heading?.map((data) => (
        <div className={`${classes.bgwhite} ${classes.boxshadow3}`}>
          <div
            className={`${classes.boxshadow4} ${classes.borderradius6px} ${classes.dflex} ${classes.alignitemscenter} ${classes.justifyspacebetween} ${classes.py0_5} ${classes.px1_5}`}
          >
            <div className={classes.heading}>
              <div className={`${classes.dflex} ${classes.alignitemscenter}`}>
                <div className={classes.mr0_5}> {data.pageicon}</div>
                <Typography
                  variant="h3"
                  className={`${classes.fontsize} ${classes.fontfamilyDMSans} ${classes.fw700}  ${classes.texttransformcapitalize}`}
                >
                  {data.mainheading}
                </Typography>
              </div>
              <div className={`${classes.dflex} ${classes.alignitemscenter}`}>
                <Typography
                  variant="subtitle1"
                  className={`${classes.fontfamilyoutfit} ${classes.fw400} ${classes.fontsize3}`}
                >
                  {data.subhead}
                </Typography>
                <Link
                  className={`${classes.fontfamilyoutfit} ${classes.fw400} ${classes.cursorpointer} ${classes.fw600} ${classes.fontsize3} ${classes.textcolorlink} ${classes.ml0_5} ${classes.textdecorationnone}`}
                >
                  {data.showDownloadButton && (
                    <Link
                      onClick={data.onDownload}
                      className={`${classes.fontfamilyoutfit} ${classes.fw400} ${classes.fw600} ${classes.fontsize3} ${classes.textcolorlink} ${classes.ml0_5} ${classes.textdecorationnone} ${classes.customButtonClass}`}
                      to="#"
                    >
                      Download bulk Sample Files
                    </Link>
                  )}
                </Link>
              </div>
            </div>

            <div className={`${classes.dflex} `}>
              {data.downloadexam && (
                <div className={`${classes.btnContainer}  `}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDownloadClick}
                    className={classes[data.addbtnstyle]}
                  >
                    Download Exam Player
                  </Button>
                </div>
              )}
              {data.addbtnstyle && data.addbtnstyle2 && (
                <div className={classes.btnContainer}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(data.path)}
                    className={classes[data.addbtnstyle]}
                  >
                    {data.addbtnicon}
                    {data.addbtntext}
                  </Button>
                </div>
              )}

              {data.publishbtn && (
                <div>
                  <Button
                    className={classes[data.publishbtnstyle]}
                    onClick={handleOpenClose}
                  >
                    {data.publishIcon}
                    {data.publishtext}
                  </Button>
                </div>
              )}
              {data.addbtnstyle && (
                <div className={`${classes.btnContainer} ${classes.ml1}`}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(data.path)}
                    className={classes[data.addbtnstyle]}
                  >
                    {data.addbtnicon}
                    {data.addbtntext}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
export default PageHeader;
