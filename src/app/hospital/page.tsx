"use client"
import React, { useEffect, useState } from "react";
import HospitalList from "../components/HospitalList";
import Pagination from "../components/pagination";
import { CSVLink } from "react-csv";

const SkeletonCard: React.FC = () => (
  <div className="flex flex-col gap-4">
    <div className="skeleton h-32 w-full"></div>
    <div className="skeleton h-4 w-28"></div>
    <div className="skeleton h-4 w-full"></div>
    <div className="skeleton h-4 w-full"></div>
  </div>
);

const MyHospitals: React.FC = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage] = useState<number>(12);
  
  const [searchInput, setSearchInput] = useState<string>("");
  const [filteredProviders, setFilteredProviders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProviders = () => {
      setIsLoading(true);
      fetch("https://api.reliancehmo.com/v3/providers")
        .then((res) => res.json())
        .then((response) => {
          if (isMounted) {
            setProviders(response?.data);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };

    fetchProviders();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    fetch("https://api.reliancehmo.com/v3/providers")
      .then((res) => res.json())
      .then((response) => {
        setProviders(response?.data);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  useEffect(() => {
    const filtered = providers.filter((provider: any) => {
      const { name, state } = provider;
      const searchValue = searchInput.toLowerCase();
      return (
        name.toLowerCase().includes(searchValue) ||
        state.name.toLowerCase().includes(searchValue)
      );
    });
    setFilteredProviders(filtered);
  }, [searchInput, providers]);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;

  const currentPosts = filteredProviders.length
    ? filteredProviders.slice(firstPostIndex, lastPostIndex)
    : providers.slice(firstPostIndex, lastPostIndex);

    const handleShare = () => {
      if (typeof window !== "undefined" && navigator.share) {
        const shareData = {
          title: "Selected Providers",
          text: "Check out these selected providers!",
          url: window.location.href,
        };
    
        navigator
          .share(shareData)
          .then(() => {
            console.log("Successfully shared.");
          })
          .catch((error) => {
            console.error("Error sharing:", error);
          });
      } else {
        console.log("Web Share API not supported in this browser.");
      }
    };
    

  return (
    <section className="bg-Primary py-20 min-h-screen translate-y-20 w-auto ">
 
      <div className="container overscroll-auto box-border h-auto w-3/4  -mt-40 pb-4 bg-white m-auto shadow-xl rounded-lg shadow-lg md:w-full">
        <h2 className="text-Grey/800 text-2xl font-bold md: text-4 lg:text-3xl text-center  mb-6 p-8">
          Hospitals in Nigeria
        </h2>
        <div className="p-2 flex flex-col items-center rounded-md gap-12 divider-y-2">
          <form className="w-full md:w-full">
            <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>

              <input
                type="search"
                id="default-search"
                className="block w-full p-4 pl-10 text-sm text-Grey/900 border border-Grey/600 rounded-lg bg-gray-50 focus:ring-Primary focus:border-Primary dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-Primary dark:focus:Primary"
                placeholder="Search by city or state"
                required
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </form>
          <div className="grid grid-row-4 grid-cols-4 gap-12">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : null }
          </div>
          <div className=" grid grid-row-4 gap-12">
           {!isLoading? <HospitalList providers={currentPosts} /> : null} 
          </div>
          <Pagination
            totalPosts={filteredProviders.length}
            postsPerPage={postsPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />

          <div className="flex flex-wrap items-center gap-4 w-full ">
            <p className="font-medium">
              {" "}
              Showing {filteredProviders.length} Locations
            </p>
            <div className="flex gap-4">
              <button className="btn btn-secondary" onClick={handleShare}>
                Share
              </button>
              <button className="btn btn-secondary hover:bg-Primary">
                <CSVLink data={filteredProviders}>Download CSV</CSVLink>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyHospitals;

function setError(error: any) {
  throw new Error("Function not implemented.");
}
