import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, MapPin } from "lucide-react";
import { getSpecialties } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { SPECIALTIES } from "@shared/schema";

// Form validation schema
const formSchema = z.object({
  specialty: z.string().optional(),
  location: z.string().optional(),
});

type SearchFormValues = z.infer<typeof formSchema>;

interface SearchFormProps {
  onSearch: (data: SearchFormValues) => void;
  initialValues?: SearchFormValues;
}

export default function SearchForm({ onSearch, initialValues }: SearchFormProps) {
  const [specialties, setSpecialties] = useState<string[]>(SPECIALTIES);
  
  // Get specialties from the API
  const { data: apiSpecialties } = useQuery({
    queryKey: ['/api/specialties'],
    enabled: true,
  });
  
  useEffect(() => {
    if (apiSpecialties) {
      setSpecialties(apiSpecialties);
    }
  }, [apiSpecialties]);
  
  // Set up form with initial values
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      specialty: "",
      location: "",
    },
  });
  
  // Handle form submission
  function handleSubmit(data: SearchFormValues) {
    onSearch(data);
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 md:space-y-0 md:grid md:grid-cols-12 md:gap-4">
        <FormField
          control={form.control}
          name="specialty"
          render={({ field }) => (
            <FormItem className="md:col-span-5">
              <FormLabel className="text-sm font-medium text-gray-700">Medical Specialty</FormLabel>
              <div className="relative">
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full py-6">
                      <SelectValue placeholder="All Specialties" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="md:col-span-5">
              <FormLabel className="text-sm font-medium text-gray-700">Location</FormLabel>
              <div className="relative">
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="Enter city or zip code" 
                      className="pl-4 pr-10 py-6"
                      {...field} 
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </FormControl>
              </div>
            </FormItem>
          )}
        />
        
        <div className="md:col-span-2">
          <FormLabel className="invisible block text-sm font-medium text-gray-700">Search</FormLabel>
          <Button type="submit" className="w-full py-6">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </form>
    </Form>
  );
}
