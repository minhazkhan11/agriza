import React, { useState, useEffect } from "react";
import TableViewSearch from "../../../CustomComponent/TableViewSearch";
import TableView from "../../../CustomComponent/TableView";
import useStyles from "../../../../styles";
import {
  Backdrop,
  Modal,
  Paper,
  Popover,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import IconButton from "@material-ui/core/IconButton";
import { ReactComponent as ActiveIcon } from "../../../images/commonicon/activeicon.svg";
import { ReactComponent as InactiveIcon } from "../../../images/commonicon/inactiveicon.svg";
import { ReactComponent as HoldIcon } from "../../../images/commonicon/holdicon.svg";
import { useNavigate } from "react-router-dom";
import { decryptData } from "../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import RemarkPopup from "./RemarkPopup";

function ViewTelecallerList({ rowId }) {
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
  const [remark, setRemark] = useState("");

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [open, setOpen] = useState(false);
  const [statusData, setStatusData] = useState({ id: "", newStatus: "" });

  const handleOpenClose = (newStatus, id) => {
    setOpen(!open);
    if (newStatus && id) {
      setStatusData((prev) => ({
        ...prev,
        id: id,
        newStatus: newStatus,
      }));
    } 
  };

  const handleStatus = (remark) => {
    if (!remark) {
      toast.warn("Please enter remark");
      return;
    }
    const data = {
      telecaller: {
        remark: remark,
        status: statusData?.newStatus,
        id: statusData?.id,
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/marketing/telecallers/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        console.log("Status changed successfully", response);
        fetchData();
        toast.success("Status changed successfully");
        handleClose();
        handleOpenClose();
        setRemark("");
      })
      .catch((error) => {
        console.error("Error changed Status:", error);
        toast.error("Status is not changed");
      });
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/marketing/telecallers/${rowId}`,
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

  const rows =
    telecallers?.telecallerLists?.map((d, index) => ({
      id: d?.id ? d?.id : "N/A",
      srno: index + 1,
      name: d?.name ? d?.name : "N/A",
      phone: d?.phone ? d?.phone : "N/A",
      email: d?.email ? d?.email : "N/A",
      remark: d?.remark ? d?.remark : "N/A",
      status: d?.status ? d?.status : "N/A",
    })) || [];

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
      field: "srno",
      headerName: "#",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 70,
      // flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
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
      field: "phone",
      headerName: "Phone No.",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "email",
      headerName: "Email",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 110,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "remark",
      headerName: "Remark",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 110,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "status",
      headerName: "Status",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      sortable: true,
      disableColumnMenu: true,
      width: 150,
      autoPageSize: false,
      renderCell: (cellValues) => {
        return (
          <div
            className={`${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter} ${classes.mr1}`}
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
              className={`${classes.dflex} ${classes.fontsize1} ${classes.alignitemscenter} ${classes.texttransformcapitalize}`}
              variant="h6"
            >
              {cellValues.row.status === "interested" ? (
                <ActiveIcon className={`${classes.mr0_5}`} />
              ) : cellValues.row.status === "not_interested" ? (
                <InactiveIcon fontSize="small" className={`${classes.mr0_5}`} />
              ) : (
                <HoldIcon fontSize="small" className={`${classes.mr0_5}`} />
              )}

              {cellValues.row.status === "not_interested" ? "not interested" : cellValues.row.status}
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
                  onClick={() => {
                    handleOpenClose("interested", cellValues.row.id);
                  }}
                >
                  <LightTooltip title="Interested">
                    <ActiveIcon className={`${classes.mr0_5}`} />
                  </LightTooltip>
                </IconButton>
                <IconButton
                  onClick={() => {
                    handleOpenClose("not_interested", cellValues.row.id);
                  }}
                >
                  <LightTooltip title="Not Interested">
                    <InactiveIcon
                      fontSize="small"
                      className={`${classes.mr0_5}`}
                    />
                  </LightTooltip>
                </IconButton>
                <IconButton
                  onClick={() => {
                    handleOpenClose("maybe", cellValues.row.id);
                  }}
                >
                  <LightTooltip title="Maybe">
                    <HoldIcon fontSize="small" className={`${classes.mr0_5}`} />
                  </LightTooltip>
                </IconButton>
              </Paper>
            </Popover>
          </div>
        );
      },
    },
  ];
const importApiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/marketing/telecallers/import/csv/${rowId}`;
const exportApiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/marketing/telecallers/export/all/${rowId}`;

  const Heading = [
    {
      id: 1,
      // inputlable: "Enter Name / Code*",
      // inputplaceholder: "Search By Name or ID",
      importApiUrl: importApiUrl,
      exportApiUrl: exportApiUrl,
      fetchData: fetchData,
      export: "yes",
      import: "yes",
    },
  ];
  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.bgwhite} ${classes.pagescroll} ${classes.maxh76} ${classes.alignitemsend} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3} ${classes.borderradius6px}  ${classes.mt1}`}
      >
        <TableViewSearch Heading={Heading} onSearch={handleSearch} />
        <TableView columns={columns} rows={rows} Heading={style} />
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
        <RemarkPopup
          open={open}
          handleStatus={handleStatus}
          handleOpenClose={handleOpenClose}
          remark={remark}
          setRemark={setRemark}
        />
      </Modal>
    </>
  );
}
export default ViewTelecallerList;
