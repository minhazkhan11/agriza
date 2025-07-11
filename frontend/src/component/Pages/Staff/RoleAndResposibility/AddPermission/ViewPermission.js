import React, { useState, useEffect } from "react";
import TableViewSearch from "../../../../CustomComponent/TableViewSearch";
import TableView from "../../../../CustomComponent/TableView";
import useStyles from "../../../../../styles";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import { useLocation, useNavigate } from "react-router-dom";
import { decryptData } from "../../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function ViewPermission() {
  const classes = useStyles();
  const style = [
    {
      height: "h54vh",
      style: "viewtable",
    },
  ];

  const { state } = useLocation();
  const rowId = state.rowId;

  const isEdit = state.isEdit;

  console.log("isEdit", isEdit);

  const [anchorEl, setAnchorEl] = useState(null);
  const popoveropen = Boolean(anchorEl);
  const id = popoveropen ? "simple-popover" : undefined;

  const [searchQuery, setSearchQuery] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [productCategory, setProductCategory] = useState([]);

  const [updatedProducts, setUpdatedProducts] = useState([]);
  const [updatedProductsId, setUpdatedProductsId] = useState([]);

  const [rowsTest, setRowsTest] = useState([]);

  const navigate = useNavigate();

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClose = () => {
    navigate("/roles-list");
  };

  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);

  const fetchCheckboxData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/main_menu/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setUpdatedProducts(response.data.menu);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/main_menu`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setProductCategory(response.data.menu);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCheckboxData();
  }, []);

  useEffect(() => {
    if (productCategory.length > 0) {
      const extractedRows = [];
      extractMenuData(productCategory, "", { value: 1 }, extractedRows);

      const mergedRows = extractedRows.map((row) => {
        const updatedProduct = updatedProducts.find(
          (prod) => prod.path === row.path
        );
        return updatedProduct ? { ...row, ...updatedProduct } : row;
      });

      setRowsTest(mergedRows);
    }
  }, [productCategory, updatedProducts]);

  function extractMenuData(
    menu,
    parentName = "",
    indexCounter = { value: 1 },
    rowsArray,
    level = 1
  ) {
    menu.forEach((d) => {
      if (d.name === "Dashboard") return;
      if (d.name === "Staff") return;

      const categoryNameTest = parentName
        ? `${parentName} → ${d.name}`
        : d.name;
      let menuType = "main";

      if (level === 2) {
        menuType = "sub";
      } else if (level >= 3) {
        menuType = "child";
      }

      if (d.type === "link") {
        rowsArray.push({
          menu_id: d.id || "N/A",
          path: d.path || "N/A",
          category_name: categoryNameTest,
          menu_type: menuType,
          id: indexCounter.value++,
        });
      }

      if (d.menu)
        extractMenuData(
          d.menu,
          categoryNameTest,
          indexCounter,
          rowsArray,
          level + 1
        );
      if (d.child_menu)
        extractMenuData(
          d.child_menu,
          categoryNameTest,
          indexCounter,
          rowsArray,
          level + 1
        );
    });
  }

  const filteredRows = rowsTest
    .filter((d) => {
      const isSearchMatch = d.category_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return isSearchMatch;
    })
    .map((row, index) => ({
      ...row,
      srno: index + 1,
    }));

  const handleInputChange = (
    productId,
    menuid,
    menuType,
    path,
    field,
    value
  ) => {
    setUpdatedProducts((prev) => {
      const existingIndex = prev.findIndex((item) => item.menu_id === menuid);

      let updatedArray = [...prev];

      if (existingIndex !== -1) {
        // Update existing product permissions
        updatedArray[existingIndex] = {
          ...updatedArray[existingIndex],
          [field]: value,
        };
      } else {
        // Add new product permissions
        updatedArray.push({
          productId,
          menu_id: menuid,
          menu_type: menuType,
          path: path,
          [field]: value,
        });
      }

      return updatedArray;
    });

    setUpdatedProductsId((prevIds) =>
      prevIds.includes(productId) ? prevIds : [...prevIds, productId]
    );
  };

  const [selectedColumns, setSelectedColumns] = useState({
    add: false,
    edit: false,
    view: false,
    delete: false,
  });

  const handleSelectAll = (field) => {
    const newValue = !selectedColumns[field];

    setSelectedColumns((prev) => ({
      ...prev,
      [field]: newValue,
    }));

    const updatedItems = filteredRows.map((item) => ({
      ...item,
      [field]: newValue,
    }));

    setUpdatedProducts(updatedItems);
    const updatedItemsId = filteredRows.map((item) => item.id);
    setUpdatedProductsId(updatedItemsId);
  };

  const handleFormSubmit = () => {
    if (updatedProducts.length === 0) {
      toast.error("No menu found!");
      return;
    }

    const productData = updatedProducts.map((data) => ({
      menu_type: data?.menu_type,
      menu_id: data?.menu_id,
      actions: {
        view: data?.view || false,
        add: data?.add || false,
        edit: data?.edit || false,
        delete: data?.delete || false,
      },
    }));

    const data = {
      menu_plan_id: rowId,
      menu: productData,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/admin/main_menu/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Role Update Successfully");
        setTimeout(() => {
          navigate("/roles-list");
        }, 2000);
      })
      .catch((error) => {
        toast.error("Error: " + error);
      });
  };

  const columns = [
    {
      field: "category_name",
      headerName: "Menu",
      headerClassName: "super-app-theme--header",
      headerAlign: "center", // Align the column header to center
      width: 500,
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
      field: "add",
      headerName: "Add",
      renderHeader: () => (
        <div
          className={`${classes.tablecolumn}`}
          style={{
            display: "flex",
          }}
        >
          <span>Add</span>
          <FormControlLabel
            value="start"
            control={
              <Checkbox
                style={{
                  color: "#fff",
                  paddingLeft: "5px",
                }}
                color="primary"
                checked={selectedColumns["add"]}
                onChange={() => handleSelectAll("add")}
              />
            }
          />
        </div>
      ),
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (params) => (
        <Checkbox
          color="primary"
          inputProps={{ "aria-label": "secondary checkbox" }}
          checked={params.row.add || false}
          onChange={(e) => {
            handleInputChange(
              params.row.id,
              params.row.menu_id || params.row.menuid,
              params.row.menu_type,
              params.row.path,
              "add",
              e.target.checked
            );
          }}
          disabled={!isEdit}
        />
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      renderHeader: () => (
        <div
          className={`${classes.tablecolumn}`}
          style={{
            display: "flex",
          }}
        >
          <span>Edit</span>
          <FormControlLabel
            value="start"
            control={
              <Checkbox
                style={{
                  color: "#fff",
                  paddingLeft: "5px",
                }}
                color="primary"
                checked={selectedColumns["edit"]}
                onChange={() => handleSelectAll("edit")}
              />
            }
          />
        </div>
      ),
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (params) => (
        <Checkbox
          color="primary"
          inputProps={{ "aria-label": "secondary checkbox" }}
          checked={params.row.edit || false}
          onChange={(e) => {
            handleInputChange(
              params.row.id,
              params.row.menu_id || params.row.menuid,
              params.row.menu_type,
              params.row.path,
              "edit",
              e.target.checked
            );
          }}
          disabled={!isEdit}
        />
      ),
    },
    {
      field: "view",
      headerName: "View",
      renderHeader: () => (
        <div
          className={`${classes.tablecolumn}`}
          style={{
            display: "flex",
          }}
        >
          <span>View</span>
          <FormControlLabel
            value="start"
            control={
              <Checkbox
                style={{
                  color: "#fff",
                  paddingLeft: "5px",
                }}
                color="primary"
                checked={selectedColumns["view"]}
                onChange={() => handleSelectAll("view")}
              />
            }
          />
        </div>
      ),
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (params) => (
        <Checkbox
          color="primary"
          inputProps={{ "aria-label": "secondary checkbox" }}
          checked={params.row.view || false}
          onChange={(e) => {
            handleInputChange(
              params.row.id,
              params.row.menu_id || params.row.menuid,
              params.row.menu_type,
              params.row.path,
              "view",
              e.target.checked
            );
          }}
          disabled={!isEdit}
        />
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      renderHeader: () => (
        <div
          className={`${classes.tablecolumn}`}
          style={{
            display: "flex",
          }}
        >
          <span>Delete</span>
          <FormControlLabel
            value="start"
            control={
              <Checkbox
                style={{
                  color: "#fff",
                  paddingLeft: "5px",
                }}
                color="primary"
                checked={selectedColumns["delete"]}
                onChange={() => handleSelectAll("delete")}
              />
            }
            disabled={!isEdit}
          />
        </div>
      ),
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      autoPageSize: false,
      renderCell: (params) => (
        <Checkbox
          color="primary"
          inputProps={{ "aria-label": "secondary checkbox" }}
          checked={params.row.delete || false}
          onChange={(e) => {
            console.log("menuType", params.row);
            handleInputChange(
              params.row.id,
              params.row.menu_id || params.row.menuid,
              params.row.menu_type,
              params.row.path,
              "delete",
              e.target.checked
            );
          }}
          disabled={!isEdit}
        />
      ),
    },
  ];

  const Heading = [
    {
      id: 1,
      inputplaceholder: "Search Here",
      // export: "yes",
    },
  ];
  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.bgwhite} ${classes.alignitemsend} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3} ${classes.borderradius6px}  ${classes.mt1}`}
      >
        <TableView
          columns={columns}
          rows={filteredRows}
          Heading={style}
          hideFooter={true}
        />
        <div
          className={`${classes.dflex} ${classes.justifyflexend} ${
            classes.mt1
          } ${classes[style?.marginbottom]}`}
        >
          <Button
            onClick={handleClose}
            className={`${classes.custombtnoutline}`}
          >
            Cancel
          </Button>
          <Button
            onClick={handleFormSubmit}
            className={`${classes.custombtnblue}`}
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
}
export default ViewPermission;
