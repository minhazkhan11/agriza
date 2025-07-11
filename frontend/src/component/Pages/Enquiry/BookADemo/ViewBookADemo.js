import React, { useState, useEffect } from "react";
import TableViewSearch from "../../../CustomComponent/LearnerTableViewSearch";
import TableView from "../../../CustomComponent/TableView";
import useStyles from "../../../../styles";
import { Paper, Popover, Tooltip, withStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { ReactComponent as ActiveIcon } from "../../../images/commonicon/activeicon.svg";
import { ReactComponent as InactiveIcon } from "../../../images/commonicon/inactiveicon.svg";
import { useNavigate } from "react-router-dom";

import { decryptData } from "../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function ViewBookADemo() {
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
  const [bookADemo, setBookADemo] = useState([]);
  const navigate = useNavigate();

  // const handleClick = (event, rowId) => {
  //   setAnchorEl(event.currentTarget);
  //   setSelectedRowId(rowId);
  // };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/book_a_demo`
        // {
        //   headers: {
        //     Authorization: `Bearer ${decryptedToken}`,
        //   },
        // }
      );

      setBookADemo(response.data.book_a_demo);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to delete a book
  // const deleteDataOfRow = async (rowId) => {
  //   try {
  //     const decryptedToken = decryptData(sessionStorage.getItem("token"));
  //     const response = await axios.delete(
  //       `${process.env.REACT_APP_API_BASE_URL}/v1/admin/product/${rowId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${decryptedToken}`,
  //         },
  //       }
  //     );
  //     fetchData();
  //     handleClose();
  //     toast.success("Product deleted successfully");
  //     const updateddatatata = product.filter((data) => data.id !== rowId);
  //     setProduct(updateddatatata);
  //   } catch (error) {
  //     toast.error("Product is not deleted");
  //     console.error("Error deleting data: ", error);
  //   }
  // };

  // const handleStatus = (iddd, currentStatus) => {
  //   const newStatus = currentStatus === "active" ? "inactive" : "active";
  //   const data = {
  //     product: {
  //       active_status: newStatus,
  //       id: iddd,
  //     },
  //   };

  //   axios
  //     .put(
  //       `${process.env.REACT_APP_API_BASE_URL}/v1/admin/product/status`,
  //       data,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${decryptedToken}`,
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       fetchData();
  //       toast.success("Product status changed successfully");
  //       handleClose();
  //     })
  //     .catch((error) => {
  //       console.error("Error changed Product status:", error);
  //       toast.error("Product status is not changed");
  //     });
  // };

  const rows = bookADemo.map((d) => ({
    id: d.id ? d.id : "N/A",
    full_name: d.full_name ? d.full_name : "N/A",
    phone: d.phone ? d.phone : "N/A",
    email: d.email ? d.email : "N/A",
    company: d.company ? d.company : "N/A",
    invite_guest: d.invite_guest ? d.invite_guest : "N/A",
    time: d.time ? d.time : "N/A",
    date: d.date ? d.date : "N/A",
    city: d.city ? d.city : "N/A",
    active_status: d.active_status ? d.active_status : "N/A",
  }));

  const filteredRows = rows
    .filter((d) => {
      const isSearchMatch = d.full_name
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
      field: "full_name",
      headerName: "Full Name",
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
      field: "email",
      headerName: "Email",
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
      field: "phone",
      headerName: "Phone",
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
      field: "date",
      headerName: "Date",
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
      field: "time",
      headerName: "Time",
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
      field: "company",
      headerName: "Company",
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
      field: "city",
      headerName: "City",
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
      field: "invite_guest",
      headerName: "Invite Guest(s)",
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
  ];

  const Heading = [
    {
      id: 1,
      // inputlable: "Enter Name / ID*",
      inputplaceholder: "Search By Name",
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
export default ViewBookADemo;
