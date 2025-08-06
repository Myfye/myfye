import { useState, useRef, useEffect } from "react";
import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import Overlay from "@/shared/components/ui/overlay/Overlay";

import Button from "@/shared/components/ui/button/Button";
import { Check } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast/headless";
import {
  MYFYE_BACKEND,
  MYFYE_BACKEND_KEY,
  GOOGLE_MAPS_API_KEY,
} from "../../env";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../../main";
import leafLoading from "@/assets/lottie/leaf-loading.json";
import Lottie from "lottie-react";
import Page1 from "@/assets/Page1.png";
import Page2 from "@/assets/Page2.png";
import Page3 from "@/assets/Page3.png";
import { logError } from "../../functions/LogError";
import { RootState } from "@/redux/store";
import { toggleModal } from "./kycSlice";

interface KYCOverlayProps {
  onBack?: unknown;
  selectedToken?: unknown;
  amount?: unknown;
  onCloseAll?: unknown;
  isOpen?: boolean;
}
const KYCOverlay = ({
  onBack,
  selectedToken,
  amount,
  onCloseAll,
}: KYCOverlayProps) => {
  const isOpen = useSelector((state: RootState) => state.kyc.modal.isOpen);
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const [pageOneDone, setPageOneDone] = useState(false);
  const [pageTwoDone, setPageTwoDone] = useState(false);
  const [pageThreeDone, setPageThreeDone] = useState(false);
  const [loading, setLoading] = useState(false);
  // Address form state
  const [address, setAddress] = useState({
    address_line_1: "",
    city: "",
    state_province_region: "",
    postal_code: "",
    country: "",
  });
  const [autocomplete, setAutocomplete] = useState(null);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);

  // Identity verification state
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [taxID, setTaxID] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const [id_doc_type, setIdDocType] = useState("");
  const [idFrontImage, setIdFrontImage] = useState(null);
  const [idBackImage, setIdBackImage] = useState(null);
  const [isUploadValid, setIsUploadValid] = useState(false);

  const id_doc_types = [
    { name: "Passport", code: "PASSPORT" },
    { name: "ID card", code: "ID_CARD" },
    { name: "Driver's License", code: "DRIVERS" },
  ];

  const evmPubKey = useSelector((state: any) => state.userWalletData.evmPubKey);
  const currentUserEmail = useSelector(
    (state: any) => state.userWalletData.currentUserEmail
  );
  const currentUserID = useSelector(
    (state: any) => state.userWalletData.currentUserID
  );

  const handleBack = () => {
    dispatch(toggleModal({ isOpen: false }));
    if (onBack) onBack();
  };

  const handlePageOneDone = () => {
    if (!isChecked) return;
    setPageOneDone(true);
  };

  const handlePageTwoDone = () => {
    // Log the address details with standardized codes

    setPageTwoDone(true);
  };

  const handlePageThreeDone = () => {
    // Calculate age
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred this year
    const adjustedAge =
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ? age - 1
        : age;

    if (adjustedAge < 18) {
      toast.error("You must be at least 18 years old");
      return;
    }

    setPageThreeDone(true);
  };

  const handleSubmitPressed = async () => {
    setLoading(true);

    try {
      // Initialize Firebase Storage
      const storage = getStorage(app);

      // Create unique filenames for both images
      const timestamp = new Date().getTime();
      const frontFilename = `${evmPubKey}_${id_doc_type}_front_${timestamp}.jpg`;
      const backFilename = `${evmPubKey}_${id_doc_type}_back_${timestamp}.jpg`;

      const frontStorageRef = ref(storage, `id_documents/${frontFilename}`);
      const backStorageRef = ref(storage, `id_documents/${backFilename}`);

      // Upload both images
      const frontSnapshot = await uploadBytes(frontStorageRef, idFrontImage);
      const backSnapshot = await uploadBytes(backStorageRef, idBackImage);

      const frontDownloadURL = await getDownloadURL(frontSnapshot.ref);
      const backDownloadURL = await getDownloadURL(backSnapshot.ref);

      console.log("Address Details:", {
        address_line_1: address.address_line_1,
        city: address.city,
        state_province_region: address.state_province_region,
        postal_code: address.postal_code,
        country: address.country,
      });

      console.log("Identity Verification Details:", {
        dateOfBirth,
        firstName,
        lastName,
        taxID,
      });

      console.log("ID Upload Details:", {
        id_doc_type,
        idFrontImage: idFrontImage?.name,
        idBackImage: idBackImage?.name,
        frontImageUrl: frontDownloadURL,
        backImageUrl: backDownloadURL,
      });

      // if successfully uploaded both images, create the user kyc record
      await handleKYCData(frontDownloadURL, backDownloadURL);

      toast.success("KYC Verification Completed");
      //onBack();

      // wait then hard refresh the page
      setTimeout(() => {
        setLoading(false);
        window.location.reload();
      }, 2300);
    } catch (error) {
      setLoading(false);
      console.error("Error uploading images:", error);

      // More specific error messages based on the error type
      if (error.code === "storage/unauthorized") {
        toast.error(
          "You do not have permission to upload files, please contact support"
        );
      } else if (error.code === "storage/canceled") {
        toast.error("Upload was canceled");
      } else if (error.code === "storage/unknown") {
        toast.error("An unknown error occurred. Please try again");
      } else if (error.code === "storage/quota-exceeded") {
        toast.error("Storage quota exceeded. Please contact support");
      } else if (error.code === "storage/invalid-checksum") {
        toast.error("File is corrupted. Please try uploading again");
      } else if (error.code === "storage/invalid-format") {
        toast.error("Invalid file format. Please upload a valid image");
      } else {
        toast.error("Failed to upload ID documents. Please try again");
      }

      logError("Failed to upload ID documents", "KYC", error);
    }
  };

  const handleKYCData = async (
    frontDownloadURL: string,
    backDownloadURL: string
  ) => {
    try {
      const response = await fetch(`${MYFYE_BACKEND}/create_user_kyc`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": MYFYE_BACKEND_KEY,
        },
        body: JSON.stringify({
          user_id: currentUserID,
          userEvmPublicKey: evmPubKey,
          email: currentUserEmail,
          address_line_1: address.address_line_1,
          city: address.city,
          state_province_region: address.state_province_region,
          postal_code: address.postal_code,
          country: address.country,
          date_of_birth: dateOfBirth,
          first_name: firstName,
          last_name: lastName,
          tax_id: taxID,
          id_doc_type: id_doc_type,
          id_doc_front_file: frontDownloadURL,
          id_doc_back_file: backDownloadURL,
          id_doc_country: address.country,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create KYC record");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Failed to create KYC record:", error);
      logError("Failed to create KYC record", "KYC", error);
      throw error;
    }
  };
  // Validate form whenever any field changes
  useEffect(() => {
    const isValid =
      dateOfBirth && firstName.trim() && lastName.trim() && taxID.trim();
    setIsFormValid(isValid);
  }, [dateOfBirth, firstName, lastName, taxID]);

  useEffect(() => {
    // Load Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("Google Maps API loaded");
      setIsGoogleMapsLoaded(true);
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
      placesService.current = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      document.head.removeChild(script);
    };
  }, []);

  const handleAddressInput = (e) => {
    const value = e.target.value;
    setAddress((prev) => ({ ...prev, address_line_1: value }));
    setIsAddressSelected(false); // Reset selection when user types

    if (!isGoogleMapsLoaded || !autocompleteService.current) {
      console.log("Google Maps API not loaded yet");
      return;
    }

    if (value.length > 2) {
      console.log("Searching for address:", value);
      autocompleteService.current.getPlacePredictions(
        {
          input: value,
          types: ["address"],
        },
        (predictions, status) => {
          console.log("Google Places API response:", { status, predictions });
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            const sortedPredictions = predictions.slice(0, 5);
            console.log("Top 5 predictions:", sortedPredictions);
            setAddressSuggestions(sortedPredictions);
            setShowSuggestions(true);
          } else {
            console.log("No predictions found or error:", status);
            setAddressSuggestions([]);
            setShowSuggestions(false);
          }
        }
      );
    } else {
      setShowSuggestions(false);
      setAddressSuggestions([]);
    }
  };

  const handleAddressSelect = (placeId) => {
    console.log("Selected place ID:", placeId);
    placesService.current.getDetails({ placeId }, (place, status) => {
      console.log("Place details response:", { status, place });
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        place
      ) {
        let streetNumber = "";
        let route = "";
        let city = "";
        let state = "";
        let stateCode = "";
        let postalCode = "";
        let country = "";
        let countryCode = "";

        place.address_components.forEach((component) => {
          console.log("Address component:", component);
          const types = component.types;
          if (types.includes("street_number")) {
            streetNumber = component.long_name;
          } else if (types.includes("route")) {
            route = component.long_name;
          } else if (types.includes("locality")) {
            city = component.long_name;
          } else if (types.includes("administrative_area_level_1")) {
            state = component.long_name;
            stateCode = component.short_name;
          } else if (types.includes("postal_code")) {
            postalCode = component.long_name;
          } else if (types.includes("country")) {
            country = component.long_name;
            countryCode = component.short_name;
          }
        });

        const formattedAddress = {
          address_line_1: `${streetNumber} ${route}`.trim(),
          city,
          state_province_region: stateCode,
          postal_code: postalCode,
          country: countryCode,
        };

        console.log("Formatted address:", formattedAddress);
        setAddress(formattedAddress);
        setShowSuggestions(false);
        setIsAddressSelected(true); // Mark address as selected
      } else {
        console.error("Error fetching place details:", status);
      }
    });
  };

  // Validate upload form
  useEffect(() => {
    const isValid = id_doc_type && idFrontImage && idBackImage;
    setIsUploadValid(isValid);
  }, [id_doc_type, idFrontImage, idBackImage]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if file is an image
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/heic",
        "image/heif",
      ];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        toast.error("Please upload a valid image file (JPEG, PNG, HEIC)");
        return;
      }
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should be less than 10MB");
        return;
      }
      setIdFrontImage(file);
    }
  };

  const handleBackImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if file is an image
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/heic",
        "image/heif",
      ];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        toast.error("Please upload a valid image file (JPEG, PNG, HEIC)");
        return;
      }
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should be less than 10MB");
        return;
      }
      setIdBackImage(file);
    }
  };

  if (loading) {
    return (
      <Overlay
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) {
          }
        }}
        title="Upload Your Identification"
        zIndex={10003}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100cqh;
            padding: var(--size-400);
            gap: 2rem;
          `}
        >
          <div
            css={css`
              width: 120px;
              height: 120px;
            `}
          >
            Loading...
          </div>
          <div
            css={css`
              font-size: 1.2rem;
              color: var(--clr-text);
              text-align: center;
              font-weight: 500;
            `}
          >
            Verifying your identity...
          </div>
        </div>
      </Overlay>
    );
  }

  if (pageThreeDone) {
    return (
      <Overlay
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setPageThreeDone(false);
          }
        }}
        title="Upload Your Identification"
        zIndex={10003}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            height: 100cqh;
            padding: var(--size-400);
          `}
        >
          <div
            css={css`
              display: flex;
              justify-content: center;
              width: 100%;
              margin-bottom: 0.5rem;
              margin-top: -1rem;
            `}
          >
            <img
              src={Page3}
              alt="Progress"
              css={css`
                width: 80%;
                height: auto;
              `}
            />
          </div>
          <div>
            <h1
              style={{ color: "var(--clr-neutral-400", marginBottom: "0.5rem" }}
            >
              ID Document Country:{" "}
              <span style={{ fontWeight: "bold" }}>{address.country}</span>
            </h1>
          </div>

          <div
            css={css`
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 0.75rem;
              margin: 0.5rem 0;
            `}
          >
            {/* ID Document Type Dropdown */}
            <div
              css={css`
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
              `}
            >
              <label
                css={css`
                  color: var(--clr-text);
                  font-weight: 500;
                `}
              >
                ID Document Type
              </label>
              <select
                value={id_doc_type}
                onChange={(e) => setIdDocType(e.target.value)}
                css={css`
                  width: 100%;
                  padding: 1rem;
                  border: 1px solid var(--clr-neutral-300);
                  border-radius: var(--border-radius-medium);
                  font-size: 1.1rem;
                  background: var(--clr-neutral-50);
                  appearance: none;
                  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                  background-repeat: no-repeat;
                  background-position: right 1rem center;
                  background-size: 1em;

                  &:focus {
                    outline: none;
                    border-color: var(--clr-primary);
                    background-color: white;
                  }
                `}
              >
                <option value="">Select ID Document Type</option>
                {id_doc_types.map((type) => (
                  <option key={type.code} value={type.code}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ID Front Image Upload */}
            <div
              css={css`
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
              `}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <div>
                  <label
                    css={css`
                      font-size: 0.9rem;
                      color: var(--clr-text);
                      font-weight: 500;
                    `}
                  >
                    Upload ID Front
                  </label>
                  <div
                    css={css`
                      position: relative;
                      width: 80%;
                      aspect-ratio: 4/3;
                      border: 2px dashed var(--clr-neutral-300);
                      border-radius: var(--border-radius-medium);
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      justify-content: center;
                      gap: 0.5rem;
                      background: var(--clr-neutral-50);
                      cursor: pointer;
                      transition: all 0.2s ease;

                      &:hover {
                        border-color: var(--clr-primary);
                        background: var(--clr-neutral-100);
                      }
                    `}
                  >
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/heic,image/heif"
                      capture="environment"
                      onChange={handleImageUpload}
                      css={css`
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        opacity: 0;
                        cursor: pointer;
                      `}
                    />
                    {idFrontImage ? (
                      <>
                        <img
                          src={URL.createObjectURL(idFrontImage)}
                          alt="ID Front"
                          css={css`
                            max-height: 200px;
                            object-fit: contain;
                          `}
                        />
                        <div
                          css={css`
                            font-size: 0.9rem;
                            color: var(--clr-success);
                          `}
                        >
                          Image loaded successfully
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          css={css`
                            font-size: 0.8rem;
                            color: var(--clr-text);
                            text-align: center;
                            line-height: 1.2;
                          `}
                        >
                          Tap to take photo or upload
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    css={css`
                      font-size: 0.9rem;
                      color: var(--clr-text);
                      font-weight: 500;
                    `}
                  >
                    Upload ID Rear
                  </label>
                  <div
                    css={css`
                      position: relative;
                      width: 80%;
                      aspect-ratio: 4/3;
                      border: 2px dashed var(--clr-neutral-300);
                      border-radius: var(--border-radius-medium);
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      justify-content: center;
                      gap: 0.5rem;
                      background: var(--clr-neutral-50);
                      cursor: pointer;
                      transition: all 0.2s ease;

                      &:hover {
                        border-color: var(--clr-primary);
                        background: var(--clr-neutral-100);
                      }
                    `}
                  >
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/heic,image/heif"
                      capture="environment"
                      onChange={handleBackImageUpload}
                      css={css`
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        opacity: 0;
                        cursor: pointer;
                      `}
                    />
                    {idBackImage ? (
                      <>
                        <img
                          src={URL.createObjectURL(idBackImage)}
                          alt="ID Back"
                          css={css`
                            max-height: 200px;
                            object-fit: contain;
                          `}
                        />
                        <div
                          css={css`
                            font-size: 0.9rem;
                            color: var(--clr-success);
                          `}
                        >
                          Image loaded successfully
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          css={css`
                            font-size: 0.8rem;
                            color: var(--clr-text);
                            text-align: center;
                            line-height: 1.2;
                          `}
                        >
                          Tap to take photo or upload
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div
                css={css`
                  display: flex;
                  flex-direction: column;
                  gap: 0.25rem;
                  margin-top: 0.5rem;
                  text-align: center;
                `}
              >
                <div
                  css={css`
                    font-size: 0.9rem;
                    color: var(--clr-neutral-600);
                  `}
                >
                  Accepted formats: JPEG, PNG, HEIC
                </div>
                <div
                  css={css`
                    font-size: 0.9rem;
                    color: var(--clr-neutral-600);
                  `}
                >
                  Max file size: 10MB
                </div>
              </div>
            </div>
          </div>

          <div
            css={css`
              padding: 0.5rem 0;
              margin-top: auto;
            `}
          >
            <Button
              expand
              variant="primary"
              onPress={handleSubmitPressed}
              disabled={!isUploadValid}
              css={css`
                opacity: ${isUploadValid ? 1 : 0.5};
                pointer-events: ${isUploadValid ? "auto" : "none"};
              `}
            >
              Submit
            </Button>
          </div>
        </div>
      </Overlay>
    );
  }
  if (pageTwoDone) {
    return (
      <Overlay
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setPageTwoDone(false);
          }
        }}
        title="Verify Your Identity"
        zIndex={10002}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            height: 100cqh;
            padding: var(--size-400);
          `}
        >
          <div
            css={css`
              display: flex;
              justify-content: center;
              width: 100%;
              margin-bottom: 0.2rem;
              margin-top: -1rem;
            `}
          >
            <img
              src={Page2}
              alt="Progress"
              css={css`
                width: 80%;
                height: auto;
              `}
            />
          </div>
          <div
            css={css`
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 0.1rem;
              margin: 1rem 0;
            `}
          >
            {/* Date of Birth */}
            <div
              css={css`
                display: flex;
                flex-direction: column;
                gap: 0.1rem;
              `}
            >
              <label
                css={css`
                  font-size: 0.9rem;
                  color: var(--clr-text);
                  font-weight: 500;
                `}
              >
                Date of Birth
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                css={css`
                  width: 100%;
                  padding: 1rem;
                  border: 1px solid var(--clr-neutral-300);
                  border-radius: var(--border-radius-medium);
                  font-size: 1.1rem;
                  background: var(--clr-neutral-50);

                  &:focus {
                    outline: none;
                    border-color: var(--clr-primary);
                    background: white;
                  }
                `}
              />
            </div>

            {/* First Name */}
            <div
              css={css`
                display: flex;
                flex-direction: column;
                gap: 0.2rem;
              `}
            >
              <label
                css={css`
                  font-size: 0.9rem;
                  color: var(--clr-text);
                  font-weight: 500;
                `}
              >
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                css={css`
                  width: 100%;
                  padding: 1rem;
                  border: 1px solid var(--clr-neutral-300);
                  border-radius: var(--border-radius-medium);
                  font-size: 1.1rem;
                  background: var(--clr-neutral-50);

                  &:focus {
                    outline: none;
                    border-color: var(--clr-primary);
                    background: white;
                  }
                `}
              />
            </div>

            {/* Last Name */}
            <div
              css={css`
                display: flex;
                flex-direction: column;
                gap: 0.2rem;
              `}
            >
              <label
                css={css`
                  font-size: 0.9rem;
                  color: var(--clr-text);
                  font-weight: 500;
                `}
              >
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                css={css`
                  width: 100%;
                  padding: 1rem;
                  border: 1px solid var(--clr-neutral-300);
                  border-radius: var(--border-radius-medium);
                  font-size: 1.1rem;
                  background: var(--clr-neutral-50);

                  &:focus {
                    outline: none;
                    border-color: var(--clr-primary);
                    background: white;
                  }
                `}
              />
            </div>

            {/* Tax ID */}
            <div
              css={css`
                display: flex;
                flex-direction: column;
                gap: 0.2rem;
              `}
            >
              <label
                css={css`
                  font-size: 0.9rem;
                  color: var(--clr-text);
                  font-weight: 500;
                `}
              >
                Tax ID
              </label>
              <input
                type="text"
                value={taxID}
                onChange={(e) => setTaxID(e.target.value)}
                placeholder="Enter your tax ID"
                css={css`
                  width: 100%;
                  padding: 1rem;
                  border: 1px solid var(--clr-neutral-300);
                  border-radius: var(--border-radius-medium);
                  font-size: 1.1rem;
                  background: var(--clr-neutral-50);

                  &:focus {
                    outline: none;
                    border-color: var(--clr-primary);
                    background: white;
                  }
                `}
              />
            </div>
          </div>

          <div
            css={css`
              padding: 1rem 0;
              margin-top: auto;
            `}
          >
            <Button
              expand
              variant="primary"
              onPress={handlePageThreeDone}
              disabled={!isFormValid}
              css={css`
                opacity: ${isFormValid ? 1 : 0.5};
                pointer-events: ${isFormValid ? "auto" : "none"};
              `}
            >
              Continue
            </Button>
          </div>
        </div>
      </Overlay>
    );
  }

  if (pageOneDone) {
    return (
      <Overlay
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setPageOneDone(false);
          }
        }}
        title="Enter Your Address"
        zIndex={10001}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            height: 100cqh;
            padding: var(--size-400);
          `}
        >
          <div
            css={css`
              display: flex;
              justify-content: center;
              width: 100%;
              margin-bottom: 2rem;
              margin-top: -1rem;
            `}
          >
            <img
              src={Page1}
              alt="Progress"
              css={css`
                width: 80%;
                height: auto;
              `}
            />
          </div>
          <div
            css={css`
              flex: 1;
              display: flex;
              flex-direction: column;
              margin: 1rem 0;
              padding: 0.5rem;
              position: relative;
            `}
          >
            <div
              css={css`
                position: relative;
                margin-bottom: 1rem;
              `}
            >
              <input
                type="text"
                value={address.address_line_1}
                onChange={handleAddressInput}
                placeholder="Search for your address"
                css={css`
                  width: 100%;
                  padding: 1rem;
                  border: 1px solid var(--clr-neutral-300);
                  border-radius: var(--border-radius-medium);
                  font-size: 1.1rem;
                  background: var(--clr-neutral-50);

                  &:focus {
                    outline: none;
                    border-color: var(--clr-primary);
                    background: white;
                  }
                `}
              />
            </div>

            {showSuggestions && addressSuggestions.length > 0 && (
              <div
                css={css`
                  flex: 1;
                  display: flex;
                  flex-direction: column;
                  gap: 0.5rem;
                  margin-top: 0.5rem;
                  padding-bottom: 1rem;
                  overflow-y: auto;
                `}
              >
                {addressSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.place_id}
                    onClick={() => handleAddressSelect(suggestion.place_id)}
                    css={css`
                      padding: 1rem;
                      background: white;
                      border: 1px solid var(--clr-neutral-200);
                      border-radius: var(--border-radius-medium);
                      cursor: pointer;
                      transition: all 0.2s ease;

                      &:hover {
                        background: var(--clr-neutral-50);
                        border-color: var(--clr-primary);
                      }

                      &:active {
                        transform: scale(0.98);
                      }
                    `}
                  >
                    <div
                      css={css`
                        font-size: 1rem;
                        color: var(--clr-text);
                        line-height: 1.4;
                      `}
                    >
                      {suggestion.description}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!showSuggestions && address.address_line_1 && (
              <div
                css={css`
                  padding: 1rem;
                  background: var(--clr-neutral-50);
                  border-radius: var(--border-radius-medium);
                  margin-top: 1rem;
                `}
              >
                <div
                  css={css`
                    font-size: 0.9rem;
                    color: var(--clr-neutral-600);
                    margin-bottom: 0.5rem;
                  `}
                >
                  Selected Address:
                </div>
                <div
                  css={css`
                    font-size: 1rem;
                    color: var(--clr-text);
                    line-height: 1.4;
                  `}
                >
                  {address.address_line_1}
                  {address.city && `, ${address.city}`}
                  {address.state_province_region &&
                    `, ${address.state_province_region}`}
                  {address.postal_code && ` ${address.postal_code}`}
                </div>
              </div>
            )}
          </div>

          <div
            css={css`
              padding: 1rem 0;
              margin-top: auto;
            `}
          >
            <Button
              expand
              variant="primary"
              onPress={handlePageTwoDone}
              disabled={!isAddressSelected}
              css={css`
                opacity: ${isAddressSelected ? 1 : 0.5};
                pointer-events: ${isAddressSelected ? "auto" : "none"};
              `}
            >
              Continue
            </Button>
            {!isAddressSelected && address.address_line_1 && (
              <div
                css={css`
                  color: var(--clr-error);
                  font-size: 0.9rem;
                  margin-top: 0.5rem;
                  text-align: center;
                `}
              >
                Please select an address from the suggestions
              </div>
            )}
          </div>
        </div>
      </Overlay>
    );
  }
  return (
    <Overlay
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          dispatch(toggleModal({ isOpen: false }));
          if (onBack) onBack();
        }
      }}
      title="Account Setup"
      zIndex={10000}
    >
      <div
        css={css`
          display: grid;
          grid-template-rows: 1fr auto;
          height: 100cqh;
          padding-block-end: var(--size-100);
        `}
      >
        <section
          css={css`
            margin-block-start: var(--size-100);
            padding-inline: var(--size-250);
          `}
        >
          <div
            css={css`
              padding: var(--size-100);
              border-radius: var(--border-radius-medium);
            `}
          >
            <div
              css={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
              `}
            >
              <h2
                css={css`
                  color: var(--clr-text);
                `}
              >
                <span style={{ color: "#006BCC", textDecoration: "underline" }}>
                  <a
                    href="https://www.investopedia.com/terms/k/knowyourclient.asp"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Regulations
                  </a>
                </span>{" "}
                require us to collect and verify your information
              </h2>
            </div>
            <div
              css={css`
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 1.5rem;
                margin-top: 1.5rem;
                margin-bottom: 1.5rem;
              `}
            >
              {/* Stepper Start */}
              <div
                css={css`
                  display: grid;
                  grid-template-columns: 56px 1fr;
                  row-gap: 0;
                `}
              >
                {/* Step 1 */}
                <div
                  css={css`
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                  `}
                >
                  <div
                    css={css`
                      width: 30px;
                      aspect-ratio: 1;
                      border-radius: 50%;
                      background: var(--clr-primary);
                      color: #fff;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-weight: 700;
                      font-size: 1rem;
                      border: none;
                    `}
                  >
                    <Check size={18} weight="bold" />
                  </div>
                  <div
                    css={css`
                      flex: 1;
                      width: 4px;
                      background: var(--clr-primary);
                      min-height: 56px;
                      margin: 8px 0;
                    `}
                  ></div>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div
                    css={css`
                      font-weight: 700;
                      color: var(--clr-neutral-400);
                      font-size: 1rem;
                    `}
                  >
                    Create your account
                  </div>
                  <div
                    css={css`
                      color: var(--clr-neutral-400);
                      font-size: 1rem;
                    `}
                  >
                    Add a password and secure your account
                  </div>
                </div>
                {/* Step 2 */}
                <div
                  css={css`
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                  `}
                >
                  <div
                    css={css`
                      width: 30px;
                      aspect-ratio: 1;
                      border-radius: 50%;
                      background: transparent;
                      color: var(--clr-primary);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-weight: 700;
                      font-size: 1rem;
                      border: 3px solid var(--clr-primary);
                    `}
                  >
                    2
                  </div>
                  <div
                    css={css`
                      flex: 1;
                      width: 4px;
                      background: var(--clr-primary);
                      min-height: 56px;
                      margin: 8px 0;
                    `}
                  ></div>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div
                    css={css`
                      font-weight: 700;
                      color: var(--clr-text);
                      font-size: 1rem;
                    `}
                  >
                    About you
                  </div>
                  <div
                    css={css`
                      color: var(--clr-text);
                      font-size: 1rem;
                    `}
                  >
                    Add personal details
                  </div>
                  <div
                    css={css`
                      color: var(--clr-primary);
                      font-size: 1rem;
                      font-weight: 500;
                      margin-top: 0.2rem;
                    `}
                  >
                    Approx. 2 min
                  </div>
                </div>
                {/* Step 3 */}
                <div
                  css={css`
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                  `}
                >
                  <div
                    css={css`
                      width: 30px;
                      aspect-ratio: 1;
                      border-radius: 50%;
                      background: transparent;
                      color: var(--clr-neutral-400);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-weight: 700;
                      font-size: 1rem;
                      border: 3px solid var(--clr-neutral-400);
                    `}
                  >
                    3
                  </div>
                </div>
                <div>
                  <div
                    css={css`
                      font-weight: 700;
                      color: var(--clr-text);
                      font-size: 1rem;
                    `}
                  >
                    Verify your identity
                  </div>
                  <div
                    css={css`
                      color: var(--clr-text);
                      font-size: 1rem;
                    `}
                  >
                    Upload and verify your identity documents
                  </div>
                  <div
                    css={css`
                      color: var(--clr-primary);
                      font-size: 1rem;
                      font-weight: 500;
                      margin-top: 0rem;
                    `}
                  >
                    Approx. 5 min
                  </div>
                </div>
              </div>
              {/* Stepper End */}
              {/* Checkbox Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: 12,
                  marginBottom: 4,
                }}
              >
                <div
                  onClick={() => setIsChecked((prev) => !prev)}
                  style={{
                    width: 20,
                    height: 20,
                    border: "2px solid #666666",
                    background: "transparent",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    marginRight: 12,
                  }}
                >
                  {isChecked ? (
                    <Check size={24} color="#666666" weight="bold" />
                  ) : (
                    <Check size={24} color="transparent" weight="bold" />
                  )}
                </div>
                <span style={{ color: "var(--clr-text)", fontSize: "1rem" }}>
                  I certify that I am 18 years of age or older, I agree to the{" "}
                  <span
                    style={{
                      color: "#006BCC",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/terms-of-service")}
                  >
                    User Agreement
                  </span>
                  .
                </span>
              </div>
            </div>

            <div style={{ display: "flex" }}></div>
          </div>
        </section>

        <section
          css={css`
            margin-block-start: auto;
            padding-inline: var(--size-250);
            padding-block-end: var(--size-250);
            margin-top: 0;
          `}
        >
          <Button
            expand
            variant="primary"
            onPress={handlePageOneDone}
            isDisabled={!isChecked}
          >
            Continue
          </Button>
        </section>
      </div>
    </Overlay>
  );
};

export default KYCOverlay;
