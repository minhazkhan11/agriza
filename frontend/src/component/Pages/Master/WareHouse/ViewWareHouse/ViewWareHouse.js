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
import { useLocation, useNavigate } from "react-router-dom";

import { decryptData } from "../../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function ViewWareHouse() {
  const classes = useStyles();
  const location = useLocation();

  const currentPath = location.pathname;
  const mainMenu = JSON.parse(sessionStorage.getItem("main_menu"));

  let matchedItem = null;
  let parentItem = null;

  const findPathInMenu = (menu) => {
    for (let item of menu) {
      // 1. If it's a dropdown with a menu
      if (item.type === "dropdown" && Array.isArray(item.menu)) {
        for (let child of item.menu) {
          // 1a. Check grandchild first
          if (child.type === "dropdown" && Array.isArray(child.child_menu)) {
            for (let grandChild of child.child_menu) {
              if (grandChild.path === currentPath) {
                matchedItem = grandChild;
                parentItem = child;
                return true;
              }
            }
          }

          // 1b. Then check child
          if (child.path === currentPath) {
            matchedItem = child;
            parentItem = item;
            return true;
          }
        }
      }

      // 2. Then check top-level (only if no deeper match)
      if (item.type === "link" && item.path === currentPath) {
        matchedItem = item;
        return true;
      }

      // 3. Lastly, if it's a dropdown (like "Warehouse") with its own path
      if (item.type === "dropdown" && item.path === currentPath) {
        matchedItem = item;
        return true;
      }
    }

    return false;
  };

  findPathInMenu(mainMenu);

  const isEdit = matchedItem.actions?.edit;
  const isDelete = matchedItem?.actions?.delete;

  const style = [
    {
      height: "maxh67",
      style: "viewtable",
      rowheight: 100,
    },
  ];
  const [anchorEl, setAnchorEl] = useState(null);
  const popoveropen = Boolean(anchorEl);
  const id = popoveropen ? "simple-popover" : undefined;
  const [selectedRowId, setSelectedRowId] = useState();

  const [searchQuery, setSearchQuery] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [wareHouse, setWareHouse] = useState([]);
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
    if (type === "edit-warehouse") {
      navigate("/edit-warehouse", { state: rowId });
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
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/Business_warehouse_information`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setWareHouse(response.data.warehouse_information);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to delete a book
  const deleteDataOfRow = async (rowId) => {
    console.log("id", rowId);
    try {
      const decryptedToken = decryptData(sessionStorage.getItem("token"));
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/Business_warehouse_information/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      fetchData();
      handleClose();
      toast.success("Warehouse deleted successfully");
      const updateddatatata = wareHouse.filter((data) => data.id !== rowId);
      setWareHouse(updateddatatata);
    } catch (error) {
      toast.error("Warehouse is not deleted");
      console.error("Error deleting data: ", error);
    }
  };

  const handleStatus = (iddd, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const data = {
      warehouse_information: {
        active_status: newStatus,
        id: iddd,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/Business_warehouse_information/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        console.log("Warehouse status changed successfully", response);
        fetchData();
        toast.success("Warehouse status changed successfully");
        handleClose();
      })
      .catch((error) => {
        console.error("Error changed Warehouse status:", error);
        toast.error("Warehouse status is not changed");
      });
  };

  // const rows = wareHouse.map((d) => ({
  //   id: d.id ? d.id : "N/A",
  //   code: d.id ? `WARE${d.id}` : "N/A",
  //   name: d.name ? d.name : "N/A",
  //   gstnumber: d.gst_id ? d.gst_id.gst_number : "N/A",
  //   address: d.address ? d.address : "N/A",
  //   pincode: d.pincode_id ? d.pincode_id.pin_code : "N/A",
  //   place: d.place_id ? d.place_id.place_name : "N/A",
  //   ship_info: d.ship_info ? d.ship_info : "N/A",
  //   longitude: d.longitude ? d.longitude : "N/A",
  //   active_status: d.active_status ? d.active_status : "N/A",
  // }));

  const rows = wareHouse.map((d) => {
    const addressPart = d.address || "";
    const pincodePart = d.pincode_id?.pin_code || "";
    const placePart = d.place_id?.place_name || "";

    const fullAddress = [addressPart, pincodePart, placePart]
      .filter(Boolean) // remove empty values
      .join(", ");

    return {
      id: d.id || "N/A",
      code: d.id ? `WARE${d.id}` : "N/A",
      name: d.name || "N/A",
      gstnumber: d.gst_id?.gst_number || "N/A",
      address: fullAddress || "N/A",
      ship_info: d.ship_info || "N/A",
      longitude: d.longitude || "N/A",
      active_status: d.active_status || "N/A",
    };
  });

  const filteredRows = rows
    .filter((d) => {
      const isSearchMatch = d.name
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
      field: "code",
      headerName: "Code",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 100,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "name",
      headerName: "Warehouse Name",
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
      field: "gstnumber",
      headerName: "GST Number",
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
      field: "address",
      headerName: "Address",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 500,
      height: 500,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => (
        <div
          className={`${classes.dflex} ${classes.alignitemsstart} ${classes.justifycenter}`}
          style={{
            whiteSpace: "pre-wrap", // Enables multiline
            wordBreak: "break-word", // Prevents overflow
            textAlign: "center", // Optional: for center alignment
            lineHeight: "1.4", // Optional: better spacing
            paddingTop: 6,
            paddingBottom: 6,
          }}
        >
          {cellValues.value}
        </div>
      ),
    },
    {
      field: "ship_info",
      headerName: "Ship To Party",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (cellValues) => (
        <div
          className={`${classes.dflex} ${classes.texttransformcapitalize} ${classes.alignitemscenter} ${classes.justifycenter}`}
          style={{ height: "100%" }}
        >
          {cellValues.value}
        </div>
      ),
    },
    // {
    //   field: "longitude",
    //   headerName: "Longitude",
    //   headerClassName: "super-app-theme--header",
    //   headerAlign: "center", // Align the column header to center
    //   width: 200,
    //   flex: 1,
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
    //   field: "description",
    //   headerName: "Description",
    //   headerClassName: "super-app-theme--header",
    //   headerAlign: "center", // Align the column header to center
    //   width: 200,
    //   flex: 1,
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
    //   field: "students",
    //   headerName: "Students",
    //   headerClassName: "super-app-theme--header",
    //   headerAlign: "center",
    //   width: 110,
    //   flex: 1,
    //   sortable: true,
    //   disableColumnMenu: true,
    //   autoPageSize: false,
    // },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   headerClassName: "super-app-theme--header",
    //   headerAlign: "center",
    //   width: 180,
    //   flex: 2,
    //   sortable: true,
    //   disableColumnMenu: true,
    //   autoPageSize: false,
    //   renderCell: (cellValues) => {
    //     return (
    //       <div
    //         className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter} ${classes.mr1}`}
    //       >
    //         <Link>Quizzes</Link>
    //         <Link>Notes</Link>
    //         <Link> Quizzes </Link>
    //         <Link> Test Series </Link>
    //         <Link> Previous year paper</Link>
    //       </div>
    //     );
    //   },
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
                {isEdit && (
                  <IconButton
                    onClick={() => {
                      handleButtonClick("edit-warehouse", cellValues.row.id);
                    }}
                  >
                    <LightTooltip title="Edit">
                      <EditOutlinedIcon />
                    </LightTooltip>
                  </IconButton>
                )}
                {isDelete && (
                  <IconButton>
                    <LightTooltip title="Delete">
                      <DeleteIcon
                        onClick={() => deleteDataOfRow(cellValues.row.id)}
                      />
                    </LightTooltip>
                  </IconButton>
                )}
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
      inputplaceholder: "Search Warehouse Name",
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
export default ViewWareHouse;
