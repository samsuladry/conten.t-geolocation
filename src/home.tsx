import React, { useEffect, useState, useRef, useCallback } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import "./App.css";
import { app } from "./firebase";

type Props = {};

const Home: React.FC<Props> = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GMAP_API_KEY || "", 
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), (user) => {
      console.log(user);
      if (!user) {
        navigate("/login");
      } else {
        setUser(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  const handleSignOutClick = () => {
    const auth = getAuth(app);
    auth.signOut().then(() => navigate("/login"));
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting user location: ", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser");
    }
  };

  const mapRef = useRef<google.maps.Map | null>(null);
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  return (
    <div>
      <div>
        <button onClick={handleSignOutClick}>Sign out</button>
      </div>

      <div>
        <h1>Conten.t Geolocation App</h1>
        <button onClick={getUserLocation}>Get User Location</button>
        {userLocation ? (
          <div>
            <h2>User Location</h2>
            <p>Latitude: {userLocation.lat}</p>
            <p>Longitude: {userLocation.lng}</p>

            <GoogleMap
              mapContainerStyle={{
                height: "400px",
                width: "100%",
              }}
              center={userLocation}
              zoom={13}
              onLoad={onMapLoad}
            >
              <MarkerF
                position={userLocation}
                icon={"http://maps.google.com/mapfiles/ms/icons/green-dot.png"}
              />
            </GoogleMap>
          </div>
        ) : loadError ? (
          <p>Error loading maps</p>
        ): ( <p></p> )
      }
      </div>
    </div>
  );
};

export default Home;
