import { decryptData } from "../crypto";
import { UpgradePlan, getRZPKey } from "../service/services";
import { toast } from "react-toastify";

const makePayment = async (
  data,
  token // in INR
) => {
  try {
    const keyRes = await getRZPKey();
    const {
      status,
      data: { key },
    } = keyRes || {};
    if (status !== 200) return;

    UpgradePlan({ ...data }, token)
      .then((res) => {
        const {
          data: {
            order: {
              id,
              amount,
              currency,
              customer_id,
              business_name,
              business_logo,
              callback_url,
              product_description,
              customer_detail,
              notes,
              razorpayModalTheme = "#121212",
            },
          },
        } = res || {};
        const options = {
          key,
          amount,
          currency,
          order_id: id,
          name: business_name,
          image: business_logo,
          description: product_description,
          callback_url, //makhan
          prefill: customer_detail,
          customer_id,
          notes,
          theme: {
            color: razorpayModalTheme,
          },
        };
        const razor = new window.Razorpay(options);
        razor.open();
      })
      .catch((e) => {
        if (
          e?.response?.data?.message ===
          "Invalid or expired token. Please refresh your session."
        ) {
          localStorage.clear();
          window.location.reload();
        } else {
          toast.error(e.response.data.message || "Error", { autoClose: 1000 });
          console.error('Error in createOrder API:', e.response.data.message);
        }
      });
  } catch (e) {
    return e;
  }
};

export default makePayment;
