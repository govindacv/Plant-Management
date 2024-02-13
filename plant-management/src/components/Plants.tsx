import { useNavigate } from "react-router-dom";
import "../styles/plants.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Plants = () => {
  const [plants, setPlants] = useState([]);
  useEffect(() => {
    axios.get(`https://localhost:44380/getplants`).then((response) => {
      console.log("hi");
       
      
      console.log(response.data);
      setPlants(response.data);
    });
  }, []);

  const navigate = useNavigate();

  const handleLogOutOnClick = () => {
    navigate("/login");
  };

  const handleAddPlantClick = () => {
    navigate("/addplant");
  };

  const handleEditClick = (plant: any) => {
    console.log(plant);
    navigate("/editplant", { state: { plant } });
  };

  const handleDeletePlant = (plantName: string) => {
    axios
      .post(`https://localhost:44380/deleteplant?plantName=${plantName}`)
      .then((response) => {
        setPlants(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="plants">
        <div className="plants--header">
          <div className="plants-add">
            <button onClick={handleAddPlantClick}>Add New Plant</button>
          </div>
          <div className="Logout">
            <button onClick={handleLogOutOnClick}>Log out</button>
          </div>
        </div>
        <div className="plant-detailsss">
          <div className="plant-details-heading">
            <h1> Plant Details</h1>
          </div>
          <div className="plant-details--grid">
            {plants.map((plant: any, index) => (
              <div key={index} className="individual-plant-details">
                <div className="plant-image">
                   
                  <img
                    src={plant.PLANTPHOTO}
                    alt={plant.PLANTNAME}
                  />
                </div>
                <hr />
                <div className="plant-details-name">
                  Plant Name: {plant.PLANTNAME}
                </div>
                <div className="plant-details-address">
                  Plant address: {plant.PLANTCITY}, {plant.PLANTSTATE},{" "}
                  {plant.PLANTCOUNTRY}
                </div>
                <div className="plant-details-warehouse">
                  Is Warehouse: {plant.ISWAREHOUSE}
                </div>
                <div className="plant-details-phonenumber">
                  Phone Number: {plant.PHONENUMBER}
                </div>
                <div className="plant-details-edit">
                  <button onClick={() => handleEditClick(plant)}>Edit</button>
                </div>
                <div className="plant-details-delete">
                  <button onClick={() => handleDeletePlant(plant.PLANTNAME)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plants;
