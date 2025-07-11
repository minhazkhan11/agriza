import React, { useState } from "react";
import FormBuilder from "../GoogleFormBuilder";
import useStyles from "../../../../../styles";
import { Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { decryptData } from "../../../../../crypto";

const InputForm = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const handleClose = () => {
    navigate("/agriza-form-list");
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

  const handleRemoveField = async (idToRemove) => {
    setQuillData((prevState) =>
      prevState.filter((val) => val.id !== idToRemove)
    );
  };
  const handleRemoveOption = async (elId, optionId) => {
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
  };

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
          title: headerData.form_title,
          description: headerData.form_description,
          fields: quillData.map((data, index) => {
            const formattedData = {
              label: data?.value,
              type: data?.type,
              required: data?.required,
            };
            if (data?.type === "radio" || data?.type === "checkbox") {
              formattedData.options = data?.options?.map((opt, i) => {
                return {
                  option: opt?.value,
                };
              });
            }
            return formattedData;
          }),
        },
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/marketing/forms/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Form Created Successfully");

        setTimeout(() => {
          navigate("/agriza-form-list");
        }, 1000);
      } else {
        console.error("Error:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.message);
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

export default InputForm;
