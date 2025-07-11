import React, { useState } from "react";
import PageHeader from "../../../PageHeader";
import useStyles from "../../../../../styles";
import { decryptData } from "../../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";
import PriceUpdateForm from "./PriceUpdateForm";

function PriceUpdate({ handlePricePopUp, rowId, popupState, fetchData }) {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  console.log("popupState", popupState);

  const [crossPriceError, setCrossPriceError] = useState("");

  const [formValues, setFormValues] = useState({
    item_variants_id: rowId,
    ex_mrp: "",
    ex_selling_price: "",
    ex_selling_price_percent: "",
    ex_cross_price: "",
    ex_cross_price_percent: "",
    for_mrp: "",
    for_selling_price: "",
    for_selling_price_percent: "",
    for_cross_price: "",
    for_cross_price_percent: "",
    delivery_ex: popupState.ex,
    delivery_for: popupState.for,
    effective_date:""
  });

  const Heading = [
    {
      id: 1,
      // pageicon: <Dashboard />,
      mainheading: "Item Variant Price Update",
      // addmultitext: "Add Row",
      // addmultiicon: <AddIcon />,
      // addmultistyle: "bluebtn",
      // onClick: handleAddLink,
    },
  ];

  console.log("handlePricePopUp",popupState, popupState.ex,popupState.for);

  const handleFormSubmit = () => {
    const data = {
      item_variants_id: rowId,
      ex: popupState.ex,
      for: popupState.for,
      ex_mrp: formValues?.ex_mrp || "",
      ex_selling_price: formValues?.ex_selling_price || "",
      ex_selling_price_percent: formValues?.ex_selling_price_percent || "",
      ex_cross_price: formValues?.ex_cross_price || "",
      ex_cross_price_percent: formValues?.ex_cross_price_percent || "",
      for_mrp: formValues?.for_mrp || "",
      for_selling_price: formValues?.for_selling_price || "",
      for_selling_price_percent: formValues?.for_selling_price_percent || "",
      for_cross_price: formValues?.for_cross_price || "",
      for_cross_price_percent: formValues?.for_cross_price_percent || "",
      effective_date: formValues?.effective_date || "",
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/item_variants/update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Item Variants Price Updated Successfully");
        setTimeout(() => {
          handlePricePopUp();
          navigate(`/item-price-list`);
          fetchData();
        }, 2000);
      })
      .catch((error) => {
        toast.error("Error: " + error);
      });
  };

  return (
    <div
      className={`${classes.bgwhite} ${classes.p2} ${classes.w50} ${classes.pb0} ${classes.pt1}`}
    >
      <PageHeader Heading={Heading} />

      <div
        className={`${classes.w100} ${classes.bgwhite} ${classes.mt1} ${classes.borderradius6px}`}
      >
        <PriceUpdateForm
          formValues={formValues}
          crossPriceError={crossPriceError}
          setFormValues={setFormValues}
          setCrossPriceError={setCrossPriceError}
        />
        <div
          className={`${classes.w100} ${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
        >
          <Button
            onClick={handlePricePopUp}
            className={`${classes.transparentbtn} ${classes.mr1} ${classes.my0_5}`}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={`${classes.bluebtn} ${classes.my0_5}`}
            onClick={handleFormSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
export default PriceUpdate;
