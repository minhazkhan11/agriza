import React, { useState, useEffect } from "react";
// import TableViewSearch from "../../../CustomComponent/TableViewSearch";
import TableView from "../../../../CustomComponent/TableView";
import useStyles from "../../../../../styles";
import { Modal, Backdrop } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useNavigate, useParams } from "react-router-dom";
import { decryptData } from "../../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import QAPopup from "./QAPopup";
import ListHeader from "./ListHeader";

function ViewReceivedFeedback({ feedBack }) {
  const classes = useStyles();
  const style = [
    {
      style: "viewtable",
      height: "h60vh",
    },
  ];


  const [responses, setResponses] = useState();
  const [recievedForms, setRecievedForms] = useState();
  const { rowId } = useParams();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  const handleOpenClose = (response) => {
    setResponses(response);
    setOpen(!open);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/marketing/forms/response/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setRecievedForms(response.data.response);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [rowId]);

  const row =
  recievedForms?.map((d,n) => ({
      sno:n+1,
      id: d.id ? d.id : "N/A",
      name: d.name ? d.name : "N/A",
      phone: d.mobile ? d.mobile : "N/A",
      email: d.email ? d.email : "N/A",
      status: d.status ? d.status : "N/A",
      response: d.form?.fields ? d.form?.fields : "N/A",
    })) || [];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const columns = [
    {
      field: "sno",
      headerName: "#",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 50,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "name",
      headerName: "Name",
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
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "phone",
      headerName: "Phone",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "action",
      headerName: "Action",
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
            <Button
              className={`${classes.custombtnblue}`}
              onClick={() => {
                handleOpenClose(cellValues.row.response);
              }}
            >
              View
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.bgwhite} ${classes.pagescroll} ${classes.maxh76} ${classes.alignitemsend} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3} ${classes.borderradius6px}  ${classes.mt1}`}
      >
        <ListHeader />
        <TableView columns={columns} rows={row} Heading={style} />
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleOpenClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <QAPopup
          handleOpenClose={handleOpenClose}
          open={open}
          responses={responses}
        />
      </Modal>
    </>
  );
}
export default ViewReceivedFeedback;
