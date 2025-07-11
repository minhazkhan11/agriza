import React, { useState, useEffect } from "react";
import TableViewSearch from "../../../../CustomComponent/TableViewSearch";
import TableView from "../../../../CustomComponent/TableView";
import useStyles from "../../../../../styles";
import { Paper, Popover, Tooltip, withStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { ReactComponent as ActiveIcon } from "../../../../images/commonicon/activeicon.svg";
import { ReactComponent as InactiveIcon } from "../../../../images/commonicon/inactiveicon.svg";
import { useNavigate } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import PrintOutlinedIcon from "@material-ui/icons/PrintOutlined";
import { decryptData } from "../../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { LicenseOformPDF } from "./LicenseOformPDF";
import FileSaver from "file-saver";
import { pdf } from "@react-pdf/renderer";

function ViewLicense({ handlePopUp, setRowId }) {
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
  const [businessCategory, setBusinessCategory] = useState([]);
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
    const data = {
      rowId: rowId,
    };
    navigate(`/${type}`, { state: rowId });
  };

  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/license`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setBusinessCategory(response.data.license_details);
      console.log("rs", response.data.license_details);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to delete a book
  const deleteDataOfRow = async (rowId) => {
    try {
      const decryptedToken = decryptData(sessionStorage.getItem("token"));
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/license/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      fetchData();
      handleClose();
      toast.success("License deleted successfully");
      const updateddatatata = businessCategory.filter(
        (data) => data.id !== rowId
      );
      setBusinessCategory(updateddatatata);
    } catch (error) {
      toast.error("License is not deleted");
      console.error("Error deleting data: ", error);
    }
  };

  const handleStatus = (iddd, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const data = {
      license_details: {
        active_status: newStatus,
        id: iddd,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/license/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        console.log("License status changed successfully", response);
        fetchData();
        toast.success("License status changed successfully");
        handleClose();
      })
      .catch((error) => {
        console.error("Error changed License status:", error);
        toast.error("License status is not changed");
      });
  };

  const handleDownloadLicenseOformPDF = async (id) => {
    const selectedCategory = businessCategory.find(
      (category) => category.id === id
    );
    console.log("selectedCategory", selectedCategory);
    try {
      const blob = await pdf(
        <LicenseOformPDF orders={selectedCategory} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");

      toast("Invoice opened in new tab", {
        position: "top-right",
        autoClose: 5000,
        type: "success",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast("Failed to open invoice", {
        position: "top-right",
        autoClose: 5000,
        type: "error",
      });
    }
  };

  const rows = businessCategory.map((d) => ({
    id: d.id ? d.id : "N/A",
    // code: d.id ? `LICE${d.id}` : "N/A",
    license_name: d.license_name ? d.license_name : "N/A",
    license_category: d.license_category
      ? d.license_category.license_category_name
      : "N/A",
    beneficiary_name: d.beneficiary_name ? d.beneficiary_name : "N/A",
    license_territory: d.license_territory_id
      ? d.license_territory_id.state_name
      : "N/A",
    license_status: d.license_status ? d.license_status : "N/A",
    license_number: d.license_no ? d.license_no : "N/A",
    date_of_issue: d.date_of_issue
      ? new Date(d.date_of_issue).toLocaleDateString("en-GB")
      : "N/A",
    date_of_expiry: d.date_of_expiry
      ? new Date(d.date_of_expiry).toLocaleDateString("en-GB")
      : "N/A",
    active_status: d.active_status ? d.active_status : "N/A",
  }));

  const filteredRows = rows
    .filter((d) => {
      const isSearchMatch = d.license_name
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
      width: 100,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "license_category",
      headerName: "License Category",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 300,
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
      field: "license_name",
      headerName: "License Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 300,
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
      field: "beneficiary_name",
      headerName: "Beneficiary Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 300,
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
      field: "license_status",
      headerName: "License Status",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 200,
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
      field: "license_number",
      headerName: "License Number",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 200,
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
      field: "license_territory",
      headerName: "License Territory ",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 200,
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
      field: "date_of_issue",
      headerName: "Date of Issue",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 200,
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
      field: "date_of_expiry",
      headerName: "Date of Expiry",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 200,
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
                {/* <IconButton
                  onClick={() =>
                    handleDownloadLicenseOformPDF(cellValues.row.id)
                  }
                >
                  <LightTooltip title="Print">
                    <PrintOutlinedIcon />
                  </LightTooltip>
                </IconButton> */}

                <IconButton
                  onClick={() => {
                    handlePopUp();
                    setRowId(cellValues.row.id);
                  }}
                >
                  <LightTooltip title="Add">
                    <AddIcon />
                  </LightTooltip>
                </IconButton>
                <IconButton
                  onClick={(event) => {
                    handleStatus(
                      cellValues.row.id,
                      cellValues.row.active_status
                    );
                  }}
                >
                  <LightTooltip title="View">
                    <VisibilityOffOutlinedIcon />
                  </LightTooltip>
                </IconButton>
                {/* <IconButton
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
                </IconButton> */}
                <IconButton
                  onClick={() => {
                    handleButtonClick("edit-license", cellValues.row.id);
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
      inputplaceholder: "Search License Name",
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
export default ViewLicense;
