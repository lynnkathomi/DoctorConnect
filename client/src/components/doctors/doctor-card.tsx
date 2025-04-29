import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Heart, MapPin, Briefcase, CreditCard, Star } from "lucide-react";
import { type Doctor } from "@shared/schema";
import AppointmentSlots from "./appointment-slots";
import BookingModal from "./booking-modal";
import { useQuery } from "@tanstack/react-query";
import { getDoctorSlots } from "@/lib/api";

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { toast } = useToast();
  
  // Get available slots for this doctor
  const { data: slots = [], isLoading } = useQuery({
    queryKey: [`/api/doctors/${doctor.id}/slots`],
    enabled: true,
  });
  
  // Handle slot selection
  const handleSelectSlot = (slotId: number) => {
    setSelectedSlotId(slotId);
  };
  
  // Handle booking button click
  const handleBookClick = () => {
    if (!selectedSlotId) {
      toast({
        title: "No time slot selected",
        description: "Please select an appointment time",
        variant: "destructive",
      });
      return;
    }
    
    setIsBookingModalOpen(true);
  };
  
  // Get the selected slot
  const selectedSlot = slots.find(slot => slot.id === selectedSlotId);
  
  return (
    <>
      <Card className="mb-4 overflow-hidden">
        <CardContent className="p-6">
          <div className="md:flex md:items-start">
            <div className="md:flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <img 
                className="h-28 w-28 object-cover rounded-full mx-auto md:mx-0" 
                src={doctor.imageUrl} 
                alt={doctor.name} 
              />
              <div className="mt-2 flex justify-center md:justify-start">
                {doctor.availableToday && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600 mr-1.5"></span>
                    Available Today
                  </Badge>
                )}
                {doctor.onlineConsultation && (
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                    <span className="mr-1">🎥</span> Online Available
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="md:flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                  <p className="text-primary font-medium">{doctor.specialty}</p>
                  
                  <div className="mt-2 flex items-center">
                    <div className="flex items-center text-yellow-400">
                      {[...Array(5)].map((_, i) => {
                        const rating = parseFloat(doctor.rating || "0");
                        const isHalf = i + 0.5 === rating;
                        const isFilled = i + 1 <= rating;
                        
                        return (
                          <Star 
                            key={i}
                            className={`h-4 w-4 ${isFilled ? 'fill-current' : 'text-gray-300'}`} 
                            fill={isFilled ? 'currentColor' : 'none'}
                          />
                        );
                      })}
                    </div>
                    <span className="ml-1 text-sm text-gray-600">
                      {doctor.rating} ({doctor.reviewCount} reviews)
                    </span>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-600">
                    <p className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      {doctor.address}
                    </p>
                    <p className="flex items-center mt-1">
                      <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                      {doctor.experience}
                    </p>
                    <p className="flex items-center mt-1">
                      <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                      {doctor.acceptsInsurance ? 'Accepts most insurance' : 'Self-pay only'}
                    </p>
                  </div>
                </div>
                
                <div className="hidden md:block">
                  <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm" size="sm">
                    <Heart className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
              
              <AppointmentSlots
                slots={slots}
                isLoading={isLoading}
                selectedSlotId={selectedSlotId}
                onSelectSlot={handleSelectSlot}
              />
              
              <div className="mt-4 flex justify-between items-center">
                <Button variant="link" className="text-sm text-primary hover:text-primary/80 p-0">
                  Show more times
                </Button>
                <Button 
                  onClick={handleBookClick}
                  disabled={!selectedSlotId}
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isBookingModalOpen && selectedSlot && (
        <BookingModal
          doctor={doctor}
          slot={selectedSlot}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}
    </>
  );
}
