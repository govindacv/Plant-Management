import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "../styles/AddPlant.css";
import { useLocation, useNavigate } from "react-router-dom";

interface Country {
  countryName: string;
}

interface State {
  stateName: string;
}

interface City {
  cityName: string;
}

const EditPlant = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [transportationAvailable, setTransportationAvailable] =
    useState<boolean>(false);

  const [isValidPlantName, setIsValidPlantName] = useState(true);

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

  const location = useLocation();
  const navigate = useNavigate();

  const plantData = location.state;

  const {
    PLANTNAME,
    ISWAREHOUSE,
    PLANTCOUNTRY,
    PLANTSTATE,
    PLANTCITY,
    ISTRANSPORTATIONAVAILABLE,
    PHONENUMBER,
    TRANSPORTERNAME,
  } = plantData.plant;

  const [plantName, setPlantName] = useState<string>(PLANTNAME);
  const [warehouse, setWarehouse] = useState(ISWAREHOUSE);
  const [country, setCountry] = useState(PLANTCOUNTRY);
  const [state, setState] = useState(PLANTSTATE);
  const [city, setCity] = useState(PLANTCITY);
  const [transporterName, setTransporterName] = useState<string | null>(
    TRANSPORTERNAME
  );
  const [phoneNumber, setPhoneNumber] = useState<string>(PHONENUMBER);
  const [fileSelected, setFileSelected] = useState([]);
  const [toBedeletedID, setToBeDeletedId] = useState<{ Id: number }[]>([]);

  const handleOnBlurPhoneNumber = () => {
    if (PhoneNumberRef.current?.value) {
      const inputNumber = PhoneNumberRef.current.value;
      const regex = /^[0-9]{10}$/;
      setIsvalidPhoneNumber(regex.test(inputNumber));
    }
  };
  const [images, SetImages] = useState([]);
  const [plantId, setPlantId] = useState("");
  useEffect(() => {
    axios
      .get(`https://localhost:44380/getcountries`)
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });

    handleCountryChange(country);
    handleStateChange(state);
    setTransportationAvailable(ISTRANSPORTATIONAVAILABLE === "yes");
    axios
      .get(`https://localhost:44380/getid?plantName=${plantName}`)
      .then((response) => {
        if (response.data > 0) {
          setPlantId(response.data);
          axios
            .get(
              `https://localhost:44380/getimagedetails?plantId=${response.data}`
            )
            .then((response) => {
              console.log(response.data);
              SetImages(response.data);
            });
        }
      });
  }, []);

  const handleOnBlurTransporterName = () => {
    if (transporterName != "") {
      const plantNameRegex = /^[a-zA-Z0-9]{3,20}$/;
      if (transporterName) {
        setIsValidTransporterName(plantNameRegex.test(transporterName));
      }
    }
  };
  const handleCountryChange = (value: string) => {
    setCountry(value);
    setIsValidCountry(true);
    setSelectedCountry(value);

    axios
      .get(`https://localhost:44380/getstates/${value}`)
      .then((response: any) => {
        console.log(response.data);

        setStates(response.data);
        handleStateChange(response.data[0].stateName);
      })
      .catch((error) => {
        console.error("Error fetching states:", error);
      });
  };

  const handleStateChange = (value: any) => {
    setState(value); // Update state value
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
      const plantNameRegex = /^[a-zA-Z0-9 ]{3,20}$/;

      setIsValidPlantName(plantNameRegex.test(plantName));
    }
  };

  const handleCityChange = (city: string) => {
    setIsValidCity(true);
    setSelectedCity(city);
    setCity(city);
  };

  const handleDeleteClick = (Id: number) => {
    console.log(Id);

    setToBeDeletedId((prevIds) => [...prevIds,  Id ]);
    const updatedImages = images.filter((image) => image.plantImageId !== Id);
    SetImages(updatedImages);
  };
  const handleOnClickAdd = () => {
    if (plantNamRef.current?.value == "") {
      console.log(2);

      setIsValidPlantName(false);
    }

    if (selectedCountry == "") {
      console.log(3);

      setIsValidCountry(false);
    }
    if (selectedState == "") {
      console.log(4);

      setIsValidState(false);
    }

    if (PhoneNumberRef.current?.value == "") {
      console.log(6);

      console.log(phoneNumber);

      setIsvalidPhoneNumber(false);
    }

    if (
      isValidPlantName &&
      isValidCountry &&
      isValidState &&
      isValidCity &&
      isValidPhoneNumber &&
      isValidTransporterName
    ) {
      console.log(plantName);
      console.log(warehouse);
      console.log(country);
      console.log(state);
      console.log(city);
      const transportationAvali = transportationAvailable ? "yes" : "No";
      console.log(transportationAvali);
      console.log(transporterName);

      console.log(phoneNumber);

      axios
        .post(`https://localhost:44380/editplant`, {
          plantName: plantName,
          isWareHouse: warehouse,
          country: country,
          state: state,
          city: city,
          isTransportationAvailable: transportationAvali,
          transporterName: transporterName,
          phoneNumber: phoneNumber,
          plantPhoto: null,
        })
        .then((response) => {
          console.log(response.data);

          if (response.data == 1) {
            if (fileSelected != null) {
              const formData = new FormData();
              if (fileSelected) {
                for (let i = 0; i < fileSelected.length; i++) {
                  console.log(fileSelected[i]);

                  formData.append("formFiles", fileSelected[i]);
                }

                formData.append("plantName", plantId);
              }
              console.log(formData);

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

              if (toBedeletedID.length > 0) {
                console.log("hi");
                console.log(toBedeletedID);

                axios
                  .delete(`https://localhost:44380/deletingtheimages`, {
                    data: toBedeletedID,
                  })
                  .then((response) => {
                    console.log(response.data);
                  })
                  .catch((error) => {
                    // Handle error
                    console.error("Error deleting images:", error);
                  });
              }
            }
            alert("Plant Edited");
            navigate(`/plants`);
          }
          if (response.data == 0) {
            SetIsValidPlantNameFromServer(false);
          }
        });
    }
  };

  return (
    <div>
      <div className="addPlant">
        <div className="addplant-message">
          <h1>Edit Plant</h1>
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
                value={PLANTNAME}
                disabled
                onChange={(e) => setPlantName(e.target.value)}
              />

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
              Yes
              <input
                type="radio"
                name="warehouse"
                value="Yes"
                checked={warehouse === "Yes"}
                onClick={() => setIsValidWarehouseChoice(true)}
                onChange={() => setWarehouse("Yes")}
              />
            </div>
            <div className="p-warehouse-input2">
              No{" "}
              <input
                type="radio"
                name="warehouse"
                value="No"
                checked={warehouse === "No"}
                onClick={() => setIsValidWarehouseChoice(true)}
                onChange={() => setWarehouse("No")}
              />
            </div>
          </div>

          <div className="plant-country">
            <div className="p-country-name">
              <h3>Country</h3>
            </div>
            <div className="p-country-dropdown">
              <select
                name="Select"
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
              >
                <option value="" disabled>
                  Select
                </option>
                {countries.map((country, index) => (
                  <option key={index} value={country.countryName}>
                    {country.countryName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="plant-states">
            <div className="p-states-name">
              <h3>State</h3>
            </div>
            <div className="p-states-dropdown">
              <select
                value={state}
                onChange={(e) => handleStateChange(e.target.value)}
              >
                <option value="" disabled>
                  Select
                </option>
                {states.map((state, index) => (
                  <option key={index} value={state.stateName}>
                    {state.stateName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="plant-cities">
            <div className="p-cities-name">
              <h3>City</h3>
            </div>
            <div className="p-cities-dropdown">
              <select
                name=""
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
              >
                <option value="" disabled>
                  Select
                </option>
                {cities.map((city, index) => (
                  <option key={index} value={city.cityName}>
                    {city.cityName}
                  </option>
                ))}
              </select>
            </div>
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
                value={phoneNumber}
                ref={PhoneNumberRef}
                onBlur={handleOnBlurPhoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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
              {images.length > 0 && (
                <table className="p-photo-table" border={1}>
                  <tr>
                    <td>File Name</td>
                    <td>File size</td>
                    <td>File type</td>
                  </tr>
                  {images.map((file: any) => (
                    <tr>
                      <td>{file.plantImage}</td>
                      <td>{file.plantImageSize + " Kb"}</td>
                      <td>{file.plantImageType}</td>
                      <td>
                        <i
                          className="fa-regular fa-trash-can"
                          onClick={() => handleDeleteClick(file.plantImageId)}
                        ></i>
                      </td>
                    </tr>
                  ))}
                </table>
              )}
            </div>
          </div>
          <div className="plant--add">
            <button onClick={handleOnClickAdd}>Edit plant</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPlant;
