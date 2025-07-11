import React, { useState } from "react";
import { ZoomMtg } from "@zoom/meetingsdk";
import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";

import { decryptData } from "../../../../crypto";
import axios from "axios";
import { useEffect } from "react";

// ZoomMtg.preLoadWasm()
// ZoomMtg.prepareWebSDK()

// // loads language files, also passes any error messages to the ui
// ZoomMtg.i18n.load('en-US')

const ZoomMeeting = () => {
  const [meetingNumber, setMeetingNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const client = ZoomMtgEmbedded.createClient();

  // const getAccessToken = async() => {
  // const startMeeting = async() => {

  //   const data = {
  //     zoom: {
  //       code: "JSOdIwOTEyaxiP4gr-3QwmidgmZozPtew",
  //       userId: 1143,
  //     },
  //   };

  //   axios
  //     .post(`${process.env.REACT_APP_API_BASE_URL}/v1/b2b/zoomus/token`,
  //      data, {
  //       headers: {
  //         Authorization: `Bearer ${decryptedToken}`,
  //         'Content-Type': 'application/json',
  //       },
  //     })
  //     .then((response) => {
  //       console.log("response", response);
  //     })
  //     .catch((error) => {
  //       console.log("Batch is not created", error);
  //     });
  // };

  // useEffect(() => {
  //   startMeeting();
  // }, [])


  const startMeeting = async () => {
    ZoomMtg.init({
      leaveUrl: "http://localhost:3000/admin/zoom",
      patchJsMedia: true,
      success: (success) => {
        console.log("initsuccess",success);
        ZoomMtg.join({
          signature: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZGtLZXkiOiI5QW5DakJTWVF1aUE0WWc3Rk1qeTVnIiwiYXBwS2V5IjoiOUFuQ2pCU1lRdWlBNFlnN0ZNank1ZyIsIm1uIjo3NjM4MjczNzMzMywicm9sZSI6MSwiaWF0IjoxNzE0OTg5MDAwLCJleHAiOjE3MTQ5OTYyMDAsInRva2VuRXhwIjoxNzE0OTk2MjAwfQ.LyLJhbYOmlvdyXUiAalFQbl1vJrpDStasptvrQKsp2Y",
          meetingNumber: "76382737333",
          userName: "Mohit",
          appKey: "9AnCjBSYQuiA4Yg7FMjy5g",
          userEmail: "aanjne.mohit@gmail.com",
          passWord: "BFzTL1",
          success: (success) => {
            console.log("success", success);
          },
          error: (error) => {
            console.log("joinerror", error);
          },
        });
      },
      error: (error) => {
        console.log("initerror", error);
      },
    });
  };

  return (
    <div>
      <button onClick={startMeeting}>Start Meeting</button>

      <div id="meetingSDKElement">{/* Zoom Meeting SDK Rendered Here  */}</div>
    </div>
  );
};

export default ZoomMeeting;
