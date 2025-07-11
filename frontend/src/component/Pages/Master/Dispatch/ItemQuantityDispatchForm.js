import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import useStyles from "../../../../styles";

import axios from "axios";
import { decryptData } from "../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";
import TableView from "../../../CustomComponent/TableView";

function ItemQuantityDispatchForm({
  rowId,
  setItemDispatch,
  itemDispatch,
  orderItems,
}) {
  const classes = useStyles();

  const [shipmentData, setShipmentData] = useState({});
  const [selectedRows, setSelectedRows] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  const rows = orderItems?.map((d) => ({
    id: d?.id ? d.id : "N/A",
    // customer_name: d?.variant ? d?.variant?.variant_name : "N/A",
    customer_name: d?.variant
      ? {
          variant_name: d.variant.variant_name || "N/A",
          unit: d.unit || "N/A",
          product_image: d.variant.product_image || "N/A",
          product_category: d.variant.product_category.category_name || "N/A",
        }
      : "N/A",
    unit: d?.variant ? d?.variant?.unit : "N/A",
    product_image: d?.variant ? d?.variant?.product_image : "N/A",
    quantity: d?.quantity ? parseInt(d.quantity) : "N/A",
  }));

  useEffect(() => {
    if (Object.keys(selectedRows).length > 0) {
      const item_order = rows
        .filter((row) => selectedRows[row.id])
        .map((row) => ({
          item_variants_id: row.id,
          dispatch_quantity: parseInt(shipmentData[row.id]) || "",
        }));

      setItemDispatch(item_order); // << this updates parent state (props)
    }
  }, [shipmentData, selectedRows]);

  useEffect(() => {
    if (
      orderItems.length > 0 &&
      itemDispatch?.length > 0 &&
      Object.keys(selectedRows).length === 0
    ) {
      const preSelectedRows = {};
      const preShipmentData = {};

      itemDispatch.forEach((item) => {
        preSelectedRows[item.item_variants_id] = true;
        preShipmentData[item.item_variants_id] =
          item.dispatch_quantity || item.quantity || 0;
      });

      setSelectedRows(preSelectedRows);
      setShipmentData(preShipmentData);
      setSelectAll(Object.keys(preSelectedRows).length === orderItems.length);
    }
  }, [orderItems, itemDispatch]);

  useEffect(() => {
    if (
      orderItems.length > 0 &&
      itemDispatch?.length === 0 &&
      Object.keys(selectedRows).length === 0
    ) {
      const preSelectedRows = {};
      const preShipmentData = {};

      orderItems.forEach((item) => {
        const id = item.id;
        preSelectedRows[id] = true;
        preShipmentData[id] =
          itemDispatch?.find((d) => d.item_variants_id === id)
            ?.dispatch_quantity ||
          parseInt(item.quantity) ||
          0; // default to order quantity
      });

      setSelectedRows(preSelectedRows);
      setShipmentData(preShipmentData);
      setSelectAll(Object.keys(preSelectedRows).length === orderItems.length);
    }
  }, [orderItems, itemDispatch]);

  const columns = [
    {
      field: "customer_name",
      headerName: "Product Details",
      headerClassName: "super-app-theme--header",
      headerAlign: "left", // Align the column header to center
      width: 600,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => (
        <div
          className={`${classes.dflex} ${classes.tablecheckbox} ${classes.alignitemscenter} ${classes.justifyleft}`}
          style={{ height: "100%", width: "100%" }}
        >
          <Checkbox
            color="primary"
            inputProps={{ "aria-label": "secondary checkbox" }}
            checked={selectedRows[cellValues.id] || false}
            onChange={(e) => {
  const checked = e.target.checked;
  const rowId = cellValues.id;

  setSelectedRows((prev) => ({
    ...prev,
    [rowId]: checked,
  }));

  if (!checked) {
    setSelectAll(false);
    // Reset to original order quantity when unchecked
    const originalRow = rows.find((row) => row.id === rowId);
    setShipmentData((prev) => ({
      ...prev,
      [rowId]: parseInt(originalRow.quantity) || 0,
    }));
  }
}}
          />
          <img
            src={cellValues.value.product_image}
            alt="img"
            className={`${classes.checkoutimage}`}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: "2",
            }}
          >
            {console.log("cellValues", cellValues)}
            <div>{cellValues.value.variant_name}</div>
            <div>{cellValues.value.unit}</div>
            <div>{cellValues.value.product_category} </div>
          </div>
        </div>
      ),
    },
    {
      field: "quantity",
      headerName: "Order",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => (
        <div
          className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter}`}
          style={{ height: "100%", width: "100%" }}
        >
          {cellValues.value}
        </div>
      ),
    },
    {
      field: "shipment",
      headerName: "Shipment",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 180,
      sortable: false,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (params) => (
        <>
          <TextField
            size="small"
            variant="outlined"
            type="text"
            disabled={!selectedRows[params.row.id]}
            inputProps={{
              // maxLength: 10,
              inputMode: "numeric",
              pattern: "[0-9]{10}",
            }}
            onKeyDown={(e) => {
              if (
                e.key !== "Backspace" &&
                e.key !== "Delete" &&
                !/^\d$/.test(e.key)
              ) {
                e.preventDefault();
              }
            }}
            value={shipmentData[params.row.id] || ""}
            onChange={(e) => {
              setShipmentData((prev) => ({
                ...prev,
                [params.row.id]: e.target.value,
              }));
            }}
          />
          {console.log("shipmentData", shipmentData)}
        </>
      ),
    },
  ];

  const Heading = [
    {
      height: "maxh52",
      style: "viewtablewhite",
      rowheight: "140",
    },
  ];

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.bgwhite} ${classes.dflex} ${classes.flexdirectioncolumn} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3} ${classes.borderradius6px}`}
      >
        <div
          className={`${classes.dflex} ${classes.tablecheckbox} ${classes.alignitemscenter}`}
        >
          <Checkbox
            color="primary"
            inputProps={{ "aria-label": "secondary checkbox" }}
            checked={selectAll}
            onChange={(e) => {
              const checked = e.target.checked;
              setSelectAll(checked);

              const newSelections = {};
              rows.forEach((row) => {
                newSelections[row.id] = checked;
              });

              setSelectedRows(newSelections);
            }}
          />
          Select All Products
        </div>
        <TableView
          columns={columns}
          rows={rows}
          Heading={Heading}
          hideFooter={true}
        />
      </div>
    </>
  );
}
export default ItemQuantityDispatchForm;
