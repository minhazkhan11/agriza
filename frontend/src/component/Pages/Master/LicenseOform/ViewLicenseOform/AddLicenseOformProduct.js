import React, { useEffect, useState } from "react";
import useStyles from "../../../../../styles";
import TableView from "../../../../CustomComponent/TableView";
import { decryptData } from "../../../../../crypto";
import axios from "axios";
import PageHeader from "../../../PageHeader";

function AddLicenseOformProduct({
  rowId,
  setLicenseProductIds,
  licenseProductIds,
}) {
  const classes = useStyles();

  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [licenseProduct, setLicenseProduct] = useState([]);

  const fetchLicenseProduct = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/license_product/license/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setLicenseProduct(response.data.license_product);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    if (rowId) {
      fetchLicenseProduct();
    }
  }, [rowId]);

  const rows = licenseProduct.map((d) => ({
    id: d.id ? d.id : "N/A",
    name_of_product: d.name_of_product ? d.name_of_product : "N/A",
    brand_name: d.brand_name ? d.brand_name : "N/A",
    source_of_supply: d.source_of_supply ? d.source_of_supply : "N/A",
  }));

  const columns = [
    {
      field: "name_of_product",
      headerName: "Name Of Product",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 110,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "brand_name",
      headerName: "Brand Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "source_of_supply",
      headerName: "Source Of Supply",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
  ];

  const handleCheckboxClick = (selectedIDs) => {
    setLicenseProductIds(selectedIDs);
  };

  const Heading = [
    {
      mainheading: "License Product Detail",
      height: "maxh52",
      style: "viewtable",
      checkboxselection: "true",
    },
  ];

  return (
    <div
    className={`${classes.bgwhite} ${classes.p2} ${classes.w100} ${classes.pb0} ${classes.pt1}`}
  >

    <PageHeader Heading={Heading} />
      <div
        className={`${classes.w100} ${classes.bgwhite} ${classes.borderradius6px} ${classes.mt1}`}
      >
      <TableView
        columns={columns}
        rows={rows}
        Heading={Heading}
        onCheckboxClick={handleCheckboxClick}
        checkboxSelection
        licenseProductIds={licenseProductIds}
      />
    </div>
        </div>
  );
}
export default AddLicenseOformProduct;
