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

import { decryptData } from "../../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function ViewBrand() {
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
  const [brand, setBrand] = useState([]);
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
    if (type === "edit-brand") {
      navigate("/edit-brand", { state: rowId });
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

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/o_form_issue`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setBrand(response.data.o_form_issue);
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
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/brand/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      fetchData();
      handleClose();
      toast.success("Brand deleted successfully");
      const updateddatatata = brand.filter((data) => data.id !== rowId);
      setBrand(updateddatatata);
    } catch (error) {
      toast.error("Brand is not deleted");
      console.error("Error deleting data: ", error);
    }
  };

  const handleStatus = (iddd, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const data = {
      brand: {
        active_status: newStatus,
        id: iddd,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/brand/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        console.log("Brand status changed successfully", response);
        fetchData();
        toast.success("Brand status changed successfully");
        handleClose();
      })
      .catch((error) => {
        console.error("Error changed Brand status:", error);
        toast.error("Brand status is not changed");
      });
  };

  const rows = brand.map((d) => {
    const date = d.created_at ? new Date(d.created_at) : null;
    const formattedDate = date
      ? `${String(date.getDate()).padStart(2, "0")}/${String(
          date.getMonth() + 1
        ).padStart(2, "0")}/${date.getFullYear()}`
      : "N/A";

    return {
      id: d.id ? d.id : "N/A",
      lead:
        d.lead_id?.business_name || d.gst_details?.legal_name || "N/A",
      receiver: d.receiver?.first_name || d.lead_id?.name_of_dealing_person || "N/A",
      category_name: d.entity_type ? d.entity_type : "N/A",
      description: d.o_form_id ? d.o_form_id.o_form_versioning_name : "N/A",
      issue_type: d.issue_type ? d.issue_type : "N/A",
      isuue_date: formattedDate,
    };
  });

  const filteredRows = rows
    .filter((d) => {
      const isSearchMatch = d?.lead
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
      sortable: false,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "lead",
      headerName: "Business Name",
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
      field: "receiver",
      headerName: "Receiver",
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
      field: "category_name",
      headerName: "Entity Type",
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
      field: "description",
      headerName: "O-form Version",
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
      field: "issue_type",
      headerName: "Issue Type",
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
      field: "isuue_date",
      headerName: "Isuue Date",
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

    //  {
    //     field: "active_status",
    //     headerName: "Action",
    //     headerClassName: "super-app-theme--header",
    //     headerAlign: "center",
    //     sortable: false,
    //     disableColumnMenu: true,
    //     width: 200,
    //     autoPageSize: false,
    //     renderCell: (cellValues) => {
    //       const isActive = cellValues.row.active_status === "active";

    //       return (
    //         <div
    //           className={`${classes.dflex} ${classes.w100} ${classes.alignitemscenter} ${classes.justifycenter} ${classes.mr1}`}
    //         >
    //           <IconButton
    //             className={`${classes.w15}`}
    //             aria-describedby={id}
    //             onClick={(event) => {
    //               handleClick(event, cellValues.row.id);
    //             }}
    //           >
    //             <ArrowLeftIcon fontSize="small" />
    //           </IconButton>
    //           <Typography
    //             className={`${classes.dflex} ${classes.alignitemscenter} ${classes.texttransformcapitalize}`}
    //             variant="h6"
    //           >
    //             {isActive ? (
    //               <ActiveIcon className={`${classes.mr0_5}`} />
    //             ) : (
    //               <InactiveIcon fontSize="small" className={`${classes.mr0_5}`} />
    //             )}

    //             {cellValues.row.active_status}
    //           </Typography>
    //           <Popover
    //             id={id}
    //             open={popoveropen && selectedRowId === cellValues.row.id}
    //             anchorEl={anchorEl}
    //             onClose={handleClose}
    //             anchorOrigin={{
    //               vertical: "center",
    //               horizontal: "left",
    //             }}
    //             transformOrigin={{
    //               vertical: "center",
    //               horizontal: "right",
    //             }}
    //           >
    //             <Paper>
    //               <IconButton
    //                 onClick={(event) => {
    //                   handleStatus(
    //                     cellValues.row.id,
    //                     cellValues.row.active_status
    //                   );
    //                 }}
    //               >
    //                 <LightTooltip title="Inactive">
    //                   <VisibilityOffOutlinedIcon />
    //                 </LightTooltip>
    //               </IconButton>
    //               <IconButton
    //                 onClick={() => {
    //                   handleButtonClick("edit-brand", cellValues.row.id);
    //                 }}
    //               >
    //                 <LightTooltip title="Edit">
    //                   <EditOutlinedIcon />
    //                 </LightTooltip>
    //               </IconButton>
    //               <IconButton>
    //                 <LightTooltip title="Delete">
    //                   <DeleteIcon
    //                     onClick={() => deleteDataOfRow(cellValues.row.id)}
    //                   />
    //                 </LightTooltip>
    //               </IconButton>
    //             </Paper>
    //           </Popover>
    //         </div>
    //       );
    //     },
    //   },
  ];

  const Heading = [
    {
      id: 1,
      inputplaceholder: "Search brand name",
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
export default ViewBrand;
