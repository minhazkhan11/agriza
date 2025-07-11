import React, { useEffect, useState } from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as Dashboard } from "../../../images/mainheadingicon/Dashboard.svg";
import useStyles from "../../../../styles";
import { decryptData } from "../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@material-ui/core";
import AddLeadProductForm from "./AddLeadProductForm";
import { useLocation } from "react-router-dom";
import { ReactComponent as AddIcon } from "../../../images/pageheadingicon/addicon.svg";

function AddLeadProduct({ handlePopUp, rowId }) {
  const classes = useStyles();

  let [Id, setId] = useState();

  const handleCheckboxClick = (selectedIDs) => {
    setId(selectedIDs);
  };

  const Heading = [
    {
      id: 1,
      pageicon: <Dashboard />,
      mainheading: "Lead Product Potential",
      addmultitext: "Add Row",
      addmultiicon: <AddIcon />,
      addmultistyle: "bluebtn",
    },
  ];

  const [anchorEl, setAnchorEl] = useState(null);
  const [masterProduct, setMasterProduct] = useState([]);
  const popoveropen = Boolean(anchorEl);
  const id = popoveropen ? "simple-popover" : undefined;

  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  const [inputValues, setInputValues] = useState({});

  // Function to handle input changes
  const handleInputChange = (rowId, value) => {
    setInputValues((prev) => ({
      ...prev,
      [rowId]: value, // Store input value with rowId as key
    }));
  };

  const fetchMasterProduct = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/master_product`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setMasterProduct(response.data.master_product);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchMasterProduct();
  }, []);

  const rows = masterProduct.map((d) => ({
    id: d.id ? d.id : "N/A",
    product_name: d.product_name ? d.product_name : "N/A",
  }));

  const columns = [
    {
      field: "product_name",
      headerName: "Product Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => (
        <div
          className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter}`}
          style={{ height: "100%" }}
        >
          {cellValues.value}
        </div>
      ),
    },
   
    {
      field: "kharif",
      headerName: "Kharif",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 180,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (params) =>
        Id && Id.includes(params.row.id) ? (
          <TextField
            size="small"
            variant="outlined"
            type="number"
            value={inputValues[params.row.id] || ""} // Set input value from state
            onChange={(e) => handleInputChange(params.row.id, e.target.value)} // Update state on change
          />
        ) : null,
    },
    {
      field: "rabi",
      headerName: "Rabi",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 180,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (params) =>
        Id && Id.includes(params.row.id) ? (
          <TextField
            size="small"
            variant="outlined"
            type="number"
            value={inputValues[params.row.id] || ""} // Set input value from state
            onChange={(e) => handleInputChange(params.row.id, e.target.value)} // Update state on change
          />
        ) : null,
    },
    {
      field: "total_sale",
      headerName: "Total Annual Sale",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 180,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (params) =>
        Id && Id.includes(params.row.id) ? (
          <TextField
            size="small"
            variant="outlined"
            type="number"
            value={inputValues[params.row.id] || ""} // Set input value from state
            onChange={(e) => handleInputChange(params.row.id, e.target.value)} // Update state on change
          />
        ) : null,
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
        <AddLeadProductForm
          menuProps={menuProps}
          columns={columns}
          filteredRows={rows}
          onCheckboxClick={handleCheckboxClick}
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
            // onClick={handleFormSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
export default AddLeadProduct;
