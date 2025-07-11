import React, { useEffect, useState } from "react";
import useStyles from "../../../../styles";
import ProductCard from "./ProductCard";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import {
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import ProductCardVendor from "./ProductCardVendor";

export const Product = ({ cartData, deliveryType, setDeliveryType }) => {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [products, setProducts] = useState([]);

  const fetchCustomerData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/item_variants`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setProducts(response.data.item_variants);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const fetchVendorData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/assigned_item_variant_to_vendor/be_id/${cartData.rowData.id}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setProducts(response.data.item_variants);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    cartData.type === "vendor" ? fetchVendorData() : fetchCustomerData();
  }, [cartData.rowData.id]);

  const transformProductByDeliveryType = (product, deliveryType) => {
    const prefix = `${deliveryType}_`; // e.g., "ex_"
    return {
      ...product, // include all original keys
      mrp: product[`${prefix}mrp`],
      selling_price: product[`${prefix}selling_price`],
      selling_price_percent: product[`${prefix}selling_price_percent`],
      cross_price: product[`${prefix}cross_price`],
      cross_price_percent: product[`${prefix}cross_price_percent`],
    };
  };

  const filteredAndMappedProducts = deliveryType
    ? products
        .filter((product) => product[deliveryType]) // e.g., product["ex"] === true
        .map((product) => transformProductByDeliveryType(product, deliveryType))
    : products;

  console.log("filteredAndMappedProducts", filteredAndMappedProducts, products);

  return (
    <>
      {" "}
      {cartData.type === "vendor" ? (
        <div
          className={`${classes.p2} ${classes.dflex} ${classes.flexwrapwrap} ${classes.gap30px}`}
        >
          {filteredAndMappedProducts?.map((data, index) => {
            return (
              <ProductCardVendor
                key={data.id || index}
                data={data}
                userData={cartData}
              />
            );
          })}
        </div>
      ) : (
        <div
          className={`${classes.p2} ${classes.dflex} ${classes.flexwrapwrap} ${classes.gap30px}`}
        >
          {filteredAndMappedProducts?.map((data, index) => {
            return (
              <ProductCard
                key={data.id || index}
                data={data}
                  userData={cartData}
                rowData={cartData.rowData}
              />
            );
          })}
        </div>
      )}
    </>
  );
};
