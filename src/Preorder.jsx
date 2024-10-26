import React, { useState, useEffect } from "react";
import countriesData from "./countries.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ban from "./assets/emb.png";
import banm from "./assets/banm.jpeg";

const PreorderForm = () => {
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    address: "",
    delivery_type: "",
  });

  const [metadata, setMetadata] = useState({
    countries: [],
    states: [],
    phoneCode: "",
    priceData: { currency: "", price: "" },
    deliveryFees: [],
    loading: false,
    error: "",
  });

  // Specified countries map
  const countryMap = {
    GB: "United Kingdom",
    NG: "Nigeria",
    GH: "Ghana",
    DE: "Germany",
    US: "United States",
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

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft() {
    const targetDate = new Date("2023-10-27T00:00:00");
    const now = new Date();
    const difference = targetDate - now;

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  const renderCountdown = () => {
    return (
      <div className="countdown">
        <div className="time">
          {timeLeft.days || "0"}d {timeLeft.hours || "0"}h {timeLeft.minutes || "0"}m {timeLeft.seconds || "0"}s
        </div>
      </div>
    );
  };

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
  }, [formData.state]);

  useEffect(() => {
    if (metadata.deliveryFees.length === 1) {
      setFormData((prev) => ({
        ...prev,
        delivery_type: metadata.deliveryFees[0].id,
      }));
    }
  }, [metadata.deliveryFees]);

  const getEffectiveCountry = (countryCode) => {
    // If the country is in our specified list, use it; otherwise, use US
    return countryMap[countryCode] ? countryMap[countryCode] : "United States";
  };

  const fetchPrice = async (countryCode) => {
    try {
      const effectiveCountry = getEffectiveCountry(countryCode);
      const response = await fetch(
        `https://lovepassionsandwholeness.com/api/price/${effectiveCountry}`
      );
      const data = await response.json();

      if (data.status === "success") {
        setMetadata((prev) => ({
          ...prev,
          priceData: data.data,
        }));
      }
    } catch (error) {
      setMetadata((prev) => ({ ...prev, error: "Failed to fetch price" }));
    }
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
            fee: parseFloat(fee.fee).toFixed(2),
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
      // Get the selected country's full name from the countries data
      const selectedCountry = metadata.countries.find(
        (c) => c.code2 === formData.country
      );

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        country: selectedCountry?.name || "", // Use the actual country name
        state: formData.state,
        address: formData.address,
        delivery_type: formData.delivery_type,
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
        toast.success("Form submitted successfully!")
        setTimeout(() => {
          window.open(data.data, "_blank");
        }, 3000);
      } else {
        setMetadata((prev) => ({ ...prev, error: data.message }));
      }
    } catch (error) {
      setMetadata((prev) => ({ ...prev, error: "Failed to submit order" }));
    } finally {
      setMetadata((prev) => ({ ...prev, loading: false }));
    }
  };

  const renderDeliveryInfo = () => {
    if (metadata.deliveryFees.length === 0) return null;

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
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none "
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

  return (
    <>
      <img
        src={banm}
        className="hidden md:flex h-[250px object-cover w-full -z-20"
        alt=""
      />
      <div className="absolute h-screen w-full bg-black opacity-50"></div>
      <div className="absolute flex items-center justify-center w-full top-32 text-white text-3xl font-bold">
      {renderCountdown()}
      </div>
      <img src={banm} className="md:hidden w-full" alt="" />
      <div className="flex justify-center py-10 absolute z-[9999] bg-white ">
        <div className="bg-white w-full grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-12">
          <div className="flex flex-col">
            <h3 className="text-[18px] font-[600] mb-4">Details</h3>
            <div className="flex mb-6 relative">
              <img src={ban} alt="Embrace Book" className="w-48 h-auto" />
              <div className="flex flex-col absolute left-[13rem] bottom-0">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      country: e.target.value,
                      state: "",
                      delivery_type: "",
                    }))
                  }
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none "
                >
                  <option value="">Select country</option>
                  {metadata.countries.map((country) => (
                    <option key={country.code2} value={country.code2}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {metadata.states.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none "
                  >
                    <option value="">Select state</option>
                    {metadata.states.map((state) => (
                      <option key={state.code} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

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

              {metadata.priceData.price && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg font-semibold">
                    Book Price: {metadata.priceData.currency}{" "}
                    {metadata.priceData.price}
                  </p>
                </div>
              )}


              {renderDeliveryInfo()}

              {metadata.error && (
                <div className="p-4 bg-red-50 border border-red-400 rounded-lg">
                  <p className="text-red-700">{metadata.error}</p>
                </div>
              )}

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

            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PreorderForm;
