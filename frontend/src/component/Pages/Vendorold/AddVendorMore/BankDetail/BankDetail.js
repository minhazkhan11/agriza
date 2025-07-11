import React, { useState, useEffect } from "react";
import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import useStyles from "../../../../../styles";
import axios from "axios";
import { decryptData } from "../../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import AddMoreAndRemoveButton from "../../../../CustomComponent/AddMoreAndRemoveButton";

function BankDetail({ setValue, businessEntityId }) {
  const classes = useStyles();

  const { state } = useLocation();

  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const bankDetails = state?.be_bank_details;

  const initialData =
    bankDetails && bankDetails.length > 0
      ? bankDetails.map((exp) => ({
          bank_name: exp?.bank_name || "",
          branch: exp?.branch || "",
          bank_account_number: exp?.bank_account_number || "",
          ifsc_code: exp?.ifsc_code || "",
          be_information_id: exp?.be_information_id || "",
        }))
      : [
          {
            bank_name: "",
            branch: "",
            bank_account_number: "",
            ifsc_code: "",
            be_information_id: businessEntityId,
          },
        ];

  const [bankDetailsArray, setBankDetailsArray] = useState(initialData);

  const handleAddBankDetailsArrayRow = () => {
    setBankDetailsArray([
      ...bankDetailsArray,
      {
        bank_name: "",
        branch: "",
        bank_account_number: "",
        ifsc_code: "",
        be_information_id: businessEntityId,
      },
    ]);
  };

  const handleRemoveBankDetailsArray = () => {
    setBankDetailsArray((prevRows) => {
      if (prevRows.length > 1) {
        return prevRows.slice(0, -1);
      }
      return prevRows;
    });
  };

  const handleBankDetailsArrayRowChange = (index, fieldName, value) => {
    const updatedRows = [...bankDetailsArray];
    let row = { ...updatedRows[index] };
    row[fieldName] = value;
    updatedRows[index] = row;
    setBankDetailsArray(updatedRows);
  };

  const handleFormSubmit = () => {
    // if (!formDetails.bank_name.trim()) {
    //   toast.warn("Please enter a name.");
    //   return;
    // }
    // if (!formDetails.branch.trim()) {
    //   toast.warn("Please enter a description.");
    //   return;
    // }

    const data = {
      bankdetails: bankDetailsArray,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/business_bank_details/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Bank Details Updated Successfully");
        setTimeout(() => {
          setValue(2);
        }, 1000);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <>
      <ToastContainer />

      <div
        className={`${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll}  ${classes.maxh68}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5} ${classes.mt1}`}
          >
    
            {bankDetailsArray.map((row, index) => (
              <React.Fragment key={index}>
                {index !== 0 && (
                  <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                )}
                <>
                  <div
                    className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
                  >
                    <Typography
                      className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                      variant="h6"
                      display="inline"
                    >
                      {index === 0 && <div>Bank Details</div>}
                    </Typography>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Bank Name{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleBankDetailsArrayRowChange(
                            index,
                            "bank_name",
                            e.target.value
                          )
                        }
                        value={row.bank_name}
                        name="category_name"
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Type Here"
                      />
                    </div>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Branch*
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleBankDetailsArrayRowChange(
                            index,
                            "branch",
                            e.target.value
                          )
                        }
                        value={row.branch}
                        name="category_name"
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Type Here"
                      />
                    </div>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        Bank Account Number
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleBankDetailsArrayRowChange(
                            index,
                            "bank_account_number",
                            e.target.value
                          )
                        }
                        value={row.bank_account_number}
                        name="category_name"
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Type Here"
                      />
                    </div>
                  </div>
                  <div
                    className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
                  >
                    <Typography
                      className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                      variant="h6"
                      display="inline"
                    ></Typography>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    >
                      <FormLabel
                        className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                      >
                        IFSC Code{" "}
                        <span className={classes.textcolorred}>*</span>
                      </FormLabel>
                      <TextField
                        onChange={(e) =>
                          handleBankDetailsArrayRowChange(
                            index,
                            "ifsc_code",
                            e.target.value
                          )
                        }
                        value={row.ifsc_code}
                        name="category_name"
                        type="text"
                        variant="outlined"
                        required
                        placeholder="Type Here"
                      />
                    </div>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    ></div>

                    <div
                      className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                    ></div>
                  </div>
                </>
              </React.Fragment>
            ))}
            {bankDetailsArray.length && (
              <div className={`${classes.dflex} ${classes.justifyflexend}`}>
                <AddMoreAndRemoveButton
                  handleAdd={handleAddBankDetailsArrayRow}
                  handleRemove={handleRemoveBankDetailsArray}
                  data={bankDetailsArray}
                />
              </div>
            )}
          </div>
          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
          >
            {/* <Button
              className={`${classes.custombtnoutline}`}
              // onClick={handleClose}
            >
              Back
            </Button> */}
            <Button
              className={`${classes.custombtnblue}`}
              onClick={handleFormSubmit}
            >
              Next
            </Button>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default BankDetail;
