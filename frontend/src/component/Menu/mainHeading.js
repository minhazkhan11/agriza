import { ReactComponent as Dashboard } from "../images/mainheadingicon/dashboard.svg";
import { ReactComponent as Learner } from "../images/mainheadingicon/learner.svg";
import { ReactComponent as Teacher } from "../images/mainheadingicon/teacher.svg";
import { ReactComponent as Exam } from "../images/mainheadingicon/exam.svg";
import { ReactComponent as DoubtForum } from "../images/mainheadingicon/doubtforum.svg";
import { ReactComponent as Marketing } from "../images/mainheadingicon/marketing.svg";
import { ReactComponent as Settings } from "../images/mainheadingicon/setting.svg";
import { ReactComponent as ReportIcon } from "../images/mainheadingicon/reports.svg";
import { ReactComponent as Master } from "../images/mainheadingicon/master.svg";
import { ReactComponent as Ellipse } from "../images/mainheadingicon/ellipse.svg";
import { ReactComponent as Content } from "../images/mainheadingicon/content.svg";
import { ReactComponent as ContentPublication } from "../images/mainheadingicon/contentpublication.svg";
import { ReactComponent as KaroManage } from "../images/mainheadingicon/karomanage.svg";
import { ReactComponent as CoachingIcon } from "../images/mainheadingicon/coaching.svg";
import { ReactComponent as TimeTableIcon } from "../images/mainheadingicon/timetable.svg";
import { ReactComponent as FeedbackIcon } from "../images/mainheadingicon/feedback.svg";
import { ReactComponent as UpgradeIcon } from "../images/mainheadingicon/upgrade.svg";
import { ReactComponent as BookIcon } from "../images/mainheadingicon/book.svg";
import { ReactComponent as WalletIcon } from "../images/mainheadingicon/wallet.svg";
import { ReactComponent as SettlementIcon } from "../images/mainheadingicon/settlementicon.svg";

const MainHeading = [
  {
    id: "dashboard",
    type: "link",
    name: "Dashboard",
    icon: <Dashboard />,
    to: "/admin/dashboard",
  },
  {
    id: "master",
    type: "dropdown",
    name: "Master",
    icon: <Master />,
    menu: [
      {
        name: "Courses",
        to: "/admin/courses",
      },
      {
        name: "Batch",
        to: "/admin/batch",
      },
      {
        name: "Subject",
        to: "/admin/subject",
      },
    ],
  },
  {
    id: "learner",
    type: "dropdown",
    name: "Learner",
    icon: <Learner />,
    menu: [
      {
        name: "Add Learner",
        to: "/admin/learner",
      },
      {
        name: "Assign Learner",
        to: "/admin/assignlearner",
      },
    ],
  },
  {
    id: "teacher",
    type: "dropdown",
    name: "Teacher",
    icon: <Teacher />,
    menu: [
      {
        name: "Add Teacher",
        to: "/admin/teacher",
      },
      {
        name: "Assign Teacher",
        to: "/admin/assignteacher",
      },
    ],
  },
  // {
  //   id: "coaching",
  //   type: "link",
  //   name: "Coaching",
  //   icon: <CoachingIcon />,
  //   to: "/admin/coaching",
  // },

  {
    id: "exam",
    type: "link",
    name: "Exam",
    icon: <Exam />,
    to: "/admin/exam",
  },
  {
    id: "content",
    type: "dropdown",
    name: "Content",
    icon: <Content />,
    menu: [
      // {
      //   name: "Quizz",
      //   to: "/admin/quizz",
      // },
      {
        name: "Test Series",
        to: "/admin/testseries",
      },
      // {
      //   name: "Books",
      //   to: "/admin/books",
      //   icon: <Ellipse />,
      // },
      {
        name: "Notes",
        to: "/admin/notes",
      },
      {
        name: "Ebooks",
        to: "/admin/ebooks",
      },
      {
        name: "Online Videos",
        to: "/admin/onlinevideos",
      },
      {
        name: "Live Classes",
        to: "/admin/liveclasses",
      },
    ],
  },
  {
    id: "books",
    type: "link",
    name: "Books",
    icon: <BookIcon />,
    to: "/admin/books",
  },
  {
    id: "contentpublication",
    type: "dropdown",
    name: "Content Publication",
    icon: <ContentPublication />,
    menu: [
      {
        name: "Published",
        to: "/admin/published",
      },
      {
        name: "Orders",
        to: "/admin/orders",
      },
    ],
  },
  {
    id: "wallet",
    type: "link",
    name: "Wallet",
    icon: <WalletIcon />,
    to: "/admin/wallet",
  },
  {
    id: "settlement",
    type: "link",
    name: "Settlement",
    icon: <SettlementIcon />,
    to: "/admin/settlement",
  },
  {
    id: "doubtforum",
    type: "link",
    name: "Doubt Forum",
    icon: <DoubtForum />,
    to: "/admin/doubtforum",
  },
  {
    id: "feedback",
    type: "link",
    name: "Feedback",
    icon: <FeedbackIcon />,
    to: "/admin/feedback",
  },
  {
    id: "timetable",
    type: "link",
    name: "Time Table",
    icon: <TimeTableIcon />,
    to: "/admin/timetable",
  },
  {
    id: "marketing",
    type: "dropdown",
    name: "Marketing",
    icon: <Marketing />,
    menu: [
      {
        name: "Text SMS",
        to: "/admin/textsms",
      },
      {
        name: "WhatsApp",
        to: "/admin/whatsapp",
      },
      {
        name: "Email",
        to: "/admin/email",
      },
      {
        name: "Telecaller",
        to: "/admin/telecaller",
      },
      {
        name: "Forms",
        to: "/admin/forms",
      },
    ],
  },
  {
    id: "design",
    type: "link",
    name: "Design",
    icon: <KaroManage />,
    to: "/admin/design",
  },
  {
    id: "karomanage",
    type: "link",
    name: "Karo Manage",
    icon: <KaroManage />,
    to: "/admin/karomanage",
  },
  {
    id: "reports",
    type: "link",
    name: "Reports",
    icon: <ReportIcon />,
    to: "/admin/reports",
  },
  {
    id: "upgrade",
    type: "link",
    name: "Upgrade",
    icon: <UpgradeIcon />,
    to: "/admin/upgrade",
  },
  {
    id: "settings",
    type: "link",
    name: "Settings",
    icon: <Settings />,
    to: "/admin/settings",
  },
];
export default MainHeading;
