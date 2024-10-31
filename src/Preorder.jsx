import React, { useState, useEffect, useRef } from "react";
import countriesData from "./countries.json";
import { CheckCircle, Search, ChevronDown, ChevronUp } from "lucide-react";
import ban from "./assets/ban.jpg";

const SearchableDropdown = ({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  displayKey = "name",
  valueKey = "code2",
  onSelect  // Add onSelect prop for custom selection handling
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option[displayKey].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(option => 
    option[valueKey] === value || option[displayKey] === value
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none bg-white flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`${!selectedOption ? 'text-gray-500' : 'text-black'}`}>
          {selectedOption ? selectedOption[displayKey] : placeholder}
        </span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-2 border-b border-gray-200 flex items-center gap-2">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              className="w-full p-1 focus:outline-none"
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-gray-500 text-center">No results found</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option[valueKey]}
                  className={`p-3 hover:bg-gray-100 cursor-pointer ${
                    (value === option[valueKey] || value === option[displayKey]) ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => {
                    if (onSelect) {
                      onSelect(option);
                    } else {
                      onChange(option[valueKey]);
                    }
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {option[displayKey]}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const PreorderForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    address: "",
    delivery_type: "",
    quantity: 1,
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [metadata, setMetadata] = useState({
    countries: [],
    states: [],
    phoneCode: "",
    priceData: { currency: "", price: "", main_price: "" },
    deliveryFees: [],
    loading: false,
    error: "",
  });

  const countryMap = {
    GB: "United Kingdom",
    NG: "Nigeria",
    GH: "Ghana",
    DE: "Germany",
    US: "United States",
  };

  const preorderPrice = {
    "United Kingdom": "GBP 12",
    Nigeria: "NGN 7000",
    Ghana: "GHS 70",
    Germany: "EUR 13",
    default: "USD 17",
  };

  const countryPhoneCodes = {
    AF: "+93",
    AL: "+355",
    DZ: "+213",
    AD: "+376",
    AO: "+244",
    AG: "+1-268",
    AR: "+54",
    AM: "+374",
    AU: "+61",
    AT: "+43",
    AZ: "+994",
    BS: "+1-242",
    BH: "+973",
    BD: "+880",
    BB: "+1-246",
    BY: "+375",
    BE: "+32",
    BZ: "+501",
    BJ: "+229",
    BT: "+975",
    BO: "+591",
    BA: "+387",
    BW: "+267",
    BR: "+55",
    BN: "+673",
    BG: "+359",
    BF: "+226",
    BI: "+257",
    CV: "+238",
    KH: "+855",
    CM: "+237",
    CA: "+1",
    CF: "+236",
    TD: "+235",
    CL: "+56",
    CN: "+86",
    CO: "+57",
    KM: "+269",
    CG: "+242",
    CR: "+506",
    HR: "+385",
    CU: "+53",
    CY: "+357",
    CZ: "+420",
    DK: "+45",
    DJ: "+253",
    DM: "+1-767",
    DO: "+1-809",
    TL: "+670",
    EC: "+593",
    EG: "+20",
    SV: "+503",
    GQ: "+240",
    ER: "+291",
    EE: "+372",
    SZ: "+268",
    ET: "+251",
    FJ: "+679",
    FI: "+358",
    FR: "+33",
    GA: "+241",
    GM: "+220",
    GE: "+995",
    DE: "+49",
    GH: "+233",
    GR: "+30",
    GD: "+1-473",
    GT: "+502",
    GN: "+224",
    GW: "+245",
    GY: "+592",
    HT: "+509",
    HN: "+504",
    HU: "+36",
    IS: "+354",
    IN: "+91",
    ID: "+62",
    IR: "+98",
    IQ: "+964",
    IE: "+353",
    IL: "+972",
    IT: "+39",
    CI: "+225",
    JM: "+1-876",
    JP: "+81",
    JO: "+962",
    KZ: "+7",
    KE: "+254",
    KI: "+686",
    KW: "+965",
    KG: "+996",
    LA: "+856",
    LV: "+371",
    LB: "+961",
    LS: "+266",
    LR: "+231",
    LY: "+218",
    LI: "+423",
    LT: "+370",
    LU: "+352",
    MG: "+261",
    MW: "+265",
    MY: "+60",
    MV: "+960",
    ML: "+223",
    MT: "+356",
    MH: "+692",
    MR: "+222",
    MU: "+230",
    MX: "+52",
    FM: "+691",
    MD: "+373",
    MC: "+377",
    MN: "+976",
    ME: "+382",
    MA: "+212",
    MZ: "+258",
    MM: "+95",
    NA: "+264",
    NR: "+674",
    NP: "+977",
    NL: "+31",
    NZ: "+64",
    NI: "+505",
    NE: "+227",
    NG: "+234",
    KP: "+850",
    MK: "+389",
    NO: "+47",
    OM: "+968",
    PK: "+92",
    PW: "+680",
    PA: "+507",
    PG: "+675",
    PY: "+595",
    PE: "+51",
    PH: "+63",
    PL: "+48",
    PT: "+351",
    QA: "+974",
    RO: "+40",
    RU: "+7",
    RW: "+250",
    KN: "+1-869",
    LC: "+1-758",
    VC: "+1-784",
    WS: "+685",
    SM: "+378",
    ST: "+239",
    SA: "+966",
    SN: "+221",
    RS: "+381",
    SC: "+248",
    SL: "+232",
    SG: "+65",
    SK: "+421",
    SI: "+386",
    SB: "+677",
    SO: "+252",
    ZA: "+27",
    KR: "+82",
    SS: "+211",
    ES: "+34",
    LK: "+94",
    SD: "+249",
    SR: "+597",
    SE: "+46",
    CH: "+41",
    SY: "+963",
    TW: "+886",
    TJ: "+992",
    TZ: "+255",
    TH: "+66",
    TG: "+228",
    TO: "+676",
    TT: "+1-868",
    TN: "+216",
    TR: "+90",
    TM: "+993",
    TV: "+688",
    UG: "+256",
    UA: "+380",
    AE: "+971",
    GB: "+44",
    US: "+1",
    UY: "+598",
    UZ: "+998",
    VU: "+678",
    VA: "+379",
    VE: "+58",
    VN: "+84",
    YE: "+967",
    ZW: "+263",
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const startDate = new Date("2024-10-28T00:00:00");
    const endDate = new Date(startDate.getTime() + 23 * 24 * 60 * 60 * 1000);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = endDate - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setMetadata((prev) => ({ ...prev, countries: countriesData.countries }));
  }, []);

  useEffect(() => {
    if (formData.country) {
      fetchPrice(formData.country);
      fetchDeliveryFee(formData.country, formData.state);

      const selectedCountry = metadata.countries.find(
        (c) => c.code2 === formData.country
      );
      if (selectedCountry) {
        setMetadata((prev) => ({
          ...prev,
          states: selectedCountry.states || [],
          phoneCode: countryPhoneCodes[formData.country] || "+",
        }));
      }
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.country && formData.state) {
      fetchDeliveryFee(formData.country, formData.state);
    }
  }, [formData.state, formData.quantity]);

  useEffect(() => {
    if (metadata.deliveryFees.length === 1) {
      setFormData((prev) => ({
        ...prev,
        delivery_type: metadata.deliveryFees[0].id,
      }));
    }
  }, [metadata.deliveryFees]);

  const getEffectiveCountry = (countryCode) => {
    return countryMap[countryCode] ? countryMap[countryCode] : "United States";
  };

  // Function to retrieve the preorder price
  const getPreorderPrice = (countryName) =>
    preorderPrice[countryName] || preorderPrice.default;

  // Fetch price and set the correct country name
  const fetchPrice = async (countryCode) => {
    try {
      const countryName = countryMap[countryCode] || "United States";
      const effectiveCountry = getEffectiveCountry(countryCode);
      const response = await fetch(
        `https://lovepassionsandwholeness.com/api/price/${effectiveCountry}`
      );
      const data = await response.json();

      if (data.status === "success") {
        setMetadata((prev) => ({
          ...prev,
          priceData: {
            currency: data.data.currency,
            price: data.data.price,
            main_price: data.data.main_price,
            country: countryName,
          },
        }));
      }
    } catch (error) {
      setMetadata((prev) => ({ ...prev, error: "Failed to fetch price" }));
    }
  };

  const calculateDeliveryDivisor = (quantity) => {
    return Math.ceil(quantity / 2);
  };

  const fetchDeliveryFee = async (countryCode, state = "") => {
    try {
      const effectiveCountry = getEffectiveCountry(countryCode);
      const encodedState = state ? encodeURIComponent(state) : "";
      const url = `https://lovepassionsandwholeness.com/api/fee/${effectiveCountry}${
        encodedState ? `?state=${encodedState}` : ""
      }`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "success") {
        setMetadata((prev) => ({
          ...prev,
          deliveryFees: data.data.map((fee) => ({
            ...fee,
            originalFee: parseFloat(fee.fee), // Store original fee
            fee: (
              parseFloat(fee.fee) * calculateDeliveryDivisor(formData.quantity)
            ).toFixed(2),
          })),
        }));
      }
    } catch (error) {
      setMetadata((prev) => ({
        ...prev,
        error: "Failed to fetch delivery fees",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMetadata((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      const selectedCountry = metadata.countries.find(
        (c) => c.code2 === formData.country
      );

      const selectedDeliveryFee = metadata.deliveryFees.find(
        (fee) => fee.id === formData.delivery_type
      );

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        country: selectedCountry?.name || "",
        state: formData.state,
        address: formData.address,
        delivery_type: formData.delivery_type,
        quantity: formData.quantity,
        adjusted_delivery_fee: selectedDeliveryFee?.fee || 0,
        delivery_divisor: calculateDeliveryDivisor(formData.quantity),
      };

      const response = await fetch(
        "https://lovepassionsandwholeness.com/api/preorder",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        if (
          selectedCountry &&
          Object.values(countryMap).includes(selectedCountry.name)
        ) {
          window.location.href = data.data;
        } else {
          setShowSuccessModal(true);
        }
      } else {
        setMetadata((prev) => ({ ...prev, error: data.message }));
      }
    } catch (error) {
      setMetadata((prev) => ({ ...prev, error: "Failed to submit order" }));
    } finally {
      setMetadata((prev) => ({ ...prev, loading: false }));
    }
  };

  const renderCountrySelect = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Country
      </label>
      <SearchableDropdown
        options={metadata.countries}
        value={formData.country}
        onChange={(value) => {
          setFormData((prev) => ({
            ...prev,
            country: value,
            state: "",
            delivery_type: "",
          }));
        }}
        placeholder="Select country"
      />
    </div>
  );

  const renderStateSelect = () => {
    if (metadata.states.length === 0) return null;
    
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          State
        </label>
        <SearchableDropdown
          options={metadata.states}
          value={formData.state}
          onSelect={(selectedState) => {
            setFormData((prev) => ({
              ...prev,
              state: selectedState.name,
            }));
          }}
          placeholder="Select state"
          valueKey="name"
          displayKey="name"
        />
      </div>
    );
  };

  const renderDeliveryInfo = () => {
    if (metadata.deliveryFees.length === 0) return null;

    const deliveryDivisor = calculateDeliveryDivisor(formData.quantity);

    if (metadata.deliveryFees.length === 1) {
      const fee = metadata.deliveryFees[0];
      return (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-lg font-semibold">
            Delivery: {fee.type} {fee.currency} {fee.fee}
          </p>
        </div>
      );
    }

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Delivery Option
        </label>
        <select
          value={formData.delivery_type}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              delivery_type: e.target.value,
            }))
          }
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
        >
          <option value="">Select delivery option</option>
          {metadata.deliveryFees.map((fee) => (
            <option key={fee.id} value={fee.id}>
              {fee.type}: {fee.currency} {fee.fee}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderQuantityField = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Quantity
      </label>
      <input
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="Enter quantity"
        value={formData.quantity || ""}
        onChange={(e) => {
          const value = e.target.value;
          // Allow empty string or positive numbers
          if (value === "" || parseInt(value) > 0) {
            setFormData((prev) => ({
              ...prev,
              quantity: value === "" ? "" : parseInt(value),
            }));
          }
        }}
        required
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
      />
    </div>
  );

  // Update the price display section
  const renderPriceSection = () => {
    if (!metadata.priceData.price) return null;

    const calculateTotal = (price) => {
      const numericPrice = parseFloat(price);
      return (numericPrice * formData.quantity).toFixed(2);
    };

    return (
      <div className="p-4 bg-gray-300 border border-gray-500 rounded-xl">
        <div className="text-lg pt-2 flex flex-col gap-4 font-semibold">
          <div className="flex flex-col">
            <p className="text-2xl font-semibold">Price After Pre Order</p>
            <span className="line-through mr-2">
              {metadata.priceData.currency}{" "}
              {calculateTotal(metadata.priceData.main_price)}
            </span>
          </div>
          <div className="flex flex-col">
            <p className="text-2xl font-semibold">Pre Order Book Price</p>
            {metadata.priceData.currency}{" "}
            {calculateTotal(metadata.priceData.price)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="absolute h-screen w-full bg-black opacity-50"></div>
      <div className="absolute flex items-center justify-center w-full top-[8rem] md:top-16 text-white text-3xl md:text-6xl font-bold">
        <div className="p-6">
          <div className="grid grid-cols-4 gap-2">
            <div className="">
              <div className="">{timeLeft.days} :</div>
              <div className="text-[18px] text-white">Days</div>
            </div>
            <div className="">
              <div className="">{timeLeft.hours} :</div>
              <div className="text-[18px] text-white">Hours</div>
            </div>
            <div className="">
              <div className="">{timeLeft.minutes} :</div>
              <div className="text-[18px] sm:hidden text-white">Mins</div>
              <div className="text-[18px] hidden sm:block text-white">
                Minutes
              </div>
            </div>
            <div className="">
              <div className="">{timeLeft.seconds}</div>
              <div className="text-[18px] sm:hidden text-white">Secs</div>
              <div className="text-[18px] hidden sm:block text-white">
                Seconds
              </div>
            </div>
          </div>
        </div>
      </div>
      <img
        src={ban}
        className="md:hidden w-full object-cover h-[360px]"
        alt=""
      />
      <img
        src={ban}
        className="hidden md:block h-[250px] object-cover w-full -z-20"
        alt=""
      />
      <div className="flex justify-center py-10 absolute z-[9999] bg-white ">
        <div className="bg-white w-full grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-12">
          <div className="flex flex-col">
            <h3 className="text-[18px] font-[600] mb-4">Details</h3>
            <div className="flex flex-col sm:flex-row text-left gap-6 mb-6">
              <img
                src={ban}
                alt="Embrace Book"
                className="w-full sm:w-56 rounded-3xl object-cover h-[300px] md:h-[230px]"
              />
              <div className="flex flex-col left-[13rem] sm:mt-20">
                <h1 className="text-2xl font-bold">Embrace</h1>
                <p className="text-gray-600 ">
                  by{" "}
                  <span className="text-black font-semibold">
                    Timothy Oyebanji
                  </span>
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2 mt-5">
                About the book
              </h2>
              <p className="text-gray-700 mb-4 text-[15px] mt-6 font-[500]">
                Have you lost hope in love? Are you struggling to find "the
                one"? Or perhaps, navigating a long-distance relationship seems
                daunting? <br /> <br />
                Recent research reveals alarming statistics: the average
                long-distance relationship lasts merely five months, with
                approximately 50% ending in breakups. This book is poised to
                challenge those numbers. <br />
                <br />
                In your hand lies a transformative guide, empowering you to
                navigate the complexities of long-distance relationships. With
                actionable, expert counsel, this book provides: <br />
                <br />
                <ul className="list-disc list-inside text-gray-700 mb-4">
                  <li>- Clear strategies for relationship success.</li>
                  <li>- Proven techniques to bridge geographical divides.</li>
                  <li>
                    - Essential insights for fostering love and connection.
                  </li>
                </ul>{" "}
                <br />
                <br />
                While focused on long-distance relationships, this book's wisdom
                extends to anyone seeking meaningful connections. Whether you're
                seeking love, strengthening existing bonds, or simply curious
                about relationships, this comprehensive guide is your
                indispensable companion.
              </p>
            </div>
          </div>

          <div className="flex flex-col w-full md:p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none "
                />
              </div>

              {renderCountrySelect()}
              {renderStateSelect()}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                    {metadata.phoneCode}
                  </span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    required
                    className="w-full p-3 border border-gray-300 rounded-r-md focus:outline-none "
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none "
                />
              </div>

              {renderQuantityField()}

              {renderPriceSection()}

              {renderDeliveryInfo()}

              {metadata.error && (
                <div className="p-4 bg-red-50 border border-red-400 rounded-lg">
                  <p className="text-red-700">{metadata.error}</p>
                </div>
              )}

              <div className="p-2 bg-gray-300 rounded-xl border border-gray-500 py-2">
                <p className="pb-5">
                  If you experience any difficulty in proceeding to payments,
                  please send a whatsapp message to{" "}
                  <a
                    href="http://wa.me/+2349115226129"
                    target="_blank"
                    className="text-blue-700 font-bold"
                  >
                    +2349115226129
                  </a>{" "}
                  or an Instagram DM{" "}
                  <a
                    href="https://www.instagram.com/love.passions.wholeness/"
                    target="_blank"
                    className="text-blue-700 font-bold"
                  >
                    @Love.passions.wholeness
                  </a>
                  .
                </p>
                <span className="font-bold">Also note:</span>
                <p>
                  Contact information should be correct and properly spelled. We
                  would not be liable for errors caused by wrong information.
                  Also note that payment made is non-refundable.
                </p>
              </div>

              <button
                type="submit"
                disabled={metadata.loading}
                className={`w-full p-3 text-white font-medium rounded-md ${
                  metadata.loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                }`}
              >
                {metadata.loading ? "Processing..." : "Place Order"}
              </button>
            </form>

            {showSuccessModal && (
              <div className="modal-overlay px-2">
                <div className="modal animated-popup">
                  <div className="modal-header relative">
                    <h2 className="absolute text-right pr-5 sm:text-center z-50 top-3 md:top-4 font-semibold w-full">
                      Order Received
                    </h2>
                    <div className="rounded-full bg-green-100 relative p-3 mb-4">
                      <CheckCircle className="w-10 h-10 md:h-12 md:w-12 text-green-500" />
                    </div>
                  </div>
                  <div className="modal-body">
                    <p>
                      Your order has been successfully saved. We will
                      communicate payment and delivery details to you soon.
                    </p>
                  </div>
                  <div className="modal-footer">
                    <button
                      onClick={() => setShowSuccessModal(false)}
                      className="btn-close"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal {
          background: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 500px;
          width: 100%;
          text-align: center;
        }
        .modal-header h2 {
          margin: 0;
          font-size: 1.5em;
        }
        .modal-body {
          margin: 20px 0;
        }
        .modal-footer {
          text-align: center;
        }
        .btn-close {
          background-color: #000;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn-close:hover {
          background-color: grey;
        }

        /* Animation styles */
        @keyframes popupAnimation {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animated-popup {
          animation: popupAnimation 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default PreorderForm;
