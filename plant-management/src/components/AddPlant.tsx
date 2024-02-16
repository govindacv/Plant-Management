import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "../styles/AddPlant.css";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

interface Country {
  countryName: string;
}

interface State {
  stateName: string;
}

interface City {
  cityName: string;
}

const AddPlant = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [transportationAvailable, setTransportationAvailable] =
    useState<boolean>(false);
  const [transporterName, setTransporterName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isValidPlantName, setIsValidPlantName] = useState(true);
  const [fileSelected, setFileSelected] = useState([]);

  const [isWarehouseValue, setIsWarehouseValue] = useState<string | null>(null);
  const [isValidWarehouseChoice, setIsValidWarehouseChoice] = useState(true);

  const [isValidCountry, setIsValidCountry] = useState(true);
  const plantNamRef = useRef<HTMLInputElement | null>(null);
  const [selectedState, setSelectedState] = useState<string>("");
  const [isValidState, setIsValidState] = useState(true);
  const [selectCity, setSelectedCity] = useState<string>("");
  const [isValidCity, setIsValidCity] = useState(true);
  const [isValidTransporterName, setIsValidTransporterName] = useState(true);

  const [isValidPhoneNumber, setIsvalidPhoneNumber] = useState(true);
  const PhoneNumberRef = useRef<HTMLInputElement | null>(null);
  const [isValidPlantNameFromServer, SetIsValidPlantNameFromServer] =
    useState(true);
  const navigate = useNavigate();

  const handleOnBlurPhoneNumber = () => {
    if (PhoneNumberRef.current?.value) {
      const inputNumber = PhoneNumberRef.current.value;
      const regex = /^[0-9]{10}$/;
      setIsvalidPhoneNumber(regex.test(inputNumber));
    }
  };

  useEffect(() => {
    console.log("hi");

    axios
      .get(`https://localhost:44380/getcountries`)
      .then((response) => {
        console.log(response.data);
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  const handleOnBlurTransporterName = () => {
    if (transporterName != "") {
      const plantNameRegex = /^[a-zA-Z0-9]{3,20}$/;
      setIsValidTransporterName(plantNameRegex.test(transporterName));
    }
  };
  const handleCountryChange = (value: string) => {
    setIsValidCountry(true);
    setSelectedCountry(value);

    axios
      .get(`https://localhost:44380/getstates/${value}`)
      .then((response: any) => {
        console.log(response.data);
        setStates(response.data);
      })
      .catch((error) => {
        console.error("Error fetching states:", error);
      });
  };

  const handleStateChange = (value: any) => {
    setIsValidState(true);
    setSelectedState(value);
    axios
      .get(`https://localhost:44380/getcities/${value}`)
      .then((response: any) => {
        console.log(response.data);
        setCities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
      });
  };

  const handleTransportationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTransportationAvailable(e.target.checked);
  };

  const handleTransporterNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTransporterName(e.target.value);
  };

  const handlePlantPhotoChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log(e.target.files);

      const files = Array.from(e.target.files);

      const validFiles = files.filter((file: any) => {
        return (
          (file.type === "image/jpeg" || file.type === "application/pdf") &&
          file.size <= 50000000
        );
      });

      if (validFiles.length === files.length) {
        // Concatenate the new files with the existing files
        setFileSelected((prevFiles) => [...prevFiles, ...validFiles]);
        console.log(fileSelected);
      } else {
        alert(
          "Some files are invalid. Please only select JPG and PDF files with size less than or equal to 50KB."
        );
      }
    }
  };

  const handlePlantNameFocus = () => {
    setIsValidPlantName(true);
    SetIsValidPlantNameFromServer(true);
  };

  const handlePlantNameBlur = () => {
    if (plantNamRef.current?.value) {
      const inputPlantName = plantNamRef.current.value;
      const plantNameRegex = /^[a-zA-Z0-9 ]{3,20}$/;

      setIsValidPlantName(plantNameRegex.test(inputPlantName));
    }
  };

  const handleCityChange = (city: string) => {
    setIsValidCity(true);
    setSelectedCity(city);
  };
  const handleOnClickAdd = () => {
    if (isWarehouseValue == null) {
      setIsValidWarehouseChoice(false);
    }
    if (plantNamRef.current?.value == "") {
      setIsValidPlantName(false);
    }

    if (selectedCountry == "") {
      setIsValidCountry(false);
    }
    if (selectedState == "") {
      setIsValidState(false);
    }
    if (selectCity == "") {
      setIsValidCity(false);
    }
    if (PhoneNumberRef.current?.value == "") {
      console.log(phoneNumber);

      setIsvalidPhoneNumber(false);
    }
    console.log(fileSelected);

    if (
      plantNamRef.current?.value &&
      isValidPlantName &&
      isWarehouseValue != null &&
      isValidCountry &&
      isValidState &&
      isValidCity &&
      isValidPhoneNumber
    ) {
      console.log(plantNamRef.current.value);
      console.log(isWarehouseValue);
      console.log(selectedCountry);
      console.log(selectedState);
      console.log(selectCity);
      const transportationAvali = transportationAvailable ? "yes" : "No";
      console.log(transportationAvali);
      console.log(transporterName);
      const plantName = plantNamRef.current.value;
      const isWareHouse = isWarehouseValue;
      const country = selectedCountry;
      const state = selectedState;
      const city = selectCity;
      const isTransportationAvailable = transportationAvailable ? "yes" : "No";
      //pass transporte name directly
      const phoneNumber = PhoneNumberRef.current?.value;
      const plantPhoto = null;

      console.log(PhoneNumberRef.current?.value);
      axios
        .post(`https://localhost:44380/addplant`, {
          plantName: plantName,
          isWareHouse: isWareHouse,
          country: country,
          state: state,
          city: city,
          isTransportationAvailable: isTransportationAvailable,
          transporterName: transporterName,
          phoneNumber: phoneNumber,
          plantPhoto: plantPhoto,
        })
        .then((response) => {
          console.log(response.data);
          if (response.data > 0) {
            const formData = new FormData();
            if (fileSelected) {
              for (let i = 0; i < fileSelected.length; i++) {
                formData.append("formFiles", fileSelected[i]);
              }

              formData.append("plantName", response.data);
            }
            console.log(formData);
            console.log(response.data);

            axios
              .post(`https://localhost:44380/uploadimage`, formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((response) => {
                console.log(response.data);
              })
              .catch((error) => {
                console.log(error);
              });
            alert("Plant added");
            navigate(`/plants`);
          }
          if (response.data == 0) {
            SetIsValidPlantNameFromServer(false);
          }
        });
    }
  };

  //to download excel format
  const handleDownloadExcelFormat = () => {
    const workbook = XLSX.utils.book_new();

    // Generate Excel template data
    const templateData = generateExcelTemplate();

    // Add worksheet to the workbook
    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Plant Template");

    // Write the workbook to a file
    XLSX.writeFile(workbook, "plant_template.xlsx");
  };

  // Function to generate Excel template data
  const generateExcelTemplate = () => {
    const headers = [
      "Plant Name",
      "Is Warehouse",
      "Country",
      "State",
      "City",
      "Is Transportation Available",
      "Transporter Name",
      "Phone Number",
      "Plant Photo",
    ];

    return [headers];
  };

  //to handle EXCEL upload
  const fileInputRef = useRef(null);

  const handleExcelUpload = () => {
    console.log('1');
    
    fileInputRef.current.click(); 
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];  
     console.log("Uploaded file:", file);
  };
  return (
    <div>
      <div className="plants--header">
        <div className="plants-add">
          <button onClick={handleDownloadExcelFormat}>
            Download excel template
          </button>
        </div>

        <div className="Logout">
          <button onClick={handleExcelUpload}>Excel Upload</button>
          <input
            type="file"
            accept=".xlsx, .xls" // Specify accepted file types
            ref={fileInputRef} // Reference to hidden file input
            style={{ display: "none" }} // Hide the file input
            onChange={handleFileSelect} // Call the function when a file is selected
          />
        </div>
      </div>
      <div className="addPlant">
        <div className="addplant-message">
          <h1>Add Plant</h1>
        </div>
        <div className="plant-details">
          <div className="plant-Name">
            <div className="p-name">
              <h3>Plant name</h3>
            </div>
            <div className="p-name-input">
              <input
                type="text"
                ref={plantNamRef}
                onBlur={handlePlantNameBlur}
                onFocus={handlePlantNameFocus}
              />
              {!isValidPlantName && (
                <p className="error-message">Invalid Plant Name</p>
              )}
              {!isValidPlantNameFromServer && (
                <p className="error-message">Please use different plant name</p>
              )}
            </div>
          </div>
          <div className="plant-warehouse">
            <div className="p-warehousehouse-name">
              <h3>Is Warehouse ? </h3>
            </div>

            <div className="p-warehouse-input1">
              Yes{" "}
              <input
                type="radio"
                name="warehouse"
                value="Yes"
                checked={isWarehouseValue === "Yes"}
                onClick={() => setIsValidWarehouseChoice(true)}
                onChange={(e) => setIsWarehouseValue(e.target.value)}
              />
            </div>
            <div className="p-warehouse-input2">
              No{" "}
              <input
                type="radio"
                name="warehouse"
                value="No"
                checked={isWarehouseValue === "No"}
                onClick={() => setIsValidWarehouseChoice(true)}
                onChange={(e) => setIsWarehouseValue(e.target.value)}
              />
            </div>
            {!isValidWarehouseChoice && (
              <p className="error-message-warehouse">Select yes or no </p>
            )}
          </div>
          <div className="plant-country">
            <div className="p-country-name">
              <h3>Country</h3>
            </div>
            <div className="p-country-dropdown">
              <select
                name="Select"
                onChange={(e) => handleCountryChange(e.target.value)}
              >
                <option value="">Select</option>
                {countries.map((country, index) => (
                  <option key={index} value={country.countryName}>
                    {country.countryName}
                  </option>
                ))}
              </select>
            </div>
            {!isValidCountry && (
              <p className="error-message-country">Select country </p>
            )}
          </div>
          <div className="plant-states">
            <div className="p-states-name">
              <h3>State</h3>
            </div>
            <div className="p-states-dropdown">
              <select
                name=""
                onChange={(e) => handleStateChange(e.target.value)}
              >
                <option value="">Select</option>
                {states.map((state, index) => (
                  <option key={index} value={state.stateName}>
                    {state.stateName}
                  </option>
                ))}
              </select>
            </div>
            {!isValidState && (
              <p className="error-message-state">Select State </p>
            )}
          </div>
          <div className="plant-cities">
            <div className="p-cities-name">
              <h3>City</h3>
            </div>
            <div className="p-cities-dropdown">
              <select
                name=""
                onChange={(e) => handleCityChange(e.target.value)}
              >
                <option value="">Select</option>
                {cities.map((city, index) => (
                  <option key={index} value={city.cityName}>
                    {city.cityName}
                  </option>
                ))}
              </select>
            </div>
            {!isValidCity && <p className="error-message-city">Select city </p>}
          </div>
          <div className="plant-transportation">
            <div className="p-transportation-name">
              <h3>Transportation Available</h3>
            </div>
            <div className="p-transportation-checkbox">
              <input
                type="checkbox"
                checked={transportationAvailable}
                onChange={handleTransportationChange}
              />
            </div>
          </div>
          {transportationAvailable && (
            <div className="plant-transporterName">
              <div className="p-transporter-name">
                <h3>Transporter Name</h3>
              </div>
              <div className="p-transporter-input">
                <input
                  type="text"
                  value={transporterName}
                  onChange={handleTransporterNameChange}
                  onBlur={handleOnBlurTransporterName}
                  onFocus={() => setIsValidTransporterName(true)}
                />
              </div>
              {!isValidTransporterName && (
                <p
                  style={{ color: "red", position: "relative", top: "-30px" }}
                  className="error-message-transportername"
                >
                  Invalid Transporter name
                </p>
              )}
            </div>
          )}
          <div className="plant-phoneNumber">
            <div className="p-phoneNumber-name">
              <h3>Phone Number</h3>
            </div>
            <div className="p-phoneNumber-input">
              <input
                type="tel"
                ref={PhoneNumberRef}
                onBlur={handleOnBlurPhoneNumber}
                onFocus={() => setIsvalidPhoneNumber(true)}
              />
            </div>
            {!isValidPhoneNumber && (
              <p className="error-message-phoneNumber">Invalid Phone Number</p>
            )}
          </div>
          <div className="plant-photo">
            <div className="p-photo-name">
              <h3>Plant Photo - Document Upload</h3>
            </div>
            <div className="p-photo-input">
              <input
                type="file"
                accept=".jpg, .jpeg, .pdf"
                multiple
                onChange={handlePlantPhotoChange}
              />
            </div>
          </div>
          {fileSelected.length > 0 && (
            <table className="p-photo-table" border={1}>
              <tr>
                <td>File Name</td>
                <td>File size</td>
                <td>File type</td>
              </tr>
              {fileSelected.map((file: any) => (
                <tr>
                  <td>{file.name}</td>
                  <td>{file.size}</td>
                  <td>{file.type + "Kb"}</td>
                </tr>
              ))}
            </table>
          )}
          <div className="plant--add">
            <button onClick={handleOnClickAdd}>Add plant</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPlant;
