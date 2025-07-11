import React, { useEffect, useState } from "react";
import PageHeader from "../../../PageHeader";
import { ReactComponent as Dashboard } from "../../../../images/mainheadingicon/Dashboard.svg";
import useStyles from "../../../../../styles";
import { decryptData } from "../../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@material-ui/core";
import AddPriceListForm from "./AddPriceListForm";
import { useLocation } from "react-router-dom";
import { ReactComponent as AddIcon } from "../../../../images/pageheadingicon/addicon.svg";
import { set } from "date-fns";

function AddPriceList({ handlePopUp, rowId }) {
  const classes = useStyles();
  const { state } = useLocation();
  const selectedData = state?.selectedData || [];
  const productIds = selectedData.map((product) => product.productId);

  const [licenseProduct, setLicenseProduct] = useState([{ index: 1 }]);

  const handleAddLink = () => {
    setLicenseProduct((prevLinks) => {
      return [...prevLinks, { index: prevLinks.length }]; // Correct Indexing
    });
  };

  const Heading = [
    {
      id: 1,
      mainheading: "Item Variant Price List",
    },
  ];

  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [priceList, setPriceList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/item_variants/item_variant_price_list/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setPriceList(response.data.item_variant_prices);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const rows = priceList.map((d , index) => {
    const date = d.created_at ? new Date(d.created_at) : null;
    const formattedDate = date
      ? `${String(date.getDate()).padStart(2, "0")}/${String(
          date.getMonth() + 1
        ).padStart(2, "0")}/${date.getFullYear()}`
      : "N/A";

      console.log('formattedDate' , d)
    return {
      id: index + 1 ,
      date: formattedDate,
      item_delivery_type: d.item_delivery_type ? d.item_delivery_type : "N/A",
      mrp: d.mrp ? d.mrp : "N/A",
      selling_price: d.selling_price
        ? d.selling_price
        : "N/A",
      cross_price: d.cross_price
        ? d.cross_price
        : "N/A",
    };
  });

  const filteredRows = rows
    .filter((d) => {
      const isSearchMatch = d.date
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return isSearchMatch;
    })
    .map((row, index) => ({
      ...row,
      srno: index + 1,
    }));

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
      field: "date",
      headerName: "Date",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 150,
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
      field: "item_delivery_type",
      headerName: "Delivery Type",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 150,
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
      field: "mrp",
      headerName: "MRP",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 150,
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
      field: "selling_price",
      headerName: "Selling Price",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 150,
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
      field: "cross_price",
      headerName: "Cross Price",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 150,
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
        className={`${classes.w100} ${classes.mt1} ${classes.bgwhite} ${classes.borderradius6px}`}
      >
        <AddPriceListForm
          menuProps={menuProps}
          columns={columns}
          filteredRows={filteredRows}
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
          {/* <Button
            variant="contained"
            color="primary"
            className={`${classes.bluebtn} ${classes.my0_5}`}
            onClick={handleFormSubmit}
          >
            Submit
          </Button> */}
        </div>
      </div>
    </div>
  );
}
export default AddPriceList;
