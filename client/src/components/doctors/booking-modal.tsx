import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { MapPin, X } from "lucide-react";
import { bookAppointment } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Doctor, type AppointmentSlot } from "@shared/schema";
import ConfirmationModal from "./confirmation-modal";

// Form validation schema
const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  dateOfBirth: z.string().min(2, "Date of birth is required"),
  phone: z.string().min(6, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  insuranceProvider: z.string().optional(),
  reasonForVisit: z.string().optional(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

type BookingFormValues = z.infer<typeof formSchema>;

interface BookingModalProps {
  doctor: Doctor;
  slot: AppointmentSlot;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ doctor, slot, isOpen, onClose }: BookingModalProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  
  // Set up form
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      phone: "",
      email: "",
      insuranceProvider: "none",
      reasonForVisit: "",
      termsAccepted: false,
    },
  });
  
  // Setup mutation for booking appointment
  const bookingMutation = useMutation({
    mutationFn: bookAppointment,
    onSuccess: (data) => {
      setBooking(data);
      setShowConfirmation(true);
      queryClient.invalidateQueries({ queryKey: [`/api/doctors/${doctor.id}/slots`] });
    },
  });
  
  // Handle form submission
  const onSubmit = (data: BookingFormValues) => {
    bookingMutation.mutate({
      doctorId: doctor.id,
      slotId: slot.id,
      date: slot.date,
      time: slot.time,
      patientName: data.fullName,
      patientEmail: data.email,
      patientPhone: data.phone,
      patientDob: data.dateOfBirth,
      insuranceProvider: data.insuranceProvider,
      reasonForVisit: data.reasonForVisit,
      userId: 1, // Default user ID as we don't have authentication
      appointmentId: "", // This will be generated on the server
    });
  };
  
  const handleClose = () => {
    if (showConfirmation) {
      setShowConfirmation(false);
    }
    onClose();
  };
  
  // Format the date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "EEEE, MMMM d, yyyy");
  };
  
  return (
    <>
      <Dialog open={isOpen && !showConfirmation} onOpenChange={handleClose}>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex items-center justify-between border-b pb-4">
            <DialogTitle className="text-lg font-bold">Book Appointment</DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center mb-6">
              <img 
                className="h-14 w-14 object-cover rounded-full mr-4" 
                src={doctor.imageUrl} 
                alt={doctor.name} 
              />
              <div>
                <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                <p className="text-primary text-sm">{doctor.specialty}</p>
              </div>
            </div>
            
            <div className="border rounded-md p-4 bg-gray-50 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Appointment Details</span>
                <Button variant="link" className="text-primary text-sm p-0 h-auto">Change</Button>
              </div>
              <div className="text-gray-800">
                <p>{formatDate(slot.date)}</p>
                <p>{slot.time}</p>
                <p className="mt-1 text-sm text-gray-600 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {doctor.address}
                </p>
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="insuranceProvider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Provider</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select insurance" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None/Self-pay</SelectItem>
                          <SelectItem value="Blue Cross Blue Shield">Blue Cross Blue Shield</SelectItem>
                          <SelectItem value="Aetna">Aetna</SelectItem>
                          <SelectItem value="Cigna">Cigna</SelectItem>
                          <SelectItem value="UnitedHealthcare">UnitedHealthcare</SelectItem>
                          <SelectItem value="Medicare">Medicare</SelectItem>
                          <SelectItem value="Medicaid">Medicaid</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reasonForVisit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Visit</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-gray-600">
                          I agree to the <span className="text-primary hover:underline cursor-pointer">terms and conditions</span> and <span className="text-primary hover:underline cursor-pointer">privacy policy</span>.
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="border-t pt-4 mt-6">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={bookingMutation.isPending}
                  >
                    {bookingMutation.isPending ? "Processing..." : "Confirm Booking"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
      
      {showConfirmation && booking && (
        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={handleClose}
          booking={booking}
          doctor={doctor}
        />
      )}
    </>
  );
}
