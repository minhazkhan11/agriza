import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Divider,
  Fade,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useStyles from "../../../../styles";

function WithdrawalPopup({
  open,
  handleOpenClose,
  fetchData,
  fetchWalletBalance,
  fetchData1

}) {
  const classes = useStyles();

  const initialData = {
    amount: "",
    account_holder_name: "",
    branch: "",
    account_no: "",
    ifsc_code: "",
  };

  const [formDetails, setFormDetails] = useState(initialData);
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [orders, setOrders] = useState([]);
  const [accountType, setAccountType] = useState("existing");

  const handleFormChange = (fieldName, value) => {
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [fieldName]: value,
    }));
  };

  const handleChangeStatusRadio = (event) => {
    setAccountType(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!formDetails.amount) {
        toast.error("Enter your amount");
        return;
      }
      if (!accountType) {
        toast.error("Select account type");
        return;
      }
      if (accountType === "new" && !formDetails.account_holder_name) {
        toast.error("Enter account holder name");
        return;
      }
      if (accountType === "new" && !formDetails.branch) {
        toast.error("Enter branch name");
        return;
      }
      if (accountType === "new" && !formDetails.account_no) {
        toast.error("Enter account number");
        return;
      }
      if (accountType === "new" && !formDetails.ifsc_code) {
        toast.error("Enter IFSC code");
        return;
      }

      // console.log("user", "new");

      const data = {
        settlement: {
          amount: formDetails.amount,
          account_type: accountType,
          account_holder_name: formDetails.account_holder_name,
          account_no: formDetails.account_no,
          ifsc_code: formDetails.ifsc_code,
          branch_name: formDetails.branch,
        },
      };
      console.log("data", data);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/settlement/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      console.log("API Response:", response);

      if (response.status === 200) {
        toast.success("Amount Withdraw Successfully");
        setTimeout(() => {
          fetchData();
          fetchData1();
          // fetchWalletBalance();
          handleOpenClose();
        }, 2000);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <>
      <ToastContainer />
      <Fade in={open}>
        <div className={`${classes.ordersmodal} ${classes.w45}`}>
          <Button onClick={handleOpenClose} className={classes.closeIcon}>
            <CloseIcon />
          </Button>
          <div>
            <Typography
              className={`${classes.fontsize} ${classes.fontfamilyoutfit} ${classes.fw600}`}
              variant="h2"
            >
              Withdrawal
            </Typography>
          </div>
          <Divider className={classes.dottedhr} />

          <FormControl
            className={` ${classes.w100} ${classes.maxh65} ${classes.pagescroll} ${classes.inputpadding} ${classes.inputborder}`}
          >
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w49}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Amount
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  required
                  onChange={(e) => handleFormChange("amount", e.target.value)}
                  type="number"
                  variant="outlined"
                  value={formDetails.cost}
                  placeholder="Enter here"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
            <div
              className={`${classes.py0} ${classes.mt1} ${classes.radiobtncont}`}
            >
              <RadioGroup
                aria-label="account_type"
                name="account_type"
                value={accountType}
                onChange={handleChangeStatusRadio}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize6} ${classes.fw500} ${classes.w50}`}
                >
                  Account Type <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <div
                  className={`${classes.w50} ${classes.dflex} ${classes.justifyspacebetween}`}
                >
                  <FormControlLabel
                    value="existing"
                    control={
                      <Radio onClick={() => setAccountType("existing")} />
                    }
                    label="Existing"
                  />
                  <FormControlLabel
                    value="new"
                    control={<Radio onClick={() => setAccountType("new")} />}
                    label="Add New"
                  />
                </div>
              </RadioGroup>
            </div>
            {accountType === "new" && (
              <>
                <div
                  className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
                >
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w49}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Account Holder Name
                      <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <TextField
                      type="text"
                      required
                      variant="outlined"
                      value={formDetails.account_holder_name}
                      onChange={(e) =>
                        handleFormChange("account_holder_name", e.target.value)
                      }
                      placeholder="Enter Here"
                    />
                  </div>
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w49}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Branch <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <TextField
                      type="text"
                      required
                      variant="outlined"
                      value={formDetails.branch}
                      onChange={(e) =>
                        handleFormChange("branch", e.target.value)
                      }
                      placeholder="Enter Here"
                    />
                  </div>
                </div>
                <div
                  className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
                >
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w49}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      Account No.
                      <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <TextField
                      type="number"
                      required
                      variant="outlined"
                      value={formDetails.account_no}
                      onChange={(e) =>
                        handleFormChange("account_no", e.target.value)
                      }
                      placeholder="Enter Here"
                    />
                  </div>
                  <div
                    className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w49}`}
                  >
                    <FormLabel
                      className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                    >
                      IFSC Code <span className={classes.textcolorred}>*</span>
                    </FormLabel>
                    <TextField
                      type="text"
                      required
                      variant="outlined"
                      value={formDetails.ifsc_code}
                      onChange={(e) =>
                        handleFormChange("ifsc_code", e.target.value)
                      }
                      placeholder="Enter Here"
                    />
                  </div>
                </div>
              </>
            )}

            <div
              className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt2}`}
            >
              <Button
                onClick={handleSubmit}
                className={`${classes.bluebtn} ${classes.w20}`}
              >
                Submit
              </Button>
            </div>
          </FormControl>
        </div>
      </Fade>
    </>
  );
}

export default WithdrawalPopup;
