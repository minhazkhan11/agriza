import React, { useRef, useState } from "react";
import useStyles from "../../../styles";
import Paella from "../../images/paella.jpg";
import { ReactComponent as EditIcon } from "../../images/edit.svg";
import {
  Button,
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";

function CheckoutProductCard({ data, index, onRemove }) {
  const classes = useStyles();
  const quantityRef = useRef(null);

  const [quantity, setQuantity] = useState(data.quantity || 0);
  const [unit, setUnit] = useState(data?.unit);

  const [value, setValue] = useState("");
  const [discountType, setDiscountType] = useState("%");
  const [discountValue, setDiscountValue] = useState("");

  const [calculatedDiscount, setCalculatedDiscount] = useState("");

  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState({
    value: "",
    type: "",
  });

  const [offerPrice, setOfferPrice] = useState("");
  const [isOfferApplied, setIsOfferApplied] = useState(false);

  const priceWithGST = isOfferApplied
    ? parseFloat(offerPrice)
    : isDiscountApplied
    ? parseFloat(data.price - calculatedDiscount)
    : parseFloat(data.price);
  const gstRate = parseFloat(data.gst);

  const basePrice = (priceWithGST / (1 + gstRate / 100)).toFixed(2);
  const gstAmount = (priceWithGST - basePrice).toFixed(2);

  const handleAddDiscount = () => {
    // Optional: Add validation before saving
    if (!discountValue) return;
    const discount = {
      value: discountValue,
      type: discountType,
    };
    setAppliedDiscount(discount);

    setIsDiscountApplied(true); // Hide the input fields

    updateLocalStorage(
      discount,
      quantity,
      unit,
      data?.id,
      false,
      true,
      "discount"
    );
  };

  const handleApplyOfferPrice = () => {
    if (!offerPrice) return;
    setIsOfferApplied(true);
    updateLocalStorage(
      offerPrice,
      quantity,
      unit,
      data?.id,
      true,
      false,
      "offerprice"
    );
  };

  const updateLocalStorage = (
    value,
    qty,
    selectedUnit,
    productId,
    isOffer,
    isDiscount,
    discountTypeSelected = value,
    customFinalPrice = null
  ) => {
    let cartData = JSON.parse(localStorage.getItem("cartstate")) || [];
    // Determine final price based on discount or offer
    const basePrice = data.primary_unit_price;
    let finalPrice = customFinalPrice ?? basePrice;
    let offer = "";

    if (!customFinalPrice) {
      if (discountTypeSelected === "offerprice" && isOffer && offerPrice) {
        finalPrice = parseFloat(offerPrice);
        offer = parseFloat(offerPrice);
      } else if (discountTypeSelected === "discount" && isDiscount) {
        console.log("finalPrice1234", finalPrice);
        finalPrice = parseFloat(data.primary_unit_price - calculatedDiscount);
      }
    }

    let unitPrice = basePrice;

    if (selectedUnit === data.primary_unit) {
      unitPrice = (basePrice / (data.primary_quantity || 1)).toFixed(2);
    } else if (selectedUnit === data.secondary_unit) {
      unitPrice = (basePrice / (data.secondary_quantity || 1)).toFixed(2);
    } else if (selectedUnit === data.covering_unit) {
      unitPrice = (basePrice / (data.covering_quantity || 1)).toFixed(2);
    }

    const newItem = {
      id: data?.id,
      sku: data?.sku,
      name: data.name,
      price: unitPrice,
      primary_unit_price: data.primary_unit_price,
      finalPrice,
      quantity: qty,
      unit: selectedUnit,
      product_image: data?.product_image,
      gstname: data.gstname,
      gst: data.gst,
      discount: value?.value,
      discount_type: value?.type,
      offer: offer,
      offer_type: discountTypeSelected,
      primary_unit: data?.primary_unit || null,
      secondary_unit: data?.secondary_unit || null,
      covering_unit: data?.covering_unit || null,

      primary_quantity: data?.primary_quantity || null,
      secondary_quantity: data?.secondary_quantity || null,
      covering_quantity: data?.covering_quantity || null,
    };

    // Update cart data
    const existingIndex = cartData.findIndex((item) => item.id === productId);
    if (existingIndex !== -1) {
      cartData[existingIndex] = newItem;
    } else {
      cartData.push(newItem);
    }

    // Store the updated cart data in localStorage
    const serialized = JSON.stringify(cartData);
    localStorage.setItem("cartstate", serialized);
    sessionStorage.setItem("cartstate", serialized);
    window.dispatchEvent(new Event("cartstateChanged"));
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
      <div
        key={index}
        className={`${classes.bgwhite} ${classes.p1} ${classes.mb1} ${classes.boxshadow4} ${classes.dflex} ${classes.justifyspacebetween} ${classes.flexdirectioncolumn} ${classes.positionrelative}`}
      >
        <div className={`${classes.dflex}`}>
          <div
            className={`${classes.crossbtn} ${classes.positionabsolute} ${classes.positionright} ${classes.positiontop}`}
          >
            <IconButton onClick={() => onRemove(index)}>
              <CancelRoundedIcon />
            </IconButton>
          </div>
          <div>
            <img
              src={data?.product_image || Paella}
              alt="img"
              className={`${classes.checkoutimage}`}
            />
          </div>

          <div className={`${classes.w60}`}>
            <Typography
              className={classes.mb0_5}
              variant="body2"
              color="textSecondary"
            >
              {data?.sku}
            </Typography>
            <Typography
              className={`${classes.fw600} ${classes.fontFamilyJost} ${classes.fontsize6}`}
              variant="body2"
            >
              {data.name}
            </Typography>

            <Typography
              className={`${classes.fw600} ${classes.fontFamilyJost}`}
              variant="body2"
            >
              <span className={`${classes.textcolor7676}`}>
                Selling Price :
              </span>{" "}
              {isOfferApplied || isDiscountApplied ? (
                <span
                  className={`${classes.textcolor7676} ${classes.mr0_5} ${classes.textdecorationline}`}
                >
                  ₹{data.price}
                </span>
              ) : (
                <>
                  ₹{data.price} {data.unitPrice}
                </>
              )}
              {isOfferApplied &&
                !isNaN(offerPrice) &&
                `₹${Number(offerPrice).toFixed(2)}`}
              {isDiscountApplied &&
                !isNaN(data.price - calculatedDiscount) &&
                `₹${Number(data.price - calculatedDiscount).toFixed(2)}`}
            </Typography>
            <Typography
              className={`${classes.fw600} ${classes.fontFamilyJost}`}
              variant="body2"
            >
              <span className={`${classes.textcolor7676}`}>Quantity :</span>{" "}
              {quantity}
            </Typography>
            <Typography
              className={`${classes.fw600} ${classes.fontFamilyJost}`}
              variant="body2"
            >
              <span className={`${classes.textcolor7676}`}>
                {data.gstname} Incl :
              </span>{" "}
              ₹{gstAmount} ({data.gst}%)
            </Typography>
          </div>
          <div className={`${classes.w40} ${classes.mt3}`}>
            <div className={`${classes.dflex} ${classes.justifyflexend}`}>
              <Typography
                className={classes.mb0_5}
                variant="body2"
                color="textSecondary"
              >
                Total Amount with GST :
              </Typography>

              <Typography
                className={`${classes.fw600} ${classes.fontFamilyJost}`}
                variant="body2"
              >
                ₹{(priceWithGST * quantity).toFixed(2)}
              </Typography>
            </div>
            <div
              className={`${classes.w100} ${classes.dflex} ${classes.justifyspacebetween}`}
            >
              <TextField
                inputRef={quantityRef}
                value={quantity}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^\d]/g, "");
                  setQuantity(val);
                  updateLocalStorage(
                    appliedDiscount,
                    val,
                    unit,
                    data?.id,
                    isOfferApplied,
                    isDiscountApplied,
                    value,
                    parseFloat(data.price)
                  );
                }}
                className={`${classes.w56} ${classes.justifyflexend}`}
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
                placeholder="Type Here"
              />
              <Select
                labelId="category-label"
                id="unit"
                value={unit}
                // onChange={handleUnitChange}
                onChange={(e) => {
                  const val = e.target.value;
                  setUnit(val);
                  updateLocalStorage(
                    appliedDiscount,
                    quantity,
                    val,
                    data?.id,
                    isOfferApplied,
                    isDiscountApplied,
                    value,
                    parseFloat(data.price)
                  );
                }}
                required
                displayEmpty
                className={`${classes.selectEmpty} ${classes.w40}`}
                MenuProps={menuProps}
                variant="outlined"
              >
                {data?.primary_unit && (
                  <MenuItem value={data.primary_unit}>
                    {data.primary_unit}
                  </MenuItem>
                )}
                {data?.secondary_unit && (
                  <MenuItem value={data.secondary_unit}>
                    {data.secondary_unit}
                  </MenuItem>
                )}
                {data?.covering_unit && (
                  <MenuItem value={data.covering_unit}>
                    {data.covering_unit}
                  </MenuItem>
                )}
              </Select>
            </div>
          </div>
        </div>
        {!isDiscountApplied && !isOfferApplied && (
          <div className={``}>
            <RadioGroup
              className={`${classes.radiocolor} ${classes.dflex}`}
              row
              aria-label="is Business"
              name="is Business"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setDiscountValue("");
                setOfferPrice("");
                updateLocalStorage(
                  null,
                  quantity,
                  unit,
                  data?.id,
                  isOfferApplied,
                  isDiscountApplied,
                  e.target.value,
                  parseFloat(data.price)
                );
              }}
            >
              <FormControlLabel
                value="discount"
                control={<Radio />}
                label="Discount"
              />
              <FormControlLabel
                value="offerprice"
                control={<Radio />}
                label="Offer Price"
              />
            </RadioGroup>
          </div>
        )}
        {value === "discount" && !isDiscountApplied && (
          <div
            className={`${classes.w50} ${classes.dflex} ${classes.alignitemscenter}`}
          >
            <TextField
              variant="outlined"
              className={`${classes.w49} ${classes.justifyflexend}`}
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
              placeholder="Enter Discount"
              value={discountValue}
              onChange={(e) => {
                const inputValue = e.target.value;
                setDiscountValue(inputValue);

                if (discountType === "%" && !isNaN(inputValue) && data?.price) {
                  const percentage = parseFloat(inputValue);
                  const calculated = (Number(data.price) * percentage) / 100;
                  setCalculatedDiscount(calculated.toFixed(2));
                } else {
                  setCalculatedDiscount(inputValue);
                }
              }}
              // onChange={(e) => setDiscountValue(e.target.value)}
              // value={
              //   currentDiscount.discountType === "amount"
              //     ? currentDiscount.discountPrice
              //     : currentDiscount.discountPercent
              // }
              // onChange={(e) =>
              //   setCurrentDiscount({
              //     ...currentDiscount,
              //     ...(currentDiscount.discountType === "amount"
              //       ? { discountPrice: e.target.value }
              //       : { discountPercent: e.target.value }),
              //   })
              // }
            />

            <Select
              labelId="category-label"
              id="unit"
              // value="%"
              value={discountType}
              onChange={(e) => {
                setDiscountType(e.target.value);
                setDiscountValue("");
              }}
              // value={currentDiscount.discountType}
              // onChange={(e) =>
              //   setCurrentDiscount({
              //     ...currentDiscount,
              //     discountType: e.target.value,
              //     discountPrice: "",
              //     discountPercent: "",
              //   })
              // }
              required
              displayEmpty
              className={`${classes.selectEmpty} ${classes.w20} ${classes.ml0_5}`}
              MenuProps={menuProps}
              variant="outlined"
            >
              <MenuItem value="%">%</MenuItem>
              <MenuItem value="₹">₹</MenuItem>
            </Select>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddDiscount}
              className={`${classes.Applytransparentbtn} ${classes.ml0_5}`}
            >
              Apply
            </Button>
          </div>
        )}
        {value === "discount" && isDiscountApplied && (
          <div
            className={`${classes.w50} ${classes.dflex} ${classes.alignitemscenter}`}
          >
            <span className={classes.appliedDiscountText}>
              Applied Discount : ₹{calculatedDiscount}
            </span>
            <IconButton
              variant="text"
              color="primary"
              onClick={() => {
                setIsDiscountApplied(false);
                setAppliedDiscount({
                  value: "",
                  type: "",
                });
                const finalPrice = parseFloat(data.price);
                updateLocalStorage(
                  null,
                  quantity,
                  unit,
                  data?.id,
                  isOfferApplied,
                  isDiscountApplied,
                  "discount",
                  parseFloat(data.price)
                );
              }}
            >
              <EditIcon />
            </IconButton>
          </div>
        )}
        {value === "offerprice" && !isOfferApplied && (
          <div
            className={`${classes.w50} ${classes.dflex} ${classes.alignitemscenter}`}
          >
            <TextField
              variant="outlined"
              className={`${classes.w49} ${classes.justifyflexend}`}
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
              placeholder="Enter Offer Price"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              // value={
              //   currentDiscount.discountType === "amount"
              //     ? currentDiscount.discountPrice
              //     : currentDiscount.discountPercent
              // }
              // onChange={(e) =>
              //   setCurrentDiscount({
              //     ...currentDiscount,
              //     ...(currentDiscount.discountType === "amount"
              //       ? { discountPrice: e.target.value }
              //       : { discountPercent: e.target.value }),
              //   })
              // }
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleApplyOfferPrice}
              className={`${classes.Applytransparentbtn} ${classes.ml0_5}`}
            >
              Apply
            </Button>
          </div>
        )}

        {value === "offerprice" && isOfferApplied && (
          <div
            className={`${classes.w50} ${classes.dflex} ${classes.alignitemscenter}`}
          >
            <span className={classes.appliedDiscountText}>
              Offer Price: ₹{offerPrice}
            </span>
            <IconButton
              variant="text"
              color="primary"
              className={classes.ml0_5}
              onClick={() => {
                setIsOfferApplied(false);
                setOfferPrice("");
                const finalPrice = parseFloat(data.price);
                updateLocalStorage(
                  null,
                  quantity,
                  unit,
                  data?.id,
                  false,
                  false,
                  "offerprice",
                  finalPrice
                );
              }}
            >
              <EditIcon />
            </IconButton>
          </div>
        )}
      </div>
    </>
  );
}
export default CheckoutProductCard;
