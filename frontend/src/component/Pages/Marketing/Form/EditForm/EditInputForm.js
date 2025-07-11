import React, { useState, useEffect } from "react";
import FormBuilder from "../GoogleFormBuilder";
import useStyles from "../../../../../styles";
import { Button } from "@material-ui/core";
import { useNavigate, useParams } from "react-router-dom";
import uuid from "react-uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { decryptData } from "../../../../../crypto";

const EditInputForm = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { rowId } = useParams();
  const handleClose = () => {
    navigate("/admin/forms");
  };

  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [formType, setFormType] = useState("text");
  const initialQuillData = {
    id: uuid(),
    value: null,
    type: formType,
    required: false,
  };
  const [quillData, setQuillData] = useState([initialQuillData]);

  const [headerData, setHeaderData] = useState({
    form_title: "",
    form_description: "",
  });

  const handleFormSubmit = async () => {
    let hasValidationError = false;

    if (!headerData.form_title) {
      toast.error("Please Enter Form Title");
      hasValidationError = true;
    }

    quillData.forEach((data, i) => {
      // Check if 'value' exists
      if (!data?.value) {
        toast.error(`Please Enter Question for Field No. ${i + 1}`);
        hasValidationError = true;
        return;
      }

      // Check for radio or checkbox type with empty options array
      if (
        (data.type === "radio" || data.type === "checkbox") &&
        (!data.options || data.options.length === 0)
      ) {
        toast.error(`Please Enter Options for Field No. ${i + 1}`);
        hasValidationError = true;
        return;
      }
    });

    if (hasValidationError) {
      return;
    }
    try {
      const data = {
        form: {
          id: rowId,
          title: headerData.form_title,
          description: headerData.form_description,
          fields: quillData.map((data1, index) => {
            const formattedData = {
              label: data1?.value,
              type: data1?.type,
              required: data1?.required,
            };
            if (data1?.type === "radio" || data1?.type === "checkbox") {
              formattedData.options = data1?.options?.map((opt, i) => {
                const optionObj = {
                  option: opt?.value,
                };
                if (typeof opt.id !== "string") {
                  optionObj.id = opt?.id;
                }
                return optionObj;
              });
            }
            if (typeof data1.id !== "string") {
              formattedData.id = data1?.id;
            }
            return formattedData;
          }),
        },
      };

      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/marketing/forms`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Form Updated Successfully");

        setTimeout(() => {
          navigate("/admin/forms");
        }, 1000);
      } else {
        console.error("Error:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const fetchData = async (rowId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/marketing/forms/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data && response.data.form) {
        const data = response.data.form;

        const formattedData = data.fields?.map((val, index) => {
          const formattedVal = {
            id: val?.id,
            value: val?.label,
            type: val?.type,
            required: val?.required,
          };
          if (val.options) {
            formattedVal.options = val.options.map((opt, i) => ({
              id: opt?.id,
              value: opt?.option,
            }));
          }
          return formattedVal;
        });
        const header = {
          form_title: data?.title,
          form_description: data?.description ? data?.description : "",
        };
        setHeaderData(header);
        setQuillData(formattedData);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchData(rowId);
  }, [rowId]);

  const handleRemoveField = async (idToRemove) => {
    if (typeof idToRemove === "string") {
      setQuillData((prevState) =>
        prevState.filter((val) => val.id !== idToRemove)
      );
    } else {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/marketing/forms/field/${idToRemove}`,
          {
            headers: {
              Authorization: `Bearer ${decryptedToken}`,
            },
          }
        );

        setQuillData((prevState) =>
          prevState.filter((val) => val.id !== idToRemove)
        );
        toast.success("Field deleted successfully");
      } catch (error) {
        console.error("Error deleting field:", error);
        toast.error("Failed to delete field");
      }
    }
  };
  const handleRemoveOption = async (elId, optionId) => {
    if (typeof optionId === "string") {
      let newArr = quillData.map((el) => {
        if (el.id === elId) {
          let newOptions =
            el?.options && el?.options.filter((opt) => opt.id !== optionId);
          return { ...el, options: newOptions };
        } else {
          return el;
        }
      });
      setQuillData(newArr);
    }else{
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/marketing/forms/field/option/${optionId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      let newArr = quillData.map((el) => {
        if (el.id === elId) {
          let newOptions =
            el?.options && el?.options.filter((opt) => opt.id !== optionId);
          return { ...el, options: newOptions };
        } else {
          return el;
        }
      });
      setQuillData(newArr);
      toast.success("Option deleted successfully");
    } catch (error) {
      console.error("Error deleting option:", error);
      toast.error("Failed to delete option");
    }

  }
  
  };

  return (
    <>
      <ToastContainer />
      <div className={`${classes.mt1} ${classes.pagescroll} ${classes.maxh75}`}>
        <FormBuilder
          formType={formType}
          setFormType={setFormType}
          data={quillData}
          setData={setQuillData}
          headerData={headerData}
          setHeaderData={setHeaderData}
          handleRemoveField={handleRemoveField}
          handleRemoveOption={handleRemoveOption}
        />
        <div
          className={`${classes.dflex} ${classes.justifyflexend} ${classes.mt1}`}
        >
          <Button
            className={`${classes.custombtnoutline}`}
            onClick={handleClose}
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
};

export default EditInputForm;
