import MediaManagement from "./icons/MediaManagement";
import Business from "./icons/Business";
import DigitalShelf from "./icons/DigitalShelf";
import ProductInfo from "./icons/ProductInfo";
import HomeIcon from "./icons/HomeIcon";


export const navList = [

  {
    id: 5,
    staticPageURL: "/dashboard",
    title: "Dashboard",
    icon: HomeIcon,
    // lock: false
    lock: false,
    disable: true,
    bottomNavType: true,
    externalRedirect: false,
    dsNavType: false,
  },
  {
    id: 6,
    staticPageURL: "/project-configuration",
    title: "Project Configuration",
    icon: "far fa fa-bars",
    // lock: false
    lock: false,
    disable: true,
    bottomNavType: true,
    externalRedirect: true,
    dsNavType: false,
  },
  // {
  //   id: 7,
  //   staticPageURL: "/ebux/reports/image_accuracy",
  //   title: "Image Accurcay",
  //   icon: "far fa-thin fa-image",
  //   // lock: false
  //   lock: false,
  //   disable: true,
  //   bottomNavType: true,
  //   externalRedirect: false,
  //   dsNavType: false,
  // },
  {
    id: 8,
    staticPageURL: "/tagManager",
    title: "Tag Manager",
    icon: "far fa-tag",
    // lock: false
    lock: false,
    disable: true,
    bottomNavType: true,
    externalRedirect: false,
    dsNavType: false,
  },
  {
    id: 2,
    staticPageURL: "dsm",
    title: "Digital Shelf Management",
    icon: DigitalShelf,
    // lock: false
    lock: true,
    disable: true,
    bottomNavType: false,
    externalRedirect: false,
    dsNavType: true,
  },
  {
    id: 1,
    staticPageURL: "mam",
    title: "Media Automation Management",
    icon: MediaManagement,
    // lock: false
    lock: true,
    disable: true,
    bottomNavType: false,
    externalRedirect: false,
    dsNavType: true,
  },


  {
    id: 3,
    staticPageURL: "pim",
    title: "Product Information Management",
    icon: ProductInfo,
    // lock: false
    lock: true,
    disable: true,
    bottomNavType: false,
    externalRedirect: false,
    dsNavType: true,
  },
  {
    id: 4,
    // staticPageURL:"bm",
    staticPageURL: "",
    title: "Business Monitoring",
    icon: Business,
    // lock: false
    lock: true,
    disable: true,
    bottomNavType: false,
    externalRedirect: false,
    dsNavType: true,
  },
];