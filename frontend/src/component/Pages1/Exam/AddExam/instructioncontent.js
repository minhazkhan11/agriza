const content = {
  en: [
    {
      superhead: "Please read the instructions carefully",
      genhead: " General Instructions:",
      rednote:"Please note all questions will appear in your default language. This language can be changed for a particular question later on.",
      agreement:"I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare tha prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.I agree the debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations",
      gencont: [
        {
          id: 1,
          title:
            "The clock will be set at the server. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You will not be required to end or submit your examination.",
        },
        {
          id: 2,
          title:
            "The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:",
          children: [
              { title: "You have not visited the question yet" },
              { title: "You have not answered the question" },
              { title: "You have answered the question" },
              { title: "You have NOT answered the question, but have marked the question for review.",},
              { title: "The question(s) 'Answered and Marked for Review' will be considered for evaluation",},
            ],
        },
        {
          id: 3,
          title:
            "The Marked for Review status for a question simply indicates that you would like to look at that question again.",
        },
        {
          id: 4,
          title:
            "You can click on the ' > ' arrow which appears to the left of question palette to collapse the question palette thereby maximizing the question window. To view the question palette again, you can click on ' < ' which appears on the right side of question window",
        },
        {
          id: 5,
          title:
            "You can click on your 'Profile' image on top right corner of your screen to change the language during the exam for entire question paper. On clicking of Profile image you will get a drop-down to change the question content to the desired language.",
        },
      ],
    },
  ], // English content
  hi: [
    {
      superhead: "कृपया ध्यानपूर्वक निर्देश पढ़ें",
      genhead: "सामान्य निर्देश:",
      rednote:"कृपया ध्यान दें, सभी प्रश्न आपकी डिफ़ॉल्ट भाषा में प्रदर्शित होंगे। इस भाषा को बाद में किसी विशेष प्रश्न के लिए बदला जा सकता है।",
      agreement:"मैंने निर्देशों को पढ़ा और समझ लिया है। मेरे पास मुझे आवंटित किए गए कंप्यूटर हार्डवेयर सही कार्यक्षमता में हैं। मैं यह घोषणा करता हूँ कि मेरे पास प्रतिबंधित गैजेट जैसे मोबाइल फोन, ब्लूटूथ उपकरण आदि / किसी भी प्रतिबंधित सामग्री के साथ परीक्षा हॉल में नहीं हैं। मैं सहमत हूँ कि इस परीक्षा से मुझे निषिद्ध किया जाएगा और / या अनुशासनात्मक कार्रवाई की जा सकती है, जिसमें भविष्य की परीक्षाओं / परीक्षाओं से प्रतिबंध लगाना शामिल हो सकता है।",
      gencont: [
        {
          id: 1,
          title:"सर्वर पर समय सेट किया जाएगा। स्क्रीन के शीर्ष दाहिने कोने में बचे हुए समय को दिखाने वाला टाइमर परीक्षा पूरा करने के लिए उपलब्ध समय की गणना करेगा। टाइमर शून्य को पहुंचते ही, परीक्षा स्वयं ही समाप्त हो जाएगी। आपको परीक्षा समाप्त करने या जमा करने की आवश्यकता नहीं होगी।",
        },
        {
          id: 2,
          title:"स्क्रीन के दाईं ओर प्रदर्शित क्वेश्चन पैलेट में एक संकेत का उपयोग करके प्रत्येक प्रश्न की स्थिति दिखाई जाएगी।",
      
          children: [
            { title: "आपने अभी तक प्रश्न को देखा नहीं है।" },
            { title: "आपने प्रश्न का उत्तर नहीं दिया है।" },
            { title: "आपने प्रश्न का उत्तर दिया है।" },
            { title: "आपने प्रश्न का उत्तर नहीं दिया है, लेकिन आपने प्रश्न को समीक्षा के लिए चिह्नित किया है।",},
            {title: "प्रश्नों (जिनका उत्तर दिया गया है और समीक्षा के लिए चिह्नित किया गया है) को मूल्यांकन के लिए विचार में लिया जाएगा।",},
          ],
        },
        {
          id: 3,
          title:"एक प्रश्न के लिए 'पुनः देखें' स्थिति बस इसका संकेत देती है कि आप उस प्रश्न को फिर से देखना चाहेंगे।",
      
        },
        {
          id: 4,
          title:"आप प्रश्न पालेट के बाईं ओर आने वाले ' > ' तीर को क्लिक करके प्रश्न पालेट को संकुचित कर सकते हैं, जिससे प्रश्न विंडो को बड़ा कर सकते हैं। पुनः प्रश्न पालेट को देखने के लिए, आप प्रश्न विंडो के दाएं ओर आने वाले ' < ' पर क्लिक कर सकते हैं।",
      
        },
        {
          id: 5,
          title:"परीक्षा के दौरान पूरे प्रश्न पत्र के लिए भाषा बदलने के लिए, स्क्रीन के शीर्ष दाहिने कोने पर अपनी 'प्रोफ़ाइल' छवि पर क्लिक करें। 'प्रोफ़ाइल' छवि पर क्लिक करने पर, आपको चयनित भाषा में प्रश्न सामग्री को बदलने के लिए एक ड्रॉप-डाउन मिलेगा।",
      
        },
      ],
    },
  ], // Hindi content
 
};

export default content; 
