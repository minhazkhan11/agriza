import React, { useState, useEffect } from "react";
import {
  Backdrop,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import useStyles from "../../../../../styles";
import RemarkPopup from "./RemarkPopup";
import axios from "axios";
import { decryptData } from "../../../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";
import UploadPreview from "../../../../CustomComponent/UploadPreview";

const initialData = {
  id: "",
  marketer_name: "",
  description: "",
  alias_name: "",
  photo: "",
};

function ViewSingleMarketer({ handleOpenClose, open }) {
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  const [formDetails, setFormDetails] = useState(initialData);

  const [remark, setRemark] = useState("");

  const { state } = useLocation();
  const rowId = state;

  const classes = useStyles();

  const handleClose = () => {
    navigate("/marketer-approval-list");
  };

  const fetchDataFromAPI = async (rowId) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/admin/marketers/auth/pending/${rowId}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.marketers;

        setFormDetails({
          ...formDetails,
          id: data.id,
          marketer_name: data.marketer_name,
          description: data.description,
          alias_name: data.alias_name,
          photo: data.photo,
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data from the API:", error);
    }
  };

  useEffect(() => {
    if (rowId) {
      fetchDataFromAPI(rowId);
    }
  }, [rowId]);

  const handleStatus = (iddd) => {
    const newStatus = "active";
    const data = {
      marketers: {
        active_status: newStatus,
        id: iddd,
        remark: "Approved",
      },
    };

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/marketers/auth/remark/update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Marketer Approved successfully");
        navigate("/marketer-approval-list");
      })
      .catch((error) => {
        console.error("Error changed Marketer status:", error);
        toast.error("Marketer status is not changed");
      });
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.mt1} ${classes.mt1} ${classes.inputpadding} ${classes.inputborder} ${classes.pagescroll} ${classes.maxh76}`}
      >
        <FormControl className={`${classes.w100}`}>
          <div
            className={`${classes.bgwhite} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.py2} ${classes.px1_5} ${classes.mt1}`}
          >
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              >
                Marketers Details
              </Typography>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Marketer Legal Name{" "}
                  <span className={classes.textcolorred}>*</span>
                </FormLabel>
                <TextField
                  // onChange={(e) => setName(e.target.value)}
                  value={formDetails.marketer_name}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Marketer Legal Name"
                  disabled
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Alias Name (Short Name)
                </FormLabel>
                <TextField
                  // onChange={(e) => setAlias(e.target.value)}
                  value={formDetails.alias_name}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Alias Name"
                  disabled
                />
              </div>
              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Description
                </FormLabel>
                <TextField
                  // onChange={(e) => setDescription(e.target.value)}
                  value={formDetails.description}
                  type="text"
                  variant="outlined"
                  required
                  placeholder="Enter Description"
                  disabled
                />
              </div>
            </div>
            <div
              className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1}`}
            >
              <Typography
                className={`${classes.w24} ${classes.textcolorformhead} ${classes.fontfamilyoutfit} ${classes.fontsize} ${classes.fontstylenormal} ${classes.fw500} ${classes.lineheight2_25}`}
                variant="h6"
                display="inline"
              ></Typography>

              <div
                className={`${classes.dflex} ${classes.flexdirectioncolumn}  ${classes.w24}`}
              >
                <FormLabel
                  className={`${classes.textcolorformlabel} ${classes.fontfamilyoutfit}  ${classes.fontsize1} ${classes.fontstylenormal} ${classes.fw400} ${classes.lineheight}`}
                >
                  Marketer Image
                </FormLabel>
                <TextField
                  // onChange={handleThumbnailImageChange}
                  type="file"
                  variant="outlined"
                  required
                  name="photo"
                  placeholder="Enter Name"
                  disabled
                />
              </div>

              <div className={`${classes.w24} ${classes.mt1_5}`}>
                <UploadPreview thumbnailImagePreview={formDetails.photo} />
              </div>

              <div className={`${classes.w24} ${classes.mt1_5}`}></div>
            </div>
          </div>

          <div
            className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
          >
            <Button
              onClick={handleOpenClose}
              className={`${classes.custombtnoutline}`}
            >
              Cancel
            </Button>
            <Button
              onClick={(event) => {
                handleStatus(rowId);
              }}
              className={`${classes.custombtnblue}`}
            >
              Approve Status
            </Button>
          </div>
        </FormControl>

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
          <RemarkPopup
            open={open}
            handleOpenClose={handleOpenClose}
            remark={remark}
            setRemark={setRemark}
            rowId={rowId}
          />
        </Modal>
      </div>
    </>
  );
}
export default ViewSingleMarketer;
