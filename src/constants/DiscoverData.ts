import { Images } from "assets/images";

const DiscoverData = [
  {
    id: 1,
    name: "Events",
    icon: Images.video,
    leftAerrowIcon: Images.arrowRight,
    route: "Events",
  },
  {
    id: 2,
    name: "Scan",
    icon: Images.scan,
    leftAerrowIcon: Images.arrowRight,
    route: "QRCodeScanScreen",
  },
  {
    id: 3,
    name: "Shake",
    icon: Images.shake,
    leftAerrowIcon: Images.arrowRight,
    route: "",
  },
  {
    id: 4,
    name: "Search",
    icon: Images.SearchNew,
    leftAerrowIcon: Images.arrowRight,
    route: "",
  },

  {
    id: 5,
    name: "Find People Nearby",
    icon: Images.translation,
    leftAerrowIcon: Images.arrowRight,
    route: "PeopleNearby",
  },
];

export default DiscoverData;
