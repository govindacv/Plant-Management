import { useLocation, useNavigate } from "react-router-dom";
import "../styles/XLSXDataDisplay.css";
import { useState } from "react";
import axios from "axios";

const XLSXDataDisplay = () => {
  const [xlsxData, setXlsxData] = useState([]);
  const location = useLocation();
  const navigate=useNavigate();
  useState(() => {
    setXlsxData(location.state);
  }, [location.state]);

  const handleOnClick = () => {
    console.log(xlsxData);
    console.log(xlxlPlantName);

    axios.post(`https://localhost:44380/tocheckifplantnamealreadyexist`,xlxlPlantName).then((response)=>{
      if(response.data > 0)
      {
        axios
      .post(`https://localhost:44380/xlsxupload`, xlsxData)
      .then((response) => {
        console.log(response);
        alert("Inserted sucess fully")
        navigate('/plants')
      })
      .catch((error) => {
        console.log(error);
      });
      }
      else
      {
        alert("Please Use different plant Name ")
        navigate('/addplant')
      }
    })
  };

  // Convert xlsxData array into a list of objects
  const xlsxDataList = xlsxData.map((plant:any, index) => ({
    key: index,
    PlantName: plant.PlantName,
    IsWarehouse: plant.IsWarehouse,
    Country: plant.Country,
    State: plant.State,
    City: plant.City,
    IsTransportationAvailable: plant.IsTransportationAvailable,
    TransporterName: plant.TransporterName,
    PhoneNumber: plant.PhoneNumber,
  }));

  const xlxlPlantName = xlsxData.map((plant:any, index) => ({
    PlantName: plant.PlantName,
  }));

  return (
    <>
      <div className="xlsx">
        <div className="xlsx-table">
          <div className="plants--header">
            <div className="plants-add">
              <button onClick={handleOnClick} id="uploadXlxs">
                Upload
              </button>
            </div>
          </div>
          <div className="xlxl-h3details">
            <h3>Plant Details</h3>
          </div>
          <table id="xlpreview" border={1}>
            <thead>
              <tr>
                <th>Plant Name</th>
                <th>Warehouse</th>
                <th>Country</th>
                <th>State</th>
                <th>City</th>
                <th>Transportation Available?</th>
                <th>Transporter Name</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {xlsxDataList.map((plant) => (
                <tr key={plant.key}>
                  <td>{plant.PlantName}</td>
                  <td>{plant.IsWarehouse}</td>
                  <td>{plant.Country}</td>
                  <td>{plant.State}</td>
                  <td>{plant.City}</td>
                  <td>{plant.IsTransportationAvailable}</td>
                  <td>{plant.TransporterName}</td>
                  <td>{plant.PhoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default XLSXDataDisplay;
