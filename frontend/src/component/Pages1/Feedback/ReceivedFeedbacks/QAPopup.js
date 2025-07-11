import CloseIcon from "@material-ui/icons/Close";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useStyles from "../../../../styles";
import { Button, Fade, Typography } from "@material-ui/core";

function QAPopup(props) {
  const { open, handleOpenClose, responses } = props;
  const classes = useStyles();
  console.log(responses, "datadata");

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
                  style={{ display: "flex", alignItems: "center" }}
                >
                  Ques. {i + 1}:
                  <span
                    style={{ marginLeft: "0.5rem" }}
                    dangerouslySetInnerHTML={{ __html: data.label }}
                  ></span>
                </Typography>
                {data.response?.response ? (
                  <Typography
                    className={`${classes.fw500} ${classes.fontsize1} ${classes.ml1} ${classes.mt0_5}`}
                  >
                    <b>Answer :</b> {data.response?.response}
                  </Typography>
                ) : (
                  <span>N/A</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </Fade>
    </>
  );
}

export default QAPopup;
