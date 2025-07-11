import React, { useState, useEffect } from "react";
import TableViewSearch from "../../../../CustomComponent/TableViewSearch";
import TableView from "../../../../CustomComponent/TableView";
import useStyles from "../../../../../styles";
import { Button, Paper, Popover, Tooltip, withStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { ReactComponent as ActiveIcon } from "../../../../images/commonicon/activeicon.svg";
import { ReactComponent as InactiveIcon } from "../../../../images/commonicon/inactiveicon.svg";
import { useNavigate } from "react-router-dom";
import { decryptData } from "../../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function ViewItemVariants({ handlePopUp, handlePricePopUp, setRowId , fetchData ,attributes ,setAttributes }) {
  const classes = useStyles();
  const style = [
    {
      height: "maxh67",
      style: "viewtable",
    },
  ];
  const [anchorEl, setAnchorEl] = useState(null);
  const popoveropen = Boolean(anchorEl);
  const id = popoveropen ? "simple-popover" : undefined;
  const [selectedRowId, setSelectedRowId] = useState();

  const [searchQuery, setSearchQuery] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const navigate = useNavigate();

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleButtonClick = (type, rowId) => {
    if (type === "edit-variant") {
      navigate("/edit-variant", { state: rowId });
    }
  };

  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);



  // Function to delete a book
  const deleteDataOfRow = async (rowId) => {
    try {
      const decryptedToken = decryptData(sessionStorage.getItem("token"));
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/item_variants/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      fetchData();
      handleClose();
      toast.success("Item Variant deleted successfully");
      const updateddatatata = attributes.filter((data) => data.id !== rowId);
      setAttributes(updateddatatata);
    } catch (error) {
      toast.error("Item Variant is not deleted");
      console.error("Error deleting data: ", error);
    }
  };

  const handleStatus = (iddd, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const data = {
      item_variants: {
        active_status: newStatus,
        id: iddd,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/item_variants/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        console.log("Item Variant status changed successfully", response);
        fetchData();
        toast.success("Item Variant status changed successfully");
        handleClose();
      })
      .catch((error) => {
        console.error("Error changed Item Variant status:", error);
        toast.error("Item Variant status is not changed");
      });
  };

  const rows = attributes.map((d) => ({
    id: d.id ? d.id : "N/A",
    sku_code: d?.item_variant_stock ? d.item_variant_stock?.sku_code : "N/A",
    variant_name: d.variant_name ? d.variant_name : "N/A",
    mrp: d.item_variant_price ? d.item_variant_price.mrp : "N/A",
    selling_price: d.item_variant_price
      ? d.item_variant_price.selling_price
      : "N/A",
    cross_price: d.item_variant_price
      ? d.item_variant_price.cross_price
      : "N/A",
      for_mrp: d.item_variant_price ? d.item_variant_price.ex_mrp : "N/A",
      for_selling_price: d.item_variant_price
        ? d.item_variant_price.selling_price
        : "N/A",
      for_cross_price: d.item_variant_price
        ? d.item_variant_price.cross_price
        : "N/A",
    moq: d.moq ? d.moq : "N/A",
    opening_stock: d.item_variant_stock ? d.item_variant_stock.stock : "N/A",
    active_status: d.active_status ? d.active_status : "N/A",
  }));

  const filteredRows = rows
    .filter((d) => {
      const isSearchMatch = d.variant_name
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
      field: "srno",
      headerName: "#",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 50,
      // sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "sku_code",
      headerName: "SKU Code",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 150,
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
      field: "variant_name",
      headerName: "Variant Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 500,
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
    // {
    //   field: "mrp",
    //   headerName: "MRP",
    //   headerClassName: "super-app-theme--header",
    //   headerAlign: "center", // Align the column header to center
    //   width: 150,
    //   sortable: true,
    //   disableColumnMenu: true,
    //   autoPageSize: false,
    //   renderCell: (cellValues) => (
    //     <div
    //       className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter}`}
    //       style={{ height: "100%" }}
    //     >
    //       {cellValues.value}
    //     </div>
    //   ),
    // },
    // {
    //   field: "selling_price",
    //   headerName: "Selling Price",
    //   headerClassName: "super-app-theme--header",
    //   headerAlign: "center", // Align the column header to center
    //   width: 150,
    //   sortable: true,
    //   disableColumnMenu: true,
    //   autoPageSize: false,
    //   renderCell: (cellValues) => (
    //     <div
    //       className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter}`}
    //       style={{ height: "100%" }}
    //     >
    //       {cellValues.value}
    //     </div>
    //   ),
    // },
    // {
    //   field: "cross_price",
    //   headerName: "Cross Price",
    //   headerClassName: "super-app-theme--header",
    //   headerAlign: "center", // Align the column header to center
    //   width: 150,
    //   sortable: true,
    //   disableColumnMenu: true,
    //   autoPageSize: false,
    //   renderCell: (cellValues) => (
    //     <div
    //       className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter}`}
    //       style={{ height: "100%" }}
    //     >
    //       {cellValues.value}
    //     </div>
    //   ),
    // },
    // {
    //   field: "for_mrp",
    //   headerName: "FOR MRP",
    //   headerClassName: "super-app-theme--header",
    //   headerAlign: "center", // Align the column header to center
    //   width: 150,
    //   sortable: true,
    //   disableColumnMenu: true,
    //   autoPageSize: false,
    //   renderCell: (cellValues) => (
    //     <div
    //       className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter}`}
    //       style={{ height: "100%" }}
    //     >
    //       {cellValues.value}
    //     </div>
    //   ),
    // },
    // {
    //   field: "for_selling_price",
    //   headerName: "FOR Selling Price",
    //   headerClassName: "super-app-theme--header",
    //   headerAlign: "center", // Align the column header to center
    //   width: 150,
    //   sortable: true,
    //   disableColumnMenu: true,
    //   autoPageSize: false,
    //   renderCell: (cellValues) => (
    //     <div
    //       className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter}`}
    //       style={{ height: "100%" }}
    //     >
    //       {cellValues.value}
    //     </div>
    //   ),
    // },
    // {
    //   field: "for_cross_price",
    //   headerName: "FOR Cross Price",
    //   headerClassName: "super-app-theme--header",
    //   headerAlign: "center", // Align the column header to center
    //   width: 150,
    //   sortable: true,
    //   disableColumnMenu: true,
    //   autoPageSize: false,
    //   renderCell: (cellValues) => (
    //     <div
    //       className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter}`}
    //       style={{ height: "100%" }}
    //     >
    //       {cellValues.value}
    //     </div>
    //   ),
    // },
    {
      field: "opening_stock",
      headerName: "Opening Stock",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 150,
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
      field: "moq",
      headerName: "MOQ",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 100,
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
    // {
    //   field: "update_price",
    //   headerName: "Update Price",
    //   headerClassName: "super-app-theme--header",
    //   headerAlign: "center",
    //   sortable: false,
    //   disableColumnMenu: true,
    //   width: 150,
    //   autoPageSize: false,
    //   renderCell: (cellValues) => {
    //     const isActive = cellValues.row.active_status === "active";

    //     return (
    //       <div
    //         className={`${classes.dflex} ${classes.w100} ${classes.alignitemscenter} ${classes.justifycenter} ${classes.mr1}`}
    //       >
    //         <Typography
    //           className={`${classes.dflex} ${classes.alignitemscenter} ${classes.texttransformcapitalize}`}
    //           variant="h6"
    //         >
    //           <Button
    //             className={classes.bluebtn}
    //             onClick={() => {
    //               handlePricePopUp();
    //               setRowId(cellValues.row.id);
    //             }}
    //           >
    //             Update
    //           </Button>
    //         </Typography>
    //       </div>
    //     );
    //   },
    // },
    {
      field: "price_list",
      headerName: "View Price list",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      width: 130,
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
              <Button
                className={classes.bluebtn}
                onClick={() => {
                  handlePopUp();
                  setRowId(cellValues.row.id);
                }}
              >
                List
              </Button>
            </Typography>
          </div>
        );
      },
    },
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
            <IconButton
              className={`${classes.w15}`}
              aria-describedby={id}
              onClick={(event) => {
                handleClick(event, cellValues.row.id);
              }}
            >
              <ArrowLeftIcon fontSize="small" />
            </IconButton>
            <Typography
              className={`${classes.dflex} ${classes.alignitemscenter} ${classes.texttransformcapitalize}`}
              variant="h6"
            >
              {isActive ? (
                <ActiveIcon className={`${classes.mr0_5}`} />
              ) : (
                <InactiveIcon fontSize="small" className={`${classes.mr0_5}`} />
              )}

              {cellValues.row.active_status}
            </Typography>
            <Popover
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
                    handleButtonClick("edit-variant", cellValues.row.id);
                  }}
                >
                  <LightTooltip title="Edit">
                    <EditOutlinedIcon />
                  </LightTooltip>
                </IconButton>
                <IconButton>
                  <LightTooltip title="Delete">
                    <DeleteIcon
                      onClick={() => deleteDataOfRow(cellValues.row.id)}
                    />
                  </LightTooltip>
                </IconButton>
              </Paper>
            </Popover>
          </div>
        );
      },
    },
  ];

  const Heading = [
    {
      id: 1,
      inputplaceholder: "Search Variant Name",
      // export: "yes",
      inputlable: "yes",
    },
  ];
  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.bgwhite} ${classes.alignitemsend} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3} ${classes.borderradius6px}  ${classes.mt1}`}
      >
        <TableViewSearch Heading={Heading} onSearch={handleSearch} />
        <TableView columns={columns} rows={filteredRows} Heading={style} />
      </div>
    </>
  );
}
export default ViewItemVariants;
