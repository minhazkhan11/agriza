import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import useStyles from "../../../styles";
import axios from "axios";
import { decryptData } from "../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UploadPreview from "../../CustomComponent/UploadPreview";
import { Autocomplete } from "@material-ui/lab";
import Comment from "./Comment";

function CheckoutForm() {
  const classes = useStyles();
  const navigate = useNavigate();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const customerDetails = JSON.parse(sessionStorage.getItem("customerDetails"));
  const cartState = JSON.parse(sessionStorage.getItem("cartstate"));
  const checkoutData = JSON.parse(sessionStorage.getItem("checkoutData"));
  const finalTotalAmount = JSON.parse(
    sessionStorage.getItem("finalTotalAmount")
  );

  const [warehouse, setWarehouse] = useState([]);
  const [vendorWarehouse, setVendorWarehouse] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [shipToParty, setShipToParty] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [selectedVendorWarehouse, setSelectedVendorWarehouse] = useState(null);
  const [selectedShipToParty, setSelectedShipToParty] = useState(null);
  const [selectedPaymentOptions, setSelectedPaymentOptions] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [remainingPayment, setRemainingPayment] = useState("");
  const [expectedDelivery, setExpectedDelivery] = useState("");
  const [shippingType, setShippingType] = useState("ownwarehouse");

  const [adminComment, setAdminComment] = useState("");
  const [generalComment, setGeneralComment] = useState("");
  const [orderImage, setOrderImage] = useState("");

  const PaymentOptions = [
    "Full Payment In Advance",
    "Partial Payment",
    "Payment On Delivery",
    "Payment On Next Order",
    "Credit Days",
  ];

  const PaymentModes = [
    "Cash",
    "Cheque / DD",
    "Net Banking",
    "UPI",
    "Debit / Credit Card",
    "Third Party",
    "Others",
  ];

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/Business_warehouse_information`,
        {
          headers: { Authorization: `Bearer ${decryptedToken}` },
        }
      )
      .then((res) => setWarehouse(res.data.warehouse_information || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/be_vendor/be/vendor`,
        {
          headers: { Authorization: `Bearer ${decryptedToken}` },
        }
      )
      .then((res) => setVendor(res.data.be_information || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/order_so_po/customer/ship_to_party/${customerDetails.id}`,
        {
          headers: { Authorization: `Bearer ${decryptedToken}` },
        }
      )
      .then((res) => setShipToParty(res.data.ship_to_party || []))
      .catch(console.error);
  }, [customerDetails.id]);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/Business_warehouse_information/be_info_id/${selectedVendor?.id}`,
        {
          headers: { Authorization: `Bearer ${decryptedToken}` },
        }
      )
      .then((res) => setVendorWarehouse(res.data.warehouse_information || []))
      .catch(console.error);
  }, [selectedVendor?.id]);

  const handleImage = async (e, field) => {
    const file = e.target.files[0];

    try {
      const formData = new FormData();
      const entitytype = "order";

      formData.append("entitytype", entitytype);
      formData.append(field, file);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/be_document/upload_to_s3bucket`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success(`${field} uploaded successfully!`);
        const uploadedFileUrl = response.data?.uploadedFiles?.[field] || "";

        setOrderImage(uploadedFileUrl);
      } else {
        toast.error(`Upload failed: ${response.data.message}`);
      }
    } catch (error) {
      toast.error(`Error uploading ${field}`);
      console.error("Upload error:", error);
    }
  };

  const handleFormSubmit = () => {
    // if (
    //   !selectedWarehouse && !selectedVendorWarehouse ||
    //   !selectedShipToParty ||
    //   !selectedPaymentOptions ||
    //   !expectedDelivery
    // ) {
    //   toast.warn("Please fill all required fields.");
    //   return;
    // }

    if (
      (selectedPaymentOptions === "Full Payment In Advance" ||
        selectedPaymentOptions === "Partial Payment") &&
      (!paymentAmount || !paymentMode || !transactionRef)
    ) {
      toast.warn("Please fill all required payment fields.");
      return;
    }

    if (
      (selectedPaymentOptions === "Partial Payment" ||
        selectedPaymentOptions === "Credit Days") &&
      !remainingPayment
    ) {
      toast.warn("Please enter remaining payment details.");
      return;
    }

    const totalDiscount = checkoutData?.discounts?.map((d) => ({
      total_discount_type: d.discountType,
      total_discount_name: d.discountName,
      total_discount: parseFloat(d.discountPrice || d.discountPercent),
    }));

    const otherCharges = checkoutData?.charges?.map((d) => ({
      charges_name: d.chargesName,
      charges: parseFloat(d.chargesPrice),
    }));

    const mappedItems = cartState.map((item) => ({
      item_variants_id: item.id,
      quantity: item.quantity,
      price: parseFloat(item.finalPrice),
      offer: item.offer,
      unit: item.unit,
      offer_type: item.offer_type,
      discount_type: item.discount_type,
      discount: item.discount,
    }));

    const orderDetails = {
      order: {
        order_type: "so",
        customer_be_id: customerDetails?.id || "",
        order_image: orderImage,
        ship_type: shippingType,
        customer_ship_to_party_id: selectedShipToParty?.id || "",
        warehouse_information_id: selectedWarehouse?.id || "",
        vendor_be_id: selectedVendor?.id || "",
        vendor_warehouse_information_id: selectedVendorWarehouse?.id || "",
        total_amount: finalTotalAmount,
        payment_type: selectedPaymentOptions,
        payment_amount: paymentAmount,
        remaining_payment_after: remainingPayment,
        payment_id: transactionRef,
        payment_mode: paymentMode,
        date: expectedDelivery,
        admin_comment: adminComment,
        general_comment: generalComment,
        items: mappedItems,
        total_discount: totalDiscount,
        other_charges: otherCharges,
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/order_so_po/add`,
        orderDetails,
        {
          headers: { Authorization: `Bearer ${decryptedToken}` },
        }
      )
      .then(() => {
        localStorage.removeItem("cartstate");
        sessionStorage.removeItem("cartstate");
        localStorage.removeItem("customerDetails");
        sessionStorage.removeItem("customerDetails");
        sessionStorage.removeItem("checkoutData");
        sessionStorage.removeItem("discounts");
        sessionStorage.removeItem("charges");
        sessionStorage.removeItem("finalTotalAmount");
        localStorage.removeItem("finalTotalAmount");
        window.dispatchEvent(new Event("cartstateChanged"));
        toast.success("Order Submitted Successfully");

        setTimeout(() => {
          navigate(
            shippingType === "ownwarehouse"
              ? "/sales-order-list"
              : "/purchase-order-list"
          );
        }, 2000);
      })
      .catch(() => toast.error("Submission failed"));
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh76}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5} ${classes.mt1}`}
          >
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>
              <div className={`${classes.dflex} ${classes.w75}`}>
                <RadioGroup
                  className={`${classes.radiocolor} ${classes.dflex}`}
                  row
                  aria-label="is Business"
                  name="is Business"
                  value={shippingType}
                  onChange={(e) => {
                    setShippingType(e.target.value);
                    setSelectedVendor("");
                    setSelectedVendorWarehouse("");
                    setSelectedWarehouse("");
                    setSelectedShipToParty("");
                  }}
                >
                  <FormControlLabel
                    value="ownwarehouse"
                    control={<Radio />}
                    label="Own Warehouse"
                  />
                  <FormControlLabel
                    value="dropshipping"
                    control={<Radio />}
                    label="Drop Shipping"
                  />
                </RadioGroup>
              </div>
            </div>
            {shippingType === "ownwarehouse" ? (
              <div
                className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
              >
                <Typography
                  className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                  variant="h6"
                  display="inline"
                >
                  Shipping Details
                </Typography>
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                >
                  {" "}
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    WareHouse <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <Autocomplete
                    id="state-autocomplete"
                    options={warehouse}
                    onChange={(_, val) => setSelectedWarehouse(val)}
                    disableClearable
                    getOptionLabel={(option) => option.name || ""}
                    autoHighlight
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Type to pick product category..."
                        variant="outlined"
                        {...params}
                      />
                    )}
                    selectOnFocus
                    openOnFocus
                  />
                </div>
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                >
                  {" "}
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    Customer Ship To Party{" "}
                    <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <Autocomplete
                    id="state-autocomplete"
                    options={shipToParty}
                    getOptionLabel={(option) => option.warehouse_name || ""}
                    onChange={(_, val) => setSelectedShipToParty(val)}
                    disableClearable
                    autoHighlight
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Type to pick product category..."
                        variant="outlined"
                        {...params}
                      />
                    )}
                    selectOnFocus
                    openOnFocus
                  />
                </div>

                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                ></div>
              </div>
            ) : (
              <div
                className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
              >
                <Typography
                  className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                  variant="h6"
                  display="inline"
                >
                  Shipping Details
                </Typography>
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                >
                  {" "}
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    Vendor <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <Autocomplete
                    id="state-autocomplete"
                    options={vendor}
                    onChange={(_, val) => setSelectedVendor(val)}
                    disableClearable
                    getOptionLabel={(option) => option.business_name || ""}
                    autoHighlight
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Type to pick product category..."
                        variant="outlined"
                        {...params}
                      />
                    )}
                    selectOnFocus
                    openOnFocus
                  />
                </div>
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                >
                  {" "}
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    WareHouse <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <Autocomplete
                    id="state-autocomplete"
                    options={vendorWarehouse}
                    onChange={(_, val) => setSelectedVendorWarehouse(val)}
                    disableClearable
                    getOptionLabel={(option) => option.name || ""}
                    autoHighlight
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Type to pick product category..."
                        variant="outlined"
                        {...params}
                      />
                    )}
                    selectOnFocus
                    openOnFocus
                  />
                </div>
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                >
                  {" "}
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    Customer Ship To Party{" "}
                    <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <Autocomplete
                    id="state-autocomplete"
                    options={shipToParty}
                    getOptionLabel={(option) => option.warehouse_name || ""}
                    onChange={(_, val) => setSelectedShipToParty(val)}
                    disableClearable
                    autoHighlight
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Type to pick product category..."
                        variant="outlined"
                        {...params}
                      />
                    )}
                    selectOnFocus
                    openOnFocus
                  />
                </div>
              </div>
            )}

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Payment Against Order
              </Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Payment Options{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <Autocomplete
                  id="state-autocomplete"
                  options={PaymentOptions}
                  value={selectedPaymentOptions}
                  onChange={(_, val) => setSelectedPaymentOptions(val)}
                  disableClearable
                  getOptionLabel={(option) => option}
                  autoHighlight
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Type to pick product category..."
                      variant="outlined"
                      {...params}
                    />
                  )}
                  selectOnFocus
                  openOnFocus
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
            </div>
            {(selectedPaymentOptions === "Full Payment In Advance" ||
              selectedPaymentOptions === "Partial Payment") && (
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
                    Payment Amount{" "}
                    <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <TextField
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    type="text"
                    variant="outlined"
                    required
                    placeholder="Enter Name"
                  />
                </div>

                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    Payment Mode <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <Autocomplete
                    id="state-autocomplete"
                    options={PaymentModes}
                    value={paymentMode}
                    onChange={(_, val) => setPaymentMode(val)}
                    disableClearable
                    getOptionLabel={(option) => option}
                    autoHighlight
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Type to pick product category..."
                        variant="outlined"
                        {...params}
                      />
                    )}
                    selectOnFocus
                    openOnFocus
                  />
                </div>
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                >
                  <FormLabel
                    className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                  >
                    Transaction Ref.No{" "}
                    <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <TextField
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    type="text"
                    variant="outlined"
                    required
                    placeholder="Enter Name"
                  />
                </div>
              </div>
            )}
            {(selectedPaymentOptions === "Partial Payment" ||
              selectedPaymentOptions === "Credit Days") && (
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
                    Remaining Payment After{" "}
                    <span className={classes.textcolorred}>*</span>
                  </FormLabel>
                  <TextField
                    value={remainingPayment}
                    onChange={(e) => setRemainingPayment(e.target.value)}
                    type="text"
                    variant="outlined"
                    required
                    placeholder="Enter Name"
                  />
                </div>

                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                ></div>
                <div
                  className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
                ></div>
              </div>
            )}
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
                  Order Attachments (max 6)
                </FormLabel>
                <TextField
                  name="order_image"
                  onChange={(e) => handleImage(e, "order_image")}
                  type="file"
                  variant="outlined"
                  required
                  placeholder="Enter Name"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Expected Delivery Date{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  value={expectedDelivery}
                  onChange={(e) => setExpectedDelivery(e.target.value)}
                  type="date"
                  variant="outlined"
                  required
                  placeholder="Enter Name"
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
            </div>

            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>

              <div className={`${classes.w24} ${classes.mt1_5}`}>
                <UploadPreview
                  thumbnailImagePreview={
                    orderImage && !(typeof orderImage == "string")
                      ? URL.createObjectURL(orderImage)
                      : orderImage
                  }
                />
              </div>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              ></div>
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
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w75}`}
              >
                {" "}
                <Comment
                  adminComment={adminComment}
                  setAdminComment={setAdminComment}
                  generalComment={generalComment}
                  setGeneralComment={setGeneralComment}
                />
              </div>
            </div>
          </div>
          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
          >
            <Button
              onClick={() => navigate("/customer-list")}
              className={`${classes.custombtnoutline} `}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              className={`${classes.custombtnblue}`}
            >
              Submit
            </Button>
          </div>
        </FormControl>
      </div>
    </>
  );
}
export default CheckoutForm;
