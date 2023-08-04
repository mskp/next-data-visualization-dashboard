"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/Header";
import Country from "@/components/Country"
import Histogram from "@/components/Histogram";

const serverHost = "https://dv-dash-api.vercel.app";

export default function Home() {
  const [data, setData] = useState([]);
  const [intensities, setIntensities] = useState([]);
  const [likelihood, setLikelihood] = useState([]);
  const [relevance, setRelevance] = useState([]);
  const [endYear, setEndYear] = useState([]);
  const [startYear, setStartYear] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetchData();
  }, [])

  useEffect(() => {
    setIntensities(data.map(curr => curr.intensity));
    setLikelihood(data.map(curr => curr.likelihood))
    setRelevance(data.map(curr => curr.relevance))
    setEndYear(data.map(curr => curr.end_year))
    setStartYear(data.map(curr => curr.start_year))
    setCountries(data.map(curr => curr.country))
  }, [data]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${serverHost}/api/data`);
      if (response.status === 200) {
        setData(response.data);
        console.log("Data Fetching Done");
      }
      else {
        throw new Error("Error Fetching Data");
      }

    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <Header />
      <main>
        <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
          <Histogram data={intensities} title={"Intensity"} />
          <Histogram data={likelihood} title={"Likelihood"} />
          <Histogram data={relevance} title={"Relevance"} />
          <Histogram data={startYear} title={"Start Year"} />
          <Histogram data={endYear} title={"End Year"} />
          <Country data={countries} />
        </div>
      </main>
    </div>
  )
}

