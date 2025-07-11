import React, { useRef, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import useCustomStyles from "../../../../styles";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import Paella from "../../../images/paella.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "23%",
    "& .MuiCardContent-root": {
      padding: "0 16px",
    },
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
}));

export default function ProductCardVendor({ data, userData }) {
  const classes = useStyles();
  const customclasses = useCustomStyles();
  const quantityRef = useRef(null);
  const quantityUnitWrapperRef = useRef(null);



  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState(data?.primary_unit_id?.unit_name);

  // Store product to localStorage
  const updateLocalStorage = (qty, selectedUnit, productId) => {
    let cartData = JSON.parse(localStorage.getItem("cartstate"));

    if (!Array.isArray(cartData)) {
      cartData = [];
    }

    const isZero = !qty || qty === "0" || Number(qty) === 0;

    if (isZero) {
      // Remove the item if it exists and qty is 0
      cartData = cartData.filter((item) => item.id !== productId);

      // If no items remain, clear the cart
      if (cartData.length === 0) {
        localStorage.removeItem("cartstate");
        sessionStorage.removeItem("cartstate");
        localStorage.removeItem("customerDetails");
        sessionStorage.removeItem("customerDetails");
        sessionStorage.removeItem("checkoutData");
        sessionStorage.removeItem("discounts");
        sessionStorage.removeItem("charges");
        sessionStorage.removeItem("finalTotalAmount");
        localStorage.removeItem("finalTotalAmount");
      } else {
        localStorage.setItem("cartstate", JSON.stringify(cartData));
        sessionStorage.setItem("cartstate", JSON.stringify(cartData));
      }

      window.dispatchEvent(new Event("cartstateChanged"));
      return;
    }

    let unitPrice = data?.selling_price;

    if (selectedUnit === data?.primary_unit_id?.unit_name) {
      unitPrice = (data?.selling_price / (data?.primary_quantity || 1)).toFixed(
        2
      );
    } else if (selectedUnit === data?.secondary_unit_id?.unit_name) {
      unitPrice = (
        data?.selling_price / (data?.secondary_quantity || 1)
      ).toFixed(2);
    } else if (selectedUnit === data?.covering_unit_id?.unit_name) {
      unitPrice = (
        data?.selling_price / (data?.covering_quantity || 1)
      ).toFixed(2);
    }

    const newItem = {
      id: data?.id,
      sku: data?.item_variant_stock?.sku_code,
      name: data?.variant_name,
      price: 0,
      finalPrice: 0,
      product_image: data?.product_image,
      quantity: qty,
      unit: selectedUnit,
      primary_unit: data?.primary_unit_id?.unit_name || null,
      secondary_unit: data?.secondary_unit_id?.unit_name || null,
      covering_unit: data?.covering_unit_id?.unit_name || null,

      primary_quantity: data?.primary_quantity || null,
      secondary_quantity: data?.secondary_quantity || null,
      covering_quantity: data?.covering_quantity || null,

      image: data?.image_url,
      gstname: data?.gst_name,
      gst: data?.gst_percent,
    };

    const existingIndex = cartData.findIndex((item) => item.id === productId);

    if (existingIndex !== -1) {
      cartData[existingIndex] = newItem;
    } else {
      cartData.push(newItem);
    }

    localStorage.setItem("cartstate", JSON.stringify(cartData));
    sessionStorage.setItem("cartstate", JSON.stringify(cartData));
    localStorage.setItem("customerDetails", JSON.stringify(userData.rowData));
    sessionStorage.setItem("customerDetails", JSON.stringify(userData.rowData));
    sessionStorage.setItem("userData", JSON.stringify(userData));
    window.dispatchEvent(new Event("cartstateChanged"));
  };

  const handleAddToCart = () => {
    setAddedToCart(true);
    // setTimeout(() => {
    //   quantityRef.current?.focus();
    //   quantityRef.current?.select();
    // }, 100);
  };

  const handleQuantityChange = (event) => {
    const value = event.target.value;
    setQuantity(value);
    updateLocalStorage(value, unit);
  };

  const handleUnitChange = (event) => {
    const value = event.target.value;
    setUnit(value);
    updateLocalStorage(value, unit);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        quantityUnitWrapperRef.current &&
        !quantityUnitWrapperRef.current.contains(event.target)
      ) {
        if (
          quantityRef.current &&
          (quantityRef.current.value === "" ||
            quantityRef.current.value === "0" ||
            Number(quantityRef.current.value) === 0)
        ) {
          setAddedToCart(false);
          updateLocalStorage("", unit, data?.id);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [quantity, unit, data?.id]);

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image={data?.product_image || Paella}
        title={data?.variant_name}
      />
      <CardContent>
        <Typography
          className={customclasses.mb0_5}
          variant="body2"
          color="textSecondary"
        >
          {data?.item_variant_stock?.sku_code}
        </Typography>
        <Typography className={customclasses.fw600} variant="body2">
          {data?.variant_name}
        </Typography>
      
      </CardContent>
      <CardActions disableSpacing>
        {!addedToCart ? (
          <Button
            className={`${customclasses.bluebtn} ${customclasses.w100}`}
            onClick={handleAddToCart}
          >
            Add To Cart
          </Button>
        ) : (
          <div
            ref={quantityUnitWrapperRef}
            className={`${customclasses.w100} ${customclasses.dflex} ${customclasses.justifyspacebetween}`}
          >
            <TextField
              inputRef={quantityRef}
              value={quantity}
              onChange={(e) => {
                const val = e.target.value.replace(/[^\d]/g, "");
                setQuantity(val);
                updateLocalStorage(val, unit, data?.id);
              }}
              onBlur={(e) => {
                setTimeout(() => {
                  if (
                    quantityRef.current &&
                    (quantityRef.current.value === "" ||
                      quantityRef.current.value === "0" ||
                      Number(quantityRef.current.value) === 0)
                  ) {
                    setAddedToCart(false);
                    updateLocalStorage("", unit, data?.id); // remove item from cart
                  }
                }, 200); // slight delay to allow select open
              }}
              className={`${customclasses.w56} ${customclasses.justifyflexend}`}
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
                // Prevent unit update if quantity is empty or zero
                setUnit(val);
                if (
                  quantity === "" ||
                  quantity === "0" ||
                  Number(quantity) === 0
                ) {
                  return;
                }

                updateLocalStorage(quantity, val, data?.id);
              }}
              required
              displayEmpty
              className={`${customclasses.selectEmpty} ${customclasses.w40}`}
              MenuProps={menuProps}
              variant="outlined"
            >
              {data?.primary_unit_id && (
                <MenuItem value={data.primary_unit_id.unit_name}>
                  {data.primary_unit_id.unit_name}
                </MenuItem>
              )}
              {data?.secondary_unit_id && (
                <MenuItem value={data.secondary_unit_id.unit_name}>
                  {data.secondary_unit_id.unit_name}
                </MenuItem>
              )}
              {data?.covering_unit_id && (
                <MenuItem value={data.covering_unit_id.unit_name}>
                  {data.covering_unit_id.unit_name}
                </MenuItem>
              )}
            </Select>
          </div>
        )}
      </CardActions>
    </Card>
  );
}
