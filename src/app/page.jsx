"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/Header";
import Histogram from "@/components/Histogram";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export default function Home() {
  const [data, setData] = useState([]);
  const [intensities, setIntensities] = useState([]);
  const [likelihood, setLikelihood] = useState([]);
  const [relevance, setRelevance] = useState([]);
  const [endYear, setEndYear] = useState([]);
  const [startYear, setStartYear] = useState([]);

  useEffect(() => fetchData(), [])

  useEffect(() => {
    setIntensities(data.map(curr => curr.intensity));
    setLikelihood(data.map(curr => curr.likelihood))
    setRelevance(data.map(curr => curr.relevance))
    setEndYear(data.map(curr => curr.end_year))
    setStartYear(data.map(curr => curr.start_year))
  }, [data]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/data`);
      if (response.status === 200) {
        setData(response.data);
      } else {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Histogram data={intensities} title={"Intensity"} />
          <Histogram data={likelihood} title={"Likelihood"} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Histogram data={relevance} title={"Relevance"} />
          <Histogram data={startYear} title={"Start Year"} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Histogram data={endYear} title={"End Year"} />
        </div>
      </main>
    </div>
  )
}