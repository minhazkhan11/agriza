import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Button,
  Checkbox,
  FormControl,
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
import UploadPreview from "../../../CustomComponent/UploadPreview";
import TableView from "../../../CustomComponent/TableView";

function DispatchDetailsReview({
  formDetails,
  thumbnailImagePreview,
  setItemDispatch,
  itemDispatch,
  orderItems,
}) {
  const classes = useStyles();

  const [shipmentData, setShipmentData] = useState({});
  const [selectedRows, setSelectedRows] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  const rows = orderItems
    ?.filter((d) =>
      itemDispatch?.some((item) => item.item_variants_id === d.id)
    )
    .map((d) => ({
      id: d?.id ? d.id : "N/A",
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
        preShipmentData[item.item_variants_id] = item.dispatch_quantity;
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
        <div
          className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter}`}
          style={{ height: "100%", width: "100%" }}
        >
          {shipmentData[params.row.id] || ""}
        </div>
      ),
    },
  ];

  const Heading = [
    {
      // height: "maxh52",
      style: "viewtablewhite",
      rowheight: "140",
    },
  ];

  const rowHeight = 52; // typical row height (you can adjust if needed)
  const headingHeight = 140; // you already mentioned this height
  const tablePadding = 10; // extra padding if needed
  const dynamicTableHeight =
    headingHeight + rows.length * rowHeight + tablePadding;

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh76}`}
      >
        <FormControl className={`${classes.w100}`}>
          Review Shipment
          <div
            className={`${classes.dflex} ${classes.m0_5} ${classes.flexwrapwrap} ${classes.justifyaround} ${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.pb2} ${classes.px1_5}`}
          >
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                LR/BILTY Number:
              </FormLabel>
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                {formDetails.bilty_number}
              </FormLabel>
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Order/Invoice Number:
              </FormLabel>
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                {formDetails.order_invoice_number}
              </FormLabel>
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Transporter Name:
              </FormLabel>
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                {formDetails.transporter_name}
              </FormLabel>
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Transporter Contact Number:
              </FormLabel>
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                {formDetails.transporter_contact_number}
              </FormLabel>
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Driver Name:
              </FormLabel>
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                {formDetails.driver_name}
              </FormLabel>
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Driver Mobile number:
              </FormLabel>
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                {formDetails.driver_contact_number}
              </FormLabel>
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Vehicle Number
              </FormLabel>
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                {formDetails.vehicle_number}
              </FormLabel>
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Broker Details (If any):
              </FormLabel>
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                {formDetails.broker_details}
              </FormLabel>
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Freight:
              </FormLabel>
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                {formDetails.freight}
              </FormLabel>
            </div>
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Payment:
              </FormLabel>
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                {formDetails.payment_type}
              </FormLabel>
            </div>

            {/* Image Preview */}
            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Attachments:
              </FormLabel>
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                <UploadPreview thumbnailImagePreview={thumbnailImagePreview} />
              </FormLabel>
            </div>

            <div
              className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.w30}`}
            >
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                Note:
              </FormLabel>
              <FormLabel
                className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1}
                                                           ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
              >
                {formDetails.note}
              </FormLabel>
            </div>
          </div>
        </FormControl>

        <TableView
          columns={columns}
          rows={rows}
          Heading={Heading}
          hideFooter={true}
          tableHeight={dynamicTableHeight}
        />
      </div>
    </>
  );
}
export default DispatchDetailsReview;
