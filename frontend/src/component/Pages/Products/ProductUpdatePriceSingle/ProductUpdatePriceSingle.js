import React, { useEffect, useState } from "react";
import {
  Paper,
  Popover,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import PageHeader from "../../PageHeader";
import { ReactComponent as Dashboard } from "../../../images/mainheadingicon/Dashboard.svg";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import useStyles from "../../../../styles";
import LearnerDetails from "../../../CustomComponent/LearnerDetails";
import { decryptData } from "../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { Button, InputAdornment, TextField } from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { ReactComponent as ActiveIcon } from "../../../images/commonicon/activeicon.svg";
import { ReactComponent as InactiveIcon } from "../../../images/commonicon/inactiveicon.svg";
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import ViewAssignProductUpdatePriceSingle from "./ViewAssignProductUpdatePriceSingle";
import { useLocation } from "react-router-dom";

function ProductUpdatePriceSingle() {
  const classes = useStyles();
  const { state } = useLocation();
  const selectedData = state?.selectedData || [];
  const productIds = selectedData.map((product) => product.productId);
  console.log("selectedData", selectedData);

  const Heading = [
    {
      id: 1,
      pageicon: <Dashboard />,
      mainheading: "Update Price",
    },
  ];

  const [anchorEl, setAnchorEl] = useState(null);
  const popoveropen = Boolean(anchorEl);
  const id = popoveropen ? "simple-popover" : undefined;

  const [searchQuery, setSearchQuery] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  const [updatedProducts, setUpdatedProducts] = useState("");

  useEffect(() => {
    if (productIds.length > 0) {
      const initialState = productIds.reduce((acc, productId) => {
        acc[productId] = {
          mrp_per_unit_update: "",
          basic_rates_update: "",
        };
        return acc;
      }, {});

      setUpdatedProducts(initialState);
    }
  }, []);

  const rows = selectedData?.map((d) => ({
    id: d.productId ? d.productId : "N/A",
    product_name: d.product_name ? d.product_name : "N/A",
  }));

  const filteredRows = rows
    .filter((d) => {
      const isSearchMatch = d.product_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return isSearchMatch;
    })
    .map((row, index) => ({
      ...row,
      srno: index + 1,
    }));
  const handleInputChange = (productId, field, value) => {
    setUpdatedProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };
  // console.log("updatedProducts", updatedProducts);

  const handleFormSubmit = () => {
    if (productIds.length === 0) {
      toast.error("No product IDs found!");
      return;
    }

    const productData = productIds.map((productId) => ({
      mrp: updatedProducts[productId]?.mrp_per_unit_update || "",
      basic_rate: updatedProducts[productId]?.basic_rates_update || "",
      Product_id: productId,
    }));
    // if (!productData.mrp) {
    //   toast.error("Please Enter a MRP  value");
    //   return;
    // }
    // if (!productData.basic_rate) {
    //   toast.error("Please Enter a Basic Rate value");
    //   return;
    // }

    const data = {
      product_price: productData,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/product_price/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Price Update Successfully");
        setTimeout(() => {
          navigate("/price-update-list");
        }, 2000);
      })
      .catch((error) => {
        toast.error("Error: " + error);
      });
  };

  const columns = [
    {
      field: "srno",
      headerName: "#",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 100,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "product_name",
      headerName: "Product Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 110,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },

    {
      field: "mrp_per_unit_update",
      headerName: "MRP Per Unit Update",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 180,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (params) => (
        <TextField
          size="small"
          variant="outlined"
          type="number"
          value={updatedProducts[params.row.id]?.mrp_per_unit_update || ""}
          onChange={(e) =>
            handleInputChange(
              params.row.id,
              "mrp_per_unit_update",
              e.target.value
            )
          }
        />
      ),
    },
    {
      field: "basic_rates_update",
      headerName: "Basic Rates Update",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      type: "number",
      width: 180,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (params) => (
        <TextField
          size="small"
          variant="outlined"
          type="number"
          value={updatedProducts[params.row.id]?.basic_rates_update || ""}
          onChange={(e) =>
            handleInputChange(
              params.row.id,
              "basic_rates_update",
              e.target.value
            )
          }
        />
      ),
    },
  ];

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading} />

      <div
        className={`${classes.w100} ${classes.h49vh} ${classes.bgwhite} ${classes.borderradius6px}`}
      >
        <ViewAssignProductUpdatePriceSingle
          menuProps={menuProps}
          columns={columns}
          filteredRows={filteredRows}
        />
        <div
          className={`${classes.w100} ${classes.dflex} ${classes.justifyflexend}`}
        >
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
export default ProductUpdatePriceSingle;
