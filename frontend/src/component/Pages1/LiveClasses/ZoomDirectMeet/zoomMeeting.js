import React, { useEffect, useState } from "react";
import { decryptData } from "../../../../crypto";
import axios from "axios";

function ZoomMeeting() {
  const [accessToken, setAccessToken] = useState("");
  const [authCode, setAuthCode] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const getAccessToken = async () => {
    const data = {
      zoom: {
        code: "JSOdIwOTEyaxiP4gr-3QwmidgmZozPtew",
        userId: 1143,
      },
    };

    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/v1/b2b/zoomus/token`, data, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("response", response);
        setAccessToken(response.access_token);
      })
      .catch((error) => {
        console.log("Batch is not created", error);
      });
  };
  useEffect(() => {
    getAccessToken();
  }, [authCode]);

  const startMeeting = async () => {
    
  };

  return (
    <div>
      <button onClick={startMeeting}>Start Meeting</button>
    </div>
  );
}

export default ZoomMeeting;
