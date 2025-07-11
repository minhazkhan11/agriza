import React, { useEffect, useState } from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as Dashboard } from "../../../images/mainheadingicon/Dashboard.svg";
import useStyles from "../../../../styles";
import LearnerDetails from "../../../CustomComponent/LearnerDetails";
import ViewAssignProductCateloge from "./ViewAssignProductCateloge";
import { decryptData } from "../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";

function ProductCateloge() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <Dashboard />,
      mainheading: "Product Catalogue",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [product, setProduct] = useState([]);

  const navigate = useNavigate();

  const [productClassId, setProductClassId] = useState([]);
  const [selectedProductClass, setSelectedProductClass] = useState("");

  const [productCategory, setProductCategory] = useState([]);
  const [selectedProductCategory, setSelectedProductCategory] = useState("");

  const [brand, setBrand] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");

  const [marketer, setMarketer] = useState([]);
  const [selectedMarketer, setSelectedMarketer] = useState("");

  const handleClassChange = (event) => {
    setSelectedProductClass(event.target.value);
  };

  const handleProductCategoryChange = (event) => {
    setSelectedProductCategory(event.target.value);
  };

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  const handleMarketerChange = (event) => {
    setSelectedMarketer(event.target.value);
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

  const fetchBrand = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/brand`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.brand) {
        setBrand(response.data.brand);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching brand:", error);
    }
  };

  useEffect(() => {
    fetchBrand();
  }, []);

  const fetchMarketer = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/marketers`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.marketers) {
        setMarketer(response.data.marketers);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching Marketer:", error);
    }
  };

  useEffect(() => {
    fetchMarketer();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/productcatalogue/assigned_product`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setProduct(response.data.products);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const rows = product.map((d) => ({
    id: d.id ? d.id : "N/A",
    product_name: d.product_name ? d.product_name : "N/A",
    class_name: d.product_class_id?.class_name
      ? d.product_class_id.class_name
      : "N/A",
    category_name: d.product_category_id?.category_name
      ? d.product_category_id.category_name
      : "N/A",
    product_brand: d.brands_id?.brand_name ? d.brands_id.brand_name : "N/A",
    marketer_name: d.marketers_id?.marketer_name
      ? d.marketers_id.marketer_name
      : "N/A",
    active_status: d.active_status ? d.active_status : "N/A",
  }));

  const filteredRows = rows
    .filter((d) => {
      const query = searchQuery.toLowerCase();

      const isClassMatch =
        selectedProductClass === "" ||
        d.class_name?.toLowerCase() === selectedProductClass.toLowerCase();
      console.log("isClassMatch", isClassMatch);

      const isCategoryMatch =
        selectedProductCategory === "" ||
        d.category_name?.toLowerCase() ===
          selectedProductCategory.toLowerCase();
      const isBrandMatch =
        selectedBrand === "" ||
        d.product_brand?.toLowerCase() === selectedBrand.toLowerCase();
      const isMarketerMatch =
        selectedMarketer === "" ||
        d.marketer_name?.toLowerCase() === selectedMarketer.toLowerCase();

      const isSearchMatch =
        query === "" ||
        d.product_name?.toLowerCase().includes(query) ||
        d.category_name?.toLowerCase().includes(query) ||
        d.class_name?.toLowerCase().includes(query) ||
        d.brand_name?.toLowerCase().includes(query) ||
        d.marketer_name?.toLowerCase().includes(query);

      return (
        isClassMatch &&
        isCategoryMatch &&
        isBrandMatch &&
        isMarketerMatch &&
        isSearchMatch
      );
    })
    .map((row, index) => ({
      ...row,
      srno: index + 1,
    }));

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
      field: "class_name",
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
      field: "category_name",
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
      field: "product_brand",
      headerName: "Brand",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 180,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "marketer_name",
      headerName: "Marketer",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      type: "number",
      width: 110,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
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

  let [Id, setId] = useState();

  const handleCheckboxClick = (selectedIDs) => {
    setId(selectedIDs);
  };

  const handleStatus = async () => {
    if (!Id || Id.length === 0) {
      toast.error("Please select at least one learner.");
      return;
    }

    try {
      const data = {
        product_catalogue: {
          Product_id: Id,
        },
      };
      console.log(data, "data");
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/productcatalogue/addcatalogue`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      console.log("Product Catalogue assigned successfully", response);
      fetchProduct();
      toast.success("Product Catalogue assigned successfully");
      setTimeout(() => {
        // navigate(`/admin/learner`);
      }, 2000);
    } catch (error) {
      console.error("Error changed Product Catalogue status:", error);
      toast.error("Product Catalogue is not assigned ", error);
    }
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
        brand={brand}
        selectedBrand={selectedBrand}
        handleBrandChange={handleBrandChange}
        marketer={marketer}
        selectedMarketer={selectedMarketer}
        handleMarketerChange={handleMarketerChange}
      />

      <div
        className={`${classes.w100} ${classes.h49vh} ${classes.bgwhite} ${classes.borderradius6px}`}
      >
        <ViewAssignProductCateloge
          columns={columns}
          filteredRows={filteredRows}
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
            Add To basket
          </Button>
        </div>
      </div>
    </div>
  );
}
export default ProductCateloge;
