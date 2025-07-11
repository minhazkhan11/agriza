import React, { useEffect, useState } from "react";
import PageHeader from "../../../PageHeader";
import { ReactComponent as Dashboard } from "../../../../images/mainheadingicon/Dashboard.svg";
import useStyles from "../../../../../styles";
import { decryptData } from "../../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@material-ui/core";
import AddLicenseProductForm from "./AddLicenseProductForm";
import { useLocation } from "react-router-dom";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import { set } from "date-fns";

function AddLicenseProduct({ handlePopUp, rowId }) {
  const classes = useStyles();
  const { state } = useLocation();
  const selectedData = state?.selectedData || [];
  const productIds = selectedData.map((product) => product.productId);

  const [licenseProduct, setLicenseProduct] = useState([{ index: 1 }]);

  const handleAddLink = () => {
    setLicenseProduct((prevLinks) => {
      return [...prevLinks, { index: prevLinks.length + 1 }];
    });
  };

  const Heading = [
    {
      id: 1,
      // pageicon: <Dashboard />,
      mainheading: "License Product Detail",
      addmultitext: "Add Row",
      addmultiicon: <AddIcon />,
      addmultistyle: "bluebtn",
      onClick: handleAddLink,
    },
  ];

  const [anchorEl, setAnchorEl] = useState(null);
  const popoveropen = Boolean(anchorEl);
  const id = popoveropen ? "simple-popover" : undefined;

  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  const [updatedProducts, setUpdatedProducts] = useState("");
  const [ids, setIds] = useState([]);

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

  const licenseProductNew = [
    { index: licenseProduct.length + 1 },
    ...licenseProduct,
  ];

  const rows = licenseProductNew?.map((d) => ({
    id: d.index ? d.index : "N/A",
  }));

  const handleInputChange = (productId, field, value) => {
    setIds((prevIds) => {
      if (!prevIds.includes(productId)) {
        return [...prevIds, productId];
      }
      return prevIds;
    });
    setUpdatedProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleFormSubmit = () => {
    if (ids.length === 0) {
      toast.error("No product IDs found!");
      return;
    }
    const productData = ids.map((productId) => ({
      name_of_product: updatedProducts[productId]?.name_of_product || "",
      brand_name: updatedProducts[productId]?.brand_name || "",
      source_of_supply: updatedProducts[productId]?.source_of_supply || "",
      be_license_id: rowId,
    }));

    const data = {
      license_product: productData,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/license_product/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("license product add Successfully");
        setTimeout(() => {
          handlePopUp();
          navigate(`/license-list`);
        }, 2000);
      })
      .catch((error) => {
        toast.error("Error: " + error);
      });
  };

  const fetchLicenseProduct = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/license_product/license/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        const newLicenseProducts = response?.data?.license_product?.map(
          (d, index) => ({
            index: index + 1,
          })
        );

        // Set unique licenseProduct list
        setLicenseProduct(newLicenseProducts);

        // Set unique updatedProducts
        const newUpdatedProducts = {};
        response?.data?.license_product?.forEach((d, index) => {
          newUpdatedProducts[index + 1] = {
            disabled: true,
            id: d?.id,
            name_of_product: d?.name_of_product,
            brand_name: d?.brand_name,
            source_of_supply: d?.source_of_supply,
          };
        });

        setUpdatedProducts(newUpdatedProducts);
        setIds(response?.data?.license_product?.map((d, index) => index + 1));
      })
      .catch((error) => {
        toast.error("Error: " + error);
      });
  };

  useEffect(() => {
    if (rowId) {
      fetchLicenseProduct();
    }
  }, [rowId]);

  const columns = [
    {
      field: "id",
      headerName: "#",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 100,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "name_of_product",
      headerName: "Name Of Product",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 180,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (params) => (
        <TextField
          className={classes.disablefieldcolor}
          disabled={updatedProducts[params.row.id]?.disabled}
          value={updatedProducts[params.row.id]?.name_of_product || ""}
          onChange={(e) =>
            handleInputChange(params.row.id, "name_of_product", e.target.value)
          }
          type="text"
          variant="outlined"
          required
          placeholder="Type Here"
          multiline
          rows={4}
        />
      ),
    },

    {
      field: "brand_name",
      headerName: "Brand Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 180,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (params) => (
        <TextField
          className={classes.disablefieldcolor}
          disabled={updatedProducts[params.row.id]?.disabled}
          value={updatedProducts[params.row.id]?.brand_name || ""}
          onChange={(e) =>
            handleInputChange(params.row.id, "brand_name", e.target.value)
          }
          type="text"
          variant="outlined"
          required
          placeholder="Type Here"
          multiline
          rows={4}
        />
      ),
    },
    {
      field: "source_of_supply",
      headerName: "Source Of Supply",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      type: "number",
      width: 180,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (params) => (
        <TextField
          className={classes.disablefieldcolor}
          disabled={updatedProducts[params.row.id]?.disabled}
          value={updatedProducts[params.row.id]?.source_of_supply || ""}
          onChange={(e) =>
            handleInputChange(params.row.id, "source_of_supply", e.target.value)
          }
          type="text"
          variant="outlined"
          required
          placeholder="Type Here"
          multiline
          rows={4}
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
    <div
      className={`${classes.bgwhite} ${classes.p2} ${classes.w50} ${classes.pb0} ${classes.pt1}`}
    >
      <PageHeader Heading={Heading} />

      <div
        className={`${classes.w100} ${classes.bgwhite} ${classes.borderradius6px}`}
      >
        <AddLicenseProductForm
          menuProps={menuProps}
          columns={columns}
          filteredRows={rows}
        />
        <div
          className={`${classes.w100} ${classes.dflex} ${classes.justifyflexend}`}
        >
          <Button
            onClick={handlePopUp}
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
export default AddLicenseProduct;
