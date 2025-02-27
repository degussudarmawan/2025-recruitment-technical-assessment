import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import SearchIcon from "@mui/icons-material/Search";
import WindowIcon from "@mui/icons-material/Window";
import MapIcon from "@mui/icons-material/Map";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Textarea from "@mui/joy/Textarea";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterListIcon from "@mui/icons-material/FilterList";
import "./App.css";
import { ReactNode } from "react";
import buildings from "../data.json";

interface ContainerProps {
  children: ReactNode;
}

interface ContainerRectangularProps {
  children: ReactNode;
  text: string;
}

interface ImageContainerProps {
  name: string;
  availability: number;
  src: string;
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="h-[60px] w-screen flex border-b-solid border-b-1 border-b-gray-200 items-center gap-2 px-[10px]">
      <img
        className="h-[40px] w-[30px] object-cover"
        src={
          isOpen
            ? "../assets/freeRoomsLogo.png"
            : "../assets/freeRoomsDoorClosed.png"
        }
        onClick={() => setIsOpen(!isOpen)}
        alt="freerooms-logo"
      />
      <div className="flex-auto sm:hidden"></div>
      <div className="hidden sm:block flex-auto font-bold text-xl text-orange-400">
        Freerooms
      </div>
      <Container>
        <SearchIcon />
      </Container>
      <Container>
        <WindowIcon />
      </Container>
      <Container>
        <MapIcon />
      </Container>
      <Container>
        <DarkModeIcon />
      </Container>
    </div>
  );
};

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div
      className="h-[40px] w-[40px] hover:bg-orange-400 text-orange-400 hover:text-white text-xs
    flex items-center justify-center border-solid rounded-md border-1 border-orange-400 p-1"
    >
      {children}
    </div>
  );
};

const SearchBar = () => {
  return (
    <div className="w-full sm:w-[50%] h-[42px] flex border-solid rounded-sm border-1 border-gray-200 items-center pl-2 text-gray-500">
      <SearchIcon className="flex-grow" />
      <Textarea
        name="Plain"
        placeholder="Search for a building"
        variant="plain"
        className="h-full w-full p-none"
      />
    </div>
  );
};

const ContainerRectangle: React.FC<ContainerRectangularProps> = ({
  children,
  text,
}) => {
  return (
    <div
      className="h-[42px] hover:bg-orange-400 text-orange-400 hover:text-white gap-1
    flex items-center justify-center border-solid rounded-md border-2 border-orange-400 px-3"
    >
      {children}
      <div>{text}</div>
    </div>
  );
};

const ImageContainer: React.FC<ImageContainerProps> = ({
  name,
  availability,
  src,
}) => {
  console.log(src);
  return (
    <div className="relative max-h-[100px] sm:max-h-full bg-white rounded-md overflow-hidden">
      <img src={src} alt={name} className="sm:h-full sm:object-cover" />
      <div className="absolute top-[40%] flex items-center sm:top-2 right-[2.5%] bg-white text-black text-xs px-2 py-1 rounded-md shadow-md">
        <div className="w-2 h-2 bg-green-500 text-tiny rounded-full mr-2"></div>
        {availability}
        <div className="hidden sm:block sm:pl-[3px]"> rooms available</div>
        <div className="sm:hidden block pl-[3px]">{"/ " + availability}</div>
      </div>
      <div className="absolute bottom-[40%] sm:bottom-2 sm:left-[2.5%] sm:w-[95%] sm:bg-orange-500 text-xs text-white px-2 py-2 rounded-md">
        {name}
      </div>
    </div>
  );
};

function App() {
  return (
    <>
      <div className="w-screen">
        <Header />
        <div className="hidden sm:flex flex mt-3 px-[10px]">
          <ContainerRectangle text={"Filter"}>
            <FilterAltIcon />
          </ContainerRectangle>
          <div className="flex-auto flex content-center justify-center items-center">
            <SearchBar />
          </div>
          <ContainerRectangle text={"Sort"}>
            <FilterListIcon />
          </ContainerRectangle>
        </div>
        <div className="sm:hidden px-[10px] mt-3">
          <div className="flex-auto mb-3 flex content-center justify-center items-center">
            <SearchBar />
          </div>
          <div className="flex">
            <ContainerRectangle text={"Filter"}>
              <FilterAltIcon />
            </ContainerRectangle>
            <div className="flex-auto"></div>
            <ContainerRectangle text={"Sort"}>
              <FilterListIcon />
            </ContainerRectangle>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-max gap-[10px] p-3">
          {buildings.map((building) => (
            <ImageContainer
              key={building.name}
              name={building.name}
              availability={building.rooms_available}
              src={`../assets/${building.building_picture?.replace("./", "")}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
