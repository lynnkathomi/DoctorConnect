import { format } from "date-fns";
import { Calendar, Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type Doctor, type Appointment } from "@shared/schema";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Appointment;
  doctor: Doctor;
}

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  booking, 
  doctor 
}: ConfirmationModalProps) {
  // Format the date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "EEEE, MMMM d, yyyy");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          
          <h3 className="text-xl font-medium text-gray-900 mb-2">Appointment Confirmed!</h3>
          <p className="text-gray-600 mb-6">
            Your appointment with {doctor.name} has been scheduled for {formatDate(booking.date)} at {booking.time}.
          </p>
          
          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Appointment ID:</span>
              <span className="font-medium">{booking.appointmentId}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">Patient:</span>
              <span className="font-medium">{booking.patientName}</span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Add to Calendar
            </Button>
            <Button onClick={onClose} className="flex-1">
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
