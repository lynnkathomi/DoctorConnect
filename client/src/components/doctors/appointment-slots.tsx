import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isToday, isTomorrow } from "date-fns";
import { type AppointmentSlot } from "@shared/schema";

interface AppointmentSlotsProps {
  slots: AppointmentSlot[];
  isLoading: boolean;
  selectedSlotId: number | null;
  onSelectSlot: (slotId: number) => void;
}

export default function AppointmentSlots({ 
  slots, 
  isLoading, 
  selectedSlotId, 
  onSelectSlot 
}: AppointmentSlotsProps) {
  // Display only the next 5 slots
  const displaySlots = slots.slice(0, 5);
  
  // Format the date for display
  const formatSlotDate = (dateStr: string) => {
    const date = new Date(dateStr);
    
    if (isToday(date)) {
      return "Today";
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    } else {
      return format(date, "EEE");
    }
  };
  
  if (isLoading) {
    return (
      <div className="mt-4">
        <h4 className="font-medium text-gray-900 mb-3">Next Available Appointments:</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  if (slots.length === 0) {
    return (
      <div className="mt-4">
        <h4 className="font-medium text-gray-900 mb-3">Next Available Appointments:</h4>
        <p className="text-gray-500 text-sm">No available appointment slots</p>
      </div>
    );
  }
  
  return (
    <div className="mt-4">
      <h4 className="font-medium text-gray-900 mb-3">Next Available Appointments:</h4>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {displaySlots.map((slot) => (
          <Button
            key={slot.id}
            variant="outline"
            size="sm"
            className={`text-sm py-2 px-3 h-auto ${
              selectedSlotId === slot.id
                ? "bg-primary text-white border-primary hover:bg-primary/90 hover:text-white"
                : "bg-gray-100 text-gray-800 border-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => onSelectSlot(slot.id)}
          >
            {formatSlotDate(slot.date)}, {slot.time}
          </Button>
        ))}
      </div>
    </div>
  );
}
