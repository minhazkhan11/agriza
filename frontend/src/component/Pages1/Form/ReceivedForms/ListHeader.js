import React, { useEffect, useState } from "react";

import { Button } from "@material-ui/core";
import useStyles from "../../../../styles";
import { toast } from "react-toastify";
import axios from "axios";
import { decryptData } from "../../../../crypto";
import { ReactComponent as ExportIcon } from "../../../images/commonicon/exporticon.svg";
import { useParams } from "react-router-dom";

function ListHeader({ fetchData }) {
  const classes = useStyles();

  const { rowId } = useParams();

  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [fileURL, setFileURL] = useState("");
  const exportApi = async (decryptedToken) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/marketing/forms/export/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      if (response.status === 200) {
        setFileURL(response.data.file_url);
        // fetchData();
        // toast.success("Result CSV has been downloaded successfully.");
      } else {
        // toast.error("Failed to download the CSV file.");
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : "An error occurred while fetching the data.";
      toast.error(errorMessage);
      // fetchData();
    }
  };

  useEffect(() => {
    if (decryptedToken) {
      exportApi(decryptedToken);
    }
  }, [decryptedToken]);

  const handleExportClick = () => {
    if (fileURL && decryptedToken) {
      window.open(fileURL, "_blank");
      toast.success("CSV has been downloaded successfully.");
    } else {
      toast.error("Export file is not available for this.");
    }
  };

  return (
    <>
      <div
        className={`${classes.bgwhite} ${classes.dflex} ${classes.justifyflexend} ${classes.boxshadow3} ${classes.py0_5} ${classes.px1_5}`}
      >
        <Button
          className={`${classes.custombtnblue}`}
          onClick={handleExportClick}
          type=""
        >
          Export File <ExportIcon className={`${classes.ml1}`} />
        </Button>
      </div>
    </>
  );
}

export default ListHeader;
