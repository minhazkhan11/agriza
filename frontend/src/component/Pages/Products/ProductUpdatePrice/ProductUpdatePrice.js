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
import ViewAssignProductUpdatePrice from "./ViewAssignProductUpdatePrice";
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

function ProductUpdatePrice() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <Dashboard />,
      mainheading: "Update Price",
    },
  ];
  const [selectedRowId, setSelectedRowId] = useState();

  const [anchorEl, setAnchorEl] = useState(null);
  const popoveropen = Boolean(anchorEl);
  const id = popoveropen ? "simple-popover" : undefined;

  const [searchQuery, setSearchQuery] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  const [product, setProduct] = useState([]);
  const [productClassId, setProductClassId] = useState([]);
  const [selectedProductClass, setSelectedProductClass] = useState("");

  const [productCategory, setProductCategory] = useState([]);
  const [selectedProductCategory, setSelectedProductCategory] = useState("");

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleButtonClick = (type, rowId) => {
    if (type === "edit-product") {
      navigate("/edit-product", { state: rowId });
    }
  };

  const handleClassChange = (event) => {
    setSelectedProductClass(event.target.value);
  };

  const handleProductCategoryChange = (event) => {
    setSelectedProductCategory(event.target.value);
  };

  const fetchProductClass = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/product_class`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.productClass) {
        setProductClassId(response.data.productClass);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchProductClass();
  }, []);

  const fetchProductCategory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/product_category`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setProductCategory(response.data.productCategory);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchProductCategory();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/productcatalogue`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      if (
        response.data &&
        response.data.catalogue &&
        Array.isArray(response.data.catalogue)
      ) {
        setProduct(response.data.catalogue);
      } else {
        console.error("Invalid API response format:", response.data);
        setProduct([]);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);

  let [Id, setId] = useState("");

  const handleCheckboxClick = (selectedIDs) => {
    console.log("Selected IDs:", selectedIDs);
    setId(selectedIDs);
  };

  const rows = product?.map((d) => ({
    id: d.id ? d.id : "N/A",
    product_name: d.product?.product_name ? d.product?.product_name : "N/A",
    product_class: d.product?.product_class_id
      ? d.product?.product_class_id.class_name
      : "N/A",
    product_category: d.product?.product_category_id
      ? d.product?.product_category_id.category_name
      : "N/A",
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

  const handleStatus = () => {
    if (!Id || Id.length === 0) {
      toast.error("Please select at least one product.");
      return;
    }

    const selectedData = Id.map((productId) => {
      const productData = product.find((item) => item.id === productId);
      return {
        productId: productId,
        product_name: productData ? productData.product.product_name : "N/A",
      };
    });
    toast.success("Product Add Successfully");
    setTimeout(() => {
      navigate("/edit-price-update-single", {
        state: { selectedData: selectedData },
      });
    }, 2000);
  };

  const columns = [
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
      field: "product_class",
      headerName: "Product Class",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "product_category",
      headerName: "Product Category",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "mrp_per_unit",
      headerName: "MRP Per Unit",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },

    {
      field: "basic_rates",
      headerName: "Basic Rates",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },

    // {
    //   field: "mrp_per_unit_update",
    //   headerName: "MRP Per Unit Update",
    //   headerClassName: "super-app-theme--header",
    //   headerAlign: "center",
    //   width: 180,
    //   flex: 1,
    //   sortable: true,
    //   disableColumnMenu: true,
    //   autoPageSize: false,
    //   renderCell: (params) => (
    //     <TextField
    //       size="small"
    //       variant="outlined"
    //       value={updatedProducts[params.row.id]?.mrp_per_unit_update || ""}
    //       onChange={(e) =>
    //         handleInputChange(
    //           params.row.id,
    //           "mrp_per_unit_update",
    //           e.target.value
    //         )
    //       }
    //     />
    //   ),
    // },
    // {
    //   field: "basic_rates_update",
    //   headerName: "Basic Rates Update",
    //   headerClassName: "super-app-theme--header",
    //   headerAlign: "center",
    //   type: "number",
    //   width: 110,
    //   sortable: true,
    //   disableColumnMenu: true,
    //   autoPageSize: false,
    //   renderCell: (params) => (
    //     <TextField
    //       size="small"
    //       variant="outlined"
    //       value={updatedProducts[params.row.id]?.basic_rates_update || ""}
    //       onChange={(e) =>
    //         handleInputChange(
    //           params.row.id,
    //           "basic_rates_update",
    //           e.target.value
    //         )
    //       }
    //     />
    //   ),
    // },
   {
      field: "active_status",
      headerName: "Action",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      width: 200,
      autoPageSize: false,
      renderCell: (cellValues) => {
        const isActive = cellValues.row.active_status === "active";

        return (
          <div
            className={`${classes.dflex} ${classes.w100} ${classes.alignitemscenter} ${classes.justifycenter} ${classes.mr1}`}
          >
            <Typography
              className={`${classes.dflex} ${classes.alignitemscenter} ${classes.texttransformcapitalize}`}
              variant="h6"
            >
              <IconButton
                onClick={() => {
                  // handleButtonClick("edit-product", cellValues.row.id);
                }}
              >
                <LightTooltip title="Edit">
                  <EditOutlinedIcon />
                </LightTooltip>
              </IconButton>
            </Typography>
            {/* <Popover
            id={id}
            open={popoveropen && selectedRowId === cellValues.row.id}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "center",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "center",
              horizontal: "right",
            }}
          >
            <Paper>
              <IconButton
                onClick={(event) => {
                  handleStatus(
                    cellValues.row.id,
                    cellValues.row.active_status
                  );
                }}
              >
                <LightTooltip title="Inactive">
                  <VisibilityOffOutlinedIcon />
                </LightTooltip>
              </IconButton>
              <IconButton
                onClick={() => {
                  handleButtonClick("edit-product", cellValues.row.id);
                }}
              >
                <LightTooltip title="Edit">
                  <EditOutlinedIcon />
                </LightTooltip>
              </IconButton>
             
            </Paper>
          </Popover> */}
          </div>
        );
      },
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
      <LearnerDetails
        menuProps={menuProps}
        productClassId={productClassId}
        selectedProductClass={selectedProductClass}
        handleClassChange={handleClassChange}
        productCategory={productCategory}
        selectedProductCategory={selectedProductCategory}
        handleProductCategoryChange={handleProductCategoryChange}
        // brand={brand}
        // selectedBrand={selectedBrand}
        // handleBatchChange={handleBrandChange}
        // marketer={marketer}
        // selectedMarketer={selectedMarketer}
        // handleMarketerChange={handleMarketerChange}
      />

      <div
        className={`${classes.w100} ${classes.h49vh} ${classes.bgwhite} ${classes.borderradius6px}`}
      >
        <ViewAssignProductUpdatePrice
          menuProps={menuProps}
          columns={columns}
          filteredRows={filteredRows}
          handleStatus={handleStatus}
          handleCheckboxClick={handleCheckboxClick}
        />
        <div
          className={`${classes.w100} ${classes.dflex} ${classes.justifyflexend}`}
        >
          <Button
            variant="contained"
            color="primary"
            className={`${classes.bluebtn} ${classes.my0_5}`}
            onClick={handleStatus}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
export default ProductUpdatePrice;
