import React, { useEffect, useState } from "react";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import useStyles from "../../../styles";
import {
  Button,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { toast } from "react-toastify";
import useCartLive from "../../Menu/useCartLive";

function CheckoutOrderSummary() {
  const classes = useStyles();
  const cartItems = useCartLive();

  const userData = JSON.parse(sessionStorage.getItem("userData"));

  const [currentDiscount, setCurrentDiscount] = useState({
    discountName: "",
    discountPercent: "",
    discountPrice: "",
    discountType: "amount",
  });
  const [discount, setDiscount] = useState([]);

  const [currentCharges, setCurrentCharges] = useState({
    chargesName: "",
    chargesPrice: "",
  });
  const [charges, setCharges] = useState([]);

  const updateLocalAndSessionStorage = (totalAmount) => {
    // Save to sessionStorage
    sessionStorage.setItem("finalTotalAmount", totalAmount);

    // Save to localStorage
    localStorage.setItem("finalTotalAmount", totalAmount);
  };

  const updateSessionStorage = (newDiscounts, newCharges) => {
    // Get existing data from sessionStorage
    const existingData =
      JSON.parse(sessionStorage.getItem("checkoutData")) || {};

    // Merge with new data
    const updatedData = {
      ...existingData,
      discounts: newDiscounts ?? existingData.discounts ?? [],
      charges: newCharges ?? existingData.charges ?? [],
    };

    // Save back to sessionStorage
    sessionStorage.setItem("checkoutData", JSON.stringify(updatedData));
  };

  const handleAddDiscount = () => {
    const { discountName, discountPercent, discountPrice, discountType } =
      currentDiscount;

    // Trim the name to avoid whitespace-only names
    if (!discountName.trim()) {
      toast.warn("Please enter a valid discount name.");
      return;
    }

    // Validate based on discount type
    if (discountType === "percent") {
      if (!discountPercent || isNaN(discountPercent)) {
        toast.warn("Please enter a valid numeric discount percent.");
        return;
      }
      if (Number(discountPercent) <= 0 || Number(discountPercent) > 100) {
        toast.warn("Discount percent must be between 1 and 100.");
        return;
      }
    } else if (discountType === "amount") {
      if (!discountPrice || isNaN(discountPrice)) {
        toast.warn("Please enter a valid numeric discount amount.");
        return;
      }
    } else {
      toast.warn("Invalid discount type selected.");
      return;
    }

    if (
      discountName &&
      ((discountType === "percent" && discountPercent) ||
        (discountType === "amount" && discountPrice)) &&
      discount.length < 5
    ) {
      const newDiscounts = [...discount, currentDiscount];
      setDiscount(newDiscounts);
      // sessionStorage.setItem("discounts", JSON.stringify(newDiscounts));
      updateSessionStorage(newDiscounts, null);

      // Reset based on type
      if (discountType === "percent") {
        setCurrentDiscount({
          discountName: "",
          discountPercent: "",
          discountPrice: "", // still reset this too, to clear any leftover input
          discountType: "amount",
        });
      } else if (discountType === "amount") {
        setCurrentDiscount({
          discountName: "",
          discountPercent: "",
          discountPrice: "",
          discountType: "amount",
        });
      } else {
        // fallback reset
        setCurrentDiscount({
          discountName: "",
          discountPercent: "",
          discountPrice: "",
          discountType: "amount",
        });
      }
    }
  };

  const handleDeleteDiscount = (index) => {
    const updatedDiscounts = discount.filter((_, i) => i !== index);
    setDiscount(updatedDiscounts);
    // sessionStorage.setItem("discounts", JSON.stringify(updatedDiscounts));
    updateSessionStorage(updatedDiscounts, null);
  };

  const handleAddCharges = () => {
    const { chargesName, chargesPrice } = currentCharges;
    // Validation checks
    if (!chargesName.trim()) {
      toast.warn("Please enter a valid charge name.");
      return;
    }

    if (!chargesPrice || isNaN(chargesPrice)) {
      toast.warn("Please enter a valid numeric charge price.");
      return;
    }

    const newCharges = [...charges, currentCharges];

    setCharges([...charges, currentCharges]);

    // sessionStorage.setItem("charges", JSON.stringify(newCharges));

    updateSessionStorage(null, newCharges);

    setCurrentCharges({
      chargesName: "",
      chargesPrice: "",
    });
  };

  const handleDeleteCharges = (index) => {
    const updatedCharges = charges.filter((_, i) => i !== index);
    setCharges(updatedCharges);
    // sessionStorage.setItem("charges", JSON.stringify(updatedCharges));
    updateSessionStorage(null, updatedCharges);
  };

  const totalChargesAmount = charges.reduce((total, charge) => {
    const price = parseFloat(charge.chargesPrice);
    return total + (isNaN(price) ? 0 : price);
  }, 0);

  const orderAmountWithoutGST = cartItems?.reduce((total, item) => {
    const itemPrice = parseFloat(item.finalPrice);
    const itemQuantity = parseInt(item.quantity);
    const gstPercent = parseFloat(item.gst);

    // Calculate base price (without GST)
    const priceExcludingGST = itemPrice / (1 + gstPercent / 100);

    return total + priceExcludingGST * itemQuantity;
  }, 0);

  const totalAmount =
    cartItems?.reduce((total, item) => {
      const price = parseFloat(item.finalPrice);
      const quantity = parseInt(item.quantity);
      return total + price * quantity;
    }, 0) + totalChargesAmount;

  const totalDiscountAmount = discount.reduce((total, d) => {
    if (d.discountType === "percent") {
      const percent = parseFloat(d.discountPercent);
      return (
        total + ((isNaN(percent) ? 0 : percent) / 100) * orderAmountWithoutGST
      );
    } else {
      const price = parseFloat(d.discountPrice);
      return total + (isNaN(price) ? 0 : price);
    }
  }, 0);

  // const totalGSTAmount = cartItems?.reduce((total, item) => {
  //   const price = parseFloat(item.finalPrice);
  //   const quantity = parseInt(item.quantity);
  //   const gst = parseFloat(item.gst);

  //   const basePrice = price / (1 + gst / 100);
  //   const gstAmountPerItem = price - basePrice;

  //   return total + gstAmountPerItem * quantity;
  // }, 0);

  const totalGSTAmount = cartItems?.reduce((total, item) => {
    const priceWithGst = parseFloat(item.finalPrice); // price per unit including GST
    const quantity = parseInt(item.quantity);
    const gstPercent = parseFloat(item.gst);

    // Calculate base price (price without GST) for each item
    const basePrice = priceWithGst / (1 + gstPercent / 100);

    // Total price for this item excluding GST
    const totalItemPriceWithoutGst = basePrice * quantity;

    // Proportional discount for this item based on total quantity (discount applied to price without GST)
    const totalCartQuantity = cartItems.reduce(
      (sum, ci) => sum + parseInt(ci.quantity),
      0
    );
    const discountForThisItem =
      (totalDiscountAmount * totalItemPriceWithoutGst) /
      (totalCartQuantity * basePrice);

    const discountedTotalPriceWithoutGst =
      totalItemPriceWithoutGst - discountForThisItem;

    const discountedTotalPriceWithGst =
      discountedTotalPriceWithoutGst * (1 + gstPercent / 100);

    const gstAmountForThisItem =
      discountedTotalPriceWithGst - discountedTotalPriceWithoutGst;

    return total + gstAmountForThisItem;
  }, 0);

  const finalWithoutGstAmount = orderAmountWithoutGST - totalDiscountAmount;
  const finalTotalAmount = totalAmount - totalDiscountAmount;

  useEffect(() => {
    const savedData = JSON.parse(sessionStorage.getItem("checkoutData"));

    if (savedData) {
      if (Array.isArray(savedData.discounts)) {
        setDiscount(savedData.discounts);
      }

      if (Array.isArray(savedData.charges)) {
        setCharges(savedData.charges);
      }
    }
  }, []);

  const formatINR = (amount) =>
    `₹${amount?.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  useEffect(() => {
    updateLocalAndSessionStorage(finalTotalAmount);
  }, [finalTotalAmount]);

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };
  return (
    <div className={`${classes.p1} ${classes.w100} ${classes.bgwhite} ${classes.boxshadow4}`}>
      <Typography
        className={`${classes.fw600} ${classes.fontFamilyJost}`}
        variant="h5"
      >
        Order Summary
      </Typography>
      {userData?.type != "vendor" && (
        <>
          <Typography
            className={`${classes.dflex} ${classes.mt1} ${classes.justifyspacebetween} ${classes.fontFamilyJost}`}
            variant="body2"
          >
            <span>Order Amount Without GST :</span>{" "}
            <span className={`${classes.fw600} ${classes.fontFamilyJost}`}>
              {formatINR(finalWithoutGstAmount)}
            </span>
          </Typography>
          <div
            className={`${classes.dflex} ${classes.flexwrapwrap} ${classes.justifyspacebetween}`}
          >
            <Typography
              className={` ${classes.fontFamilyJost} ${classes.mt1}`}
              variant="body2"
            >
              Discount (Max 5 discount) - {formatINR(totalDiscountAmount)}
            </Typography>

            <TextField
              variant="outlined"
              className={`${classes.w100} ${classes.justifyflexend} ${classes.mt0_5}`}
              type="text"
              required
              placeholder="Enter Discount Name"
              value={currentDiscount.discountName}
              onChange={(e) =>
                setCurrentDiscount({
                  ...currentDiscount,
                  discountName: e.target.value,
                })
              }
            />

            <TextField
              variant="outlined"
              className={`${classes.w49} ${classes.justifyflexend} ${classes.mt0_5}`}
              type="text"
              inputProps={{ inputMode: "numeric" }}
              onKeyDown={(e) => {
                if (
                  e.key !== "Backspace" &&
                  e.key !== "Delete" &&
                  !/^\d$/.test(e.key)
                ) {
                  e.preventDefault();
                }
              }}
              required
              placeholder={
                currentDiscount.discountType === "amount"
                  ? "Enter Discount Price"
                  : "Enter Discount Percent"
              }
              value={
                currentDiscount.discountType === "amount"
                  ? currentDiscount.discountPrice
                  : currentDiscount.discountPercent
              }
              onChange={(e) =>
                setCurrentDiscount({
                  ...currentDiscount,
                  ...(currentDiscount.discountType === "amount"
                    ? { discountPrice: e.target.value }
                    : { discountPercent: e.target.value }),
                })
              }
            />

            <Select
              labelId="category-label"
              id="unit"
              value={currentDiscount.discountType}
              onChange={(e) =>
                setCurrentDiscount({
                  ...currentDiscount,
                  discountType: e.target.value,
                  discountPrice: "",
                  discountPercent: "",
                })
              }
              required
              displayEmpty
              className={`${classes.selectEmpty} ${classes.w47} ${classes.ml0_5} ${classes.mt0_5}`}
              MenuProps={menuProps}
              variant="outlined"
            >
              <MenuItem value="amount">Amount</MenuItem>
              <MenuItem value="percent">Percent</MenuItem>
            </Select>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddDiscount}
              className={`${classes.transparentbtn} ${classes.mt0_5} ${classes.m000auto}`}
            >
              Add
            </Button>
          </div>
          <div className={`${classes.mt1} ${classes.mb1}`}>
            {discount.map((d, index) => (
              <div
                className={`${classes.dflex} ${classes.dflex} ${classes.justifyspacebetween}`}
              >
                <Typography
                  key={index}
                  className={`${classes.mt0_5} ${classes.fw600}`}
                >
                  <span>
                    {index + 1}- {d.discountName}
                  </span>
                </Typography>
                <Typography
                  key={index}
                  className={`${classes.mt0_5} ${classes.fw600}`}
                >
                  <span>
                    {" "}
                    {d.discountPercent} {d.discountPrice}
                    {d.discountType === "percent" ? "%" : "₹"}
                  </span>
                </Typography>
                <IconButton
                  className={classes.p0}
                  onClick={() => handleDeleteDiscount(index)}
                >
                  <DeleteOutlineIcon color="error" />
                </IconButton>
              </div>
            ))}
          </div>
          <div
            className={`${classes.dflex} ${classes.flexwrapwrap} ${classes.justifyspacebetween}`}
          >
            <Typography
              className={` ${classes.fontFamilyJost}`}
              variant="body2"
            >
              Other charges (Max 5 charges) - {formatINR(totalChargesAmount)}
            </Typography>

            <div>
              <TextField
                variant="outlined"
                className={`${classes.w49} ${classes.justifyflexend} ${classes.mt0_5}`}
                type="text"
                required
                placeholder="Enter Name"
                value={currentCharges.chargesName}
                onChange={(e) =>
                  setCurrentCharges({
                    ...currentCharges,
                    chargesName: e.target.value,
                  })
                }
              />

              <TextField
                variant="outlined"
                className={`${classes.w47} ${classes.justifyflexend} ${classes.ml0_5} ${classes.mt0_5}`}
                type="text"
                inputProps={{ inputMode: "numeric" }}
                onKeyDown={(e) => {
                  if (
                    e.key !== "Backspace" &&
                    e.key !== "Delete" &&
                    !/^\d$/.test(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
                required
                placeholder="Enter Charges"
                value={currentCharges.chargesPrice}
                onChange={(e) =>
                  setCurrentCharges({
                    ...currentCharges,
                    chargesPrice: e.target.value,
                  })
                }
              />
            </div>

            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCharges}
              className={`${classes.transparentbtn} ${classes.mt0_5} ${classes.m000auto}`}
            >
              Add
            </Button>
          </div>
          {charges.map((d, index) => (
            <div
              className={`${classes.dflex} ${classes.dflex} ${classes.justifyspacebetween}`}
            >
              <Typography
                key={index}
                className={`${classes.mt0_5} ${classes.fw600}`}
              >
                <span>
                  {index + 1}- {d.chargesName}
                </span>
              </Typography>
              <Typography
                key={index}
                className={`${classes.mt0_5} ${classes.fw600}`}
              >
                <span>{d.chargesPrice}</span>
              </Typography>
              <IconButton
                className={classes.p0}
                onClick={() => handleDeleteCharges(index)}
              >
                <DeleteOutlineIcon color="error" />
              </IconButton>
            </div>
          ))}
          <Typography
            className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            variant="body2"
          >
            <span className={`${classes.fontFamilyJost}`}>GST Amount</span>{" "}
            <span className={`${classes.fw600}  ${classes.fontFamilyJost}`}>
              {formatINR(totalGSTAmount)}
            </span>
          </Typography>
        </>
      )}

      <Typography
        className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} ${classes.fontsize4}`}
        variant="body2"
      >
        <span className={`${classes.fw600} ${classes.fontFamilyJost}`}>
          Total Amount
        </span>{" "}
        <span className={`${classes.fw600}  ${classes.fontFamilyJost}`}>
          {formatINR(finalTotalAmount)}
        </span>
      </Typography>
    </div>
  );
}
export default CheckoutOrderSummary;
