import React, { useState } from "react";
import PageHeader from "../../../PageHeader";
import useStyles from "../../../../../styles";
import { decryptData } from "../../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";
import PriceUpdateForm from "./PriceUpdateForm";

function PriceUpdate({ handlePricePopUp, rowId, fetchData }) {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  const [crossPriceError, setCrossPriceError] = useState("");

  const [formValues, setFormValues] = useState({
    item_variants_id: rowId,
    mrp: "",
    selling_price: "",
    selling_price_percent: "",
    cross_price: "",
    cross_price_percent: "",
    for_mrp: "",
    for_selling_price: "",
    for_selling_price_percent: "",
    for_cross_price: "",
    for_cross_price_percent: "",
    delivery_ex: true,
    delivery_for: false,
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

  console.log("handlePricePopUp", rowId);

  const handleFormSubmit = () => {
    const data = {
      item_variant_price: {
        item_variants_id: rowId,
        mrp: formValues.mrp,
        selling_price: formValues.selling_price,
        selling_price_percent: formValues.selling_price_percent,
        cross_price: formValues.cross_price,
        cross_price_percent: formValues.cross_price_percent,
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/item_variants/item_variant_price`,
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
          navigate(`/variant-list`);
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
