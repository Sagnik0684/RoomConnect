import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../../components/searchBar/searchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";

function HomePage() {
  // const {currentUser} = useContext(AuthContext);
  // console.log(currentUser);

  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.from === "about") {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <>
      <div className="homePage">
        <div className="textContainer">
          <div className="textBackgroundWrapper">
            <h1 className="title">Find Your Roommate or Rent a Room</h1>
            <div className="searchBarWrapper">
              <SearchBar />
            </div>
          </div>
        </div>

        <div className="imgContainer">
          <img src="/bg.png" alt="" />
        </div>
      </div>

      <div className="aboutContainer">
        <div id="about" className="aboutSection">
          <h2>About RoomConnect</h2>
          <p>
            RoomConnect is a full-featured platform that connects roommates
            and property seekers with verified listings. We provide real-time
            communication, trusted property data, and seamless user experience.
          </p>

          <p>
            Our team has extensive experience in the real estate and tech industry,
            aiming to simplify the process of finding the perfect living arrangement.
          </p>

          <p>
            Using the latest technologies like Node.js, React, Vite, and Socket.IO,
            we ensure a fast, responsive, and interactive platform for all users.
          </p>

          <div className="boxes">
            <div className="box">
              <h1>16+</h1>
              <h2>Years of Experience</h2>
            </div>
            <div className="box">
              <h1>200</h1>
              <h2>Award Gained</h2>
            </div>
            <div className="box">
              <h1>2000+</h1>
              <h2>Property Ready</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
