import React, { useState, useEffect } from "react";
import TableViewSearch from "../../../CustomComponent/TableViewSearch";
import TableView from "../../../CustomComponent/TableView";
import useStyles from "../../../../styles";
import { Backdrop, Modal, Paper, Popover, Tooltip, withStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import { useNavigate } from "react-router-dom";

import { decryptData } from "../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AddTelecaller from "../AddTeleceller/AddTelecaller";

function ViewTelecaller({open,  handleOpenClose}) {
  const classes = useStyles();
  const style = [
    {
      style: "viewtable",
      height: "maxh60",
    },
  ];
  const [anchorEl, setAnchorEl] = useState(null);
  const popoveropen = Boolean(anchorEl);
  const id = popoveropen ? "simple-popover" : undefined;
  const [selectedRowId, setSelectedRowId] = useState();

  const [searchQuery, setSearchQuery] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [telecallers, setTelecallers] = useState([]);
  const navigate = useNavigate();

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleButtonClick = (type, rowId, name) => {
    const state = {
      rowId: rowId,
      name: name,
    };
    if (type === "viewtelecallerlist") {
      navigate(`/admin/telecallerlist/${rowId}`, {state});
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/marketing/telecallers`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setTelecallers(response.data.telecaller);
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
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/teacher/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      console.log("Teacher deleted:", response.data);
      fetchData();
      handleClose();
      toast.success("Teacher deleted successfully");
      const updateddatatata = telecallers.filter((data) => data.id !== rowId);
      setTelecallers(updateddatatata);
    } catch (error) {
      toast.error("Teacher is not deleted");
      console.error("Error deleting data: ", error);
    }
  };

  const rows = telecallers.map((d) => ({
    id: d.id ? d.id : "N/A",
    name: d?.file_name ? d?.file_name : "N/A",
  }));

  const filteredRows = rows
    .filter((d) => {
      const isSearchMatch = d?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return isSearchMatch;
    })
    .map((row, index) => ({
      ...row,
      srno: index + 1,
    }));

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);
  const columns = [
    {
      field: "name",
      headerName: "Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 70,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "Action",
      headerName: "Status",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      sortable: true,
      disableColumnMenu: true,
      width: 150,
      flex: 1,
      autoPageSize: false,
      renderCell: (cellValues) => {
        return (
          <div
            className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter} ${classes.mr1}`}
          >
                <IconButton
                    onClick={() => {
                    handleButtonClick("viewtelecallerlist", cellValues.row.id, cellValues.row.name);
                  }}
                >
                  <LightTooltip title="View">
                    <VisibilityIcon />
                  </LightTooltip>
                </IconButton>
        
          </div>
        );
      },
    },
  ];

  
  const Heading = [
    {
      id: 1,
      // inputlable: "Enter Name / Code*",
      // inputplaceholder: "Search By Name or ID",
      // export: "yes",
      // import: "yes",
    },
  ];
  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.bgwhite} ${classes.pagescroll} ${classes.maxh76} ${classes.alignitemsend} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3} ${classes.borderradius6px}  ${classes.mt1}`}
      >
        <TableViewSearch Heading={Heading} onSearch={handleSearch} />
        <TableView columns={columns} rows={filteredRows}  Heading={style} />
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter}`}
        open={open}
        onClose={handleOpenClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <AddTelecaller
          handleOpenClose={handleOpenClose}
          open={open}
          fetchData={fetchData}
        />
      </Modal>
    </>
  );
}
export default ViewTelecaller;
