import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDoctors } from "@/lib/api";
import { type Doctor, type SearchFilters } from "@shared/schema";
import Header from "@/components/layout/header";
import SearchForm from "@/components/search/search-form";
import FilterBar from "@/components/search/filter-bar";
import DoctorCard from "@/components/doctors/doctor-card";

export default function FindDoctor() {
  const [location, params] = useLocation();
  const urlParams = new URLSearchParams(params);
  
  // Get specialty from URL if present
  const specialtyFromUrl = urlParams.get("specialty") || "";
  
  // Set initial search filters
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    specialty: specialtyFromUrl,
    location: "",
    availableToday: false,
    onlineConsultation: false,
    acceptsInsurance: false,
  });
  
  // Set up sorting state
  const [sortBy, setSortBy] = useState<string>("recommended");
  
  // Fetch doctors with current filters
  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ["/api/doctors", searchFilters],
    enabled: true,
  });
  
  // Handle search form submission
  const handleSearch = (data: { specialty?: string; location?: string }) => {
    setSearchFilters(prev => ({
      ...prev,
      specialty: data.specialty || prev.specialty,
      location: data.location || prev.location,
    }));
  };
  
  // Handle filter changes
  const handleFilterChange = (filters: SearchFilters) => {
    setSearchFilters(prev => ({
      ...prev,
      ...filters,
    }));
  };
  
  // Sort doctors based on selected sort option
  const sortedDoctors = [...doctors].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (parseFloat(b.rating || "0") - parseFloat(a.rating || "0"));
      case "experience":
        return ((b.experience?.match(/\d+/) || ["0"])[0] as any) - ((a.experience?.match(/\d+/) || ["0"])[0] as any);
      default:
        return 0; // Default to order from API
    }
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Section */}
        <section className="mb-8">
          <Card>
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Find & Book a Medical Specialist</h1>
              
              <SearchForm
                onSearch={handleSearch}
                initialValues={{
                  specialty: searchFilters.specialty,
                  location: searchFilters.location,
                }}
              />
              
              <FilterBar
                filters={searchFilters}
                onFilterChange={handleFilterChange}
              />
            </CardContent>
          </Card>
        </section>
        
        {/* Results Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {isLoading ? (
                <Skeleton className="h-8 w-40" />
              ) : (
                `${doctors.length} Doctors Found`
              )}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="text-sm border-gray-300 rounded-md py-1 w-40">
                  <SelectValue placeholder="Recommended" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="mb-4">
                <CardContent className="p-6">
                  <div className="md:flex md:items-start">
                    <div className="md:flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                      <Skeleton className="h-28 w-28 rounded-full" />
                      <div className="mt-2">
                        <Skeleton className="h-6 w-24" />
                      </div>
                    </div>
                    <div className="md:flex-1">
                      <Skeleton className="h-7 w-48 mb-2" />
                      <Skeleton className="h-6 w-32 mb-4" />
                      <Skeleton className="h-5 w-full mb-2" />
                      <Skeleton className="h-5 w-full mb-2" />
                      <Skeleton className="h-5 w-full mb-6" />
                      <div className="grid grid-cols-5 gap-2 mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Skeleton key={i} className="h-10 w-full" />
                        ))}
                      </div>
                      <div className="flex justify-between">
                        <Skeleton className="h-9 w-32" />
                        <Skeleton className="h-9 w-40" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : sortedDoctors.length > 0 ? (
            // Doctor list
            sortedDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))
          ) : (
            // No results
            <Card className="mb-4">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
                <p className="text-gray-600">
                  Try adjusting your search filters or try a different specialty.
                </p>
              </CardContent>
            </Card>
          )}
          
          {/* Pagination - to be implemented in future iterations */}
          {doctors.length > 0 && (
            <div className="mt-6 flex justify-center">
              <nav className="inline-flex rounded-md shadow">
                <a href="#" className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Previous
                </a>
                <a href="#" className="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-primary">
                  1
                </a>
                <a href="#" className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </a>
                <a href="#" className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
                </a>
                <a href="#" className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Next
                </a>
              </nav>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
