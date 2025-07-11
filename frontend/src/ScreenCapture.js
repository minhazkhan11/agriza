import React, { useEffect } from "react";

function ScreenCapture() {
  useEffect(() => {
    let mediaRecorder;
    let chunks = [];

    const startCapture = async () => {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { mediaSource: "screen" },
          audio: false,
        });

        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = "screen_recording.webm";
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        };

        mediaRecorder.start();

        // Automatically stop recording after 30 seconds
        setTimeout(() => {
          mediaRecorder.stop();
          stream.getTracks().forEach((track) => track.stop());
        }, 30000); // 30,000 milliseconds = 30 seconds

      } catch (err) {
        console.error("Error capturing screen:", err);
      }
    };

    startCapture();
  }, []);

  return null; // No UI
}

export default ScreenCapture;
