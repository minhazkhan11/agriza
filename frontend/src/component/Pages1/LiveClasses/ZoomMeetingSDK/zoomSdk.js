import React, { useState, useEffect } from "react";
import { ZoomMtg } from "@zoom/meetingsdk";
import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";
import { decryptData } from "../../../../crypto";
import axios from "axios";

const ZoomMeeting = () => {
  const [meetingNumber, setMeetingNumber] = useState("");
  const [userName, setUserName] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  useEffect(() => {
    
    const client = ZoomMtgEmbedded.createClient();
    const meetingSDKElement = document.getElementById("meetingSDKElement");

    client.init({ zoomAppRoot: meetingSDKElement, language: "en-US" });

    return () => {
      // Clean up Zoom SDK client resources
      // For example, disconnect from the meeting, release any resources, etc.
      // client.destroy(); // Uncomment if destroy method is available
    };
  }, []);

  const startMeeting = async () => {
    // Fetch signature from server or use your decryption logic
    const signature = "cVZ5T29mVkFSV2VFbVA4UFpqWnBIUS43NDc4NzczNTA0OC4xNzE1MDE0ODA0ODk4LjEucVc2YWJWRjNCNWNxU2R1dWpDREdsR0lxUktENnBQOWhUMXkyMnVwMTR0cz0="; // Fetch or decrypt signature here

    const client = ZoomMtgEmbedded.createClient();
    client.join({
      sdkKey: "7AHi1UybR2mLykENSaJQmQ",
      signature,
      meetingNumber: "74787735048",
      password: "v2Wm10",
      userName: "aanjne.mohit@gmail.com",
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
