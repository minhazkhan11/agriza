import React, { useEffect, useState } from "react";
import { ReactComponent as ExamIcon } from "../images/examimage/examicon.svg";
import { ReactComponent as AddIcon } from "../images/pageheadingicon/addicon.svg";
import useStyles from "../../styles";
import { ReactComponent as ExportIcon } from "../images/commonicon/exporticon.svg";
import { ReactComponent as ResultIcon } from "../images/questionimage/resulticon.svg";
import {
  Button,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

function AddQuestionMain({
  rowId,
  decryptedToken,
  dashboard,
  result,
  Heading,
  onSearch,
  centerFilterData,
  setCenterFilterData,
  filterData,
  setFilterData,
  centerDeatil,
}) {
  const classes = useStyles();
  const handleSearchChange = (event) => {
    onSearch(event.target.value);
  };

  const [fileURL, setFileURL] = useState("");
  const [openSubmitConfirmDialog, setOpenSubmitConfirmDialog] = useState(false);
  const handleOpenConfirmDialog = () => {
    setOpenSubmitConfirmDialog(true);
  };

  const [openReloginConfirmDialog, setOpenReloginConfirmDialog] =
    useState(false);
  const handleOpenReloginConfirmDialog = () => {
    setOpenReloginConfirmDialog(true);
  };

  const exportResultApi = async (rowId, value) => {
    try {
      let url;
      if (value) {
        url = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/exam/export/report02/${rowId}`;
      } else if (result) {  
        url = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/exam/export/${rowId}`;
      } else if (dashboard) {
        url = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/exam/export/giving/${rowId}`;
      }

      if (!url) return; // Exit if no URL is set

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200) {
        setFileURL(response.data.file_url);
        // toast.success("Result CSV has been downloaded successfully.");
      } else {
        // toast.error("Failed to download the CSV file.");
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : "An error occurred while fetching the data.";
      // toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if ((result || dashboard) && rowId && decryptedToken) {
      exportResultApi(rowId);
    }
  }, [result, dashboard, rowId, decryptedToken]);

  const handleExportClick = (value) => {
    if (fileURL && rowId && decryptedToken) {
      window.open(fileURL, "_blank");
      toast.success("CSV has been downloaded successfully.");
    } else {
      toast.error("Export file is not available for this.");
    }
    if (value && rowId && decryptedToken) {
      exportResultApi(rowId, value);
    }
  };

  const handleSubmitAllGivingCandidates = async () => {
    try {
      const requestBody = {
        exam: {
          exam_id: rowId,
        },
      };

      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/exam/live/submit/all`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      if (response.status === 200) {
        // Handle success
        toast.success("Successfully submitted started candidates exam.");
      } else {
        // Handle API errors
        toast.error("Failed to submit all started candidates exam.");
      }
    } catch (error) {
      // Handle network errors or other exceptions
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : "An error occurred while making the request.";
      toast.error(errorMessage);
    }
  };

  const handleReloginAllGivingCandidates = async () => {
    try {
      const requestBody = {
        exam: {
          exam_id: rowId,
        },
      };

      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/exam/live/logout/all`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      if (response.status === 200) {
        // Handle success
        toast.success(
          "Successfully re-logged permission for all started candidates."
        );
      } else {
        // Handle API errors
        toast.error(
          "Failed to re-login permission for all started candidates."
        );
      }
    } catch (error) {
      // Handle network errors or other exceptions
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : "An error occurred while making the request.";
      toast.error(errorMessage);
    }
  };

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  return (
    <>
      <ToastContainer />

      {Heading?.map((data) => (
        <div
          className={`${classes.mt0_5} ${classes.p2} ${classes.py1} ${classes.bgwhite} ${classes.boxshadow3} ${classes.dflex} ${classes.flexdirectioncolumn} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.inputborder}`}
        >
          <div className={`${classes.dflex}  ${classes.justifyspacebetween}`}>
            <div className={`${classes.dflex} ${classes.alignitemscenter}`}>
              {data.pageicon}

              <Typography
                variant="h3"
                className={`${classes.fontsize} ${classes.fontfamilyDMSans} ${classes.fw700}`}
              >
                {data.mainheading}
              </Typography>
            </div>
            <div className={`${classes.dflex} ${classes.alignitemscenter}`}>
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.mr0_5} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                {data.searchlabel}
              </FormLabel>
              <TextField
                className={`${classes.textcolorformlabel}`}
                type="text"
                variant="outlined"
                required
                placeholder={data.searchlabel}
                onChange={handleSearchChange}
              />
              {/* <Button className={`${classes.custombtnblue} ${classes.ml1}`}>
              Search
            </Button> */}
            </div>
            {data.report1 && (
              <Button
                onClick={() => handleExportClick(data.report1)}
                type=""
                className={`${classes.custombtnblue} ${classes.ml1}`}
              >
                {data.report1} <ExportIcon className={`${classes.ml1}`} />
              </Button>
            )}
            {data.report2 && (
              <Button
                onClick={() => handleExportClick(data.report2)}
                type=""
                className={`${classes.custombtnblue} ${classes.ml1}`}
              >
                {data.report2} <ExportIcon className={`${classes.ml1}`} />
              </Button>
            )}
            {data.report3 && (
              <Button
                onClick={() => handleExportClick(data.report3)}
                type=""
                className={`${classes.custombtnblue} ${classes.ml1}`}
              >
                {data.report3} <ExportIcon className={`${classes.ml1}`} />
              </Button>
            )}
          </div>
          <div className={`${classes.mt1}`}>
            <div className={`${classes.dflex}  ${classes.justifyspacebetween}`}>
              <div className={`${classes.dflex} ${classes.w40}`}>
                {data.centerfilter && (
                  <div className={classes.allcategory}>
                    <Select
                      value={centerFilterData}
                      onChange={(e) => setCenterFilterData(e.target.value)}
                      displayEmpty
                      className={classes.selectEmpty}
                      MenuProps={menuProps}
                      variant="outlined"
                    >
                      <MenuItem disabled value="">
                        <em>Filter</em>
                      </MenuItem>
                      <MenuItem value="All Center">All Center</MenuItem>
                      {centerDeatil?.map((center) => (
                        <MenuItem
                          key={center.center_code}
                          value={`${center.center_code} - ${center.center_name}`}
                        >
                          {center.center_code} - {center.center_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                )}
                {data.filter && (
                  <div className={`${classes.allcategory} ${classes.ml1}`}>
                    <Select
                      value={filterData}
                      onChange={(e) => setFilterData(e.target.value)}
                      displayEmpty
                      className={classes.selectEmpty}
                      MenuProps={menuProps}
                      variant="outlined"
                    >
                      <MenuItem disabled value="">
                        <em>Filter</em>
                      </MenuItem>
                      <MenuItem value="All">All</MenuItem>
                      <MenuItem value="Giving">Started</MenuItem>
                      <MenuItem value="Not Giving">Not Started</MenuItem>
                      <MenuItem value="Submitted">Submitted</MenuItem>
                    </Select>
                  </div>
                )}
              </div>
              <div className={`${classes.dflex}`}>
                {data.submit && (
                  <div className={`${classes.mr1}`}>
                    <Button
                      onClick={handleOpenConfirmDialog}
                      className={classes.custombtnoutline}
                    >
                      Submit all started candidates
                    </Button>
                  </div>
                )}
                {data.relogin && (
                  <div>
                    <Button
                      onClick={handleOpenReloginConfirmDialog}
                      className={classes.custombtnoutline}
                    >
                      Relogin all started candidates
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      <Dialog
        open={openSubmitConfirmDialog}
        onClose={() => setOpenSubmitConfirmDialog(false)}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit the exam for all started candidates?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenSubmitConfirmDialog(false)}
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={() => {
              handleSubmitAllGivingCandidates();
              setOpenSubmitConfirmDialog(false);
            }}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openReloginConfirmDialog}
        onClose={() => setOpenReloginConfirmDialog(false)}
        aria-labelledby="relogin-confirm-dialog-title"
      >
        <DialogTitle id="relogin-confirm-dialog-title">
          Confirm Relogin
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to re-login all started candidates?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenReloginConfirmDialog(false)}
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={() => {
              handleReloginAllGivingCandidates();
              setOpenReloginConfirmDialog(false);
            }}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default AddQuestionMain;
