import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { type SearchFilters } from "@shared/schema";

interface FilterBarProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const toggleFilter = (filterName: keyof SearchFilters) => {
    onFilterChange({
      ...filters,
      [filterName]: !filters[filterName]
    });
  };
  
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-700 mr-2">Filters:</span>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={filters.availableToday ? "default" : "outline"}
          size="sm"
          className={`rounded-full text-sm h-8 ${
            filters.availableToday 
              ? "bg-primary text-white" 
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          }`}
          onClick={() => toggleFilter("availableToday")}
        >
          {filters.availableToday && <CheckCircle2 className="mr-1 h-3 w-3" />}
          Available Today
        </Button>
        
        <Button
          variant={filters.onlineConsultation ? "default" : "outline"}
          size="sm"
          className={`rounded-full text-sm h-8 ${
            filters.onlineConsultation 
              ? "bg-primary text-white" 
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          }`}
          onClick={() => toggleFilter("onlineConsultation")}
        >
          {filters.onlineConsultation && <CheckCircle2 className="mr-1 h-3 w-3" />}
          Online Consultations
        </Button>
        
        <Button
          variant={filters.acceptsInsurance ? "default" : "outline"}
          size="sm"
          className={`rounded-full text-sm h-8 ${
            filters.acceptsInsurance 
              ? "bg-primary text-white" 
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          }`}
          onClick={() => toggleFilter("acceptsInsurance")}
        >
          {filters.acceptsInsurance && <CheckCircle2 className="mr-1 h-3 w-3" />}
          Insurance Accepted
        </Button>
      </div>
    </div>
  );
}
