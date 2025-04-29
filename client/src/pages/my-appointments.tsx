import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { MapPin, Calendar } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";

export default function MyAppointments() {
  const { user } = useAuth();
  
  // Fetch user appointments
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/appointments`],
    enabled: !!user?.id,
  });
  
  // Separate upcoming and past appointments
  const today = new Date();
  
  const upcomingAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(`${appointment.date}T${appointment.time.replace(' AM', ':00').replace(' PM', ':00')}`);
    return appointmentDate >= today;
  });
  
  const pastAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(`${appointment.date}T${appointment.time.replace(' AM', ':00').replace(' PM', ':00')}`);
    return appointmentDate < today;
  });
  
  // Format date for display
  const formatAppointmentDate = (dateStr: string) => {
    return format(new Date(dateStr), "EEEE, MMMM d, yyyy");
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
          <p className="text-gray-600 mt-2">
            Manage your upcoming and past appointments
          </p>
        </div>
        
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">
              Upcoming Appointments
              {upcomingAppointments.length > 0 && (
                <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                  {upcomingAppointments.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="past">
              Past Appointments
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 2 }).map((_, index) => (
                <Card key={index} className="mb-4">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <Skeleton className="h-16 w-16 rounded-full mr-4" />
                      <div className="flex-1">
                        <Skeleton className="h-7 w-48 mb-2" />
                        <Skeleton className="h-5 w-32 mb-4" />
                        <div className="flex justify-between">
                          <div>
                            <Skeleton className="h-5 w-40 mb-2" />
                            <Skeleton className="h-5 w-32 mb-2" />
                          </div>
                          <Skeleton className="h-10 w-32" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="mb-4">
                  <CardContent className="p-6">
                    <div className="md:flex md:items-start">
                      <div className="md:flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                        <img 
                          className="h-16 w-16 object-cover rounded-full" 
                          src={appointment.doctor?.imageUrl} 
                          alt={appointment.doctor?.name} 
                        />
                      </div>
                      <div className="md:flex-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {appointment.doctor?.name}
                        </h3>
                        <p className="text-primary font-medium">
                          {appointment.doctor?.specialty}
                        </p>
                        
                        <div className="mt-4 grid md:grid-cols-2 gap-3">
                          <div className="flex items-start">
                            <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                            <div>
                              <p className="text-gray-800 font-medium">
                                {formatAppointmentDate(appointment.date)}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {appointment.time}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                            <div>
                              <p className="text-gray-800 font-medium">
                                Office Visit
                              </p>
                              <p className="text-gray-600 text-sm">
                                {appointment.doctor?.address}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div className="flex">
                            <Button variant="outline" size="sm" className="mr-2">
                              Reschedule
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                              Cancel
                            </Button>
                          </div>
                          <div className="text-sm text-gray-600">
                            Appointment ID: <span className="font-medium">{appointment.appointmentId}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertTitle className="text-blue-800">No upcoming appointments</AlertTitle>
                <AlertDescription className="text-blue-700">
                  You don't have any upcoming appointments scheduled.
                  <div className="mt-4">
                    <Button asChild>
                      <Link href="/find-doctor">Find a Doctor</Link>
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {isLoading ? (
              // Loading skeletons
              <Card className="mb-4">
                <CardContent className="p-6">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ) : pastAppointments.length > 0 ? (
              pastAppointments.map((appointment) => (
                <Card key={appointment.id} className="mb-4">
                  <CardContent className="p-6">
                    <div className="md:flex md:items-start">
                      <div className="md:flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                        <img 
                          className="h-16 w-16 object-cover rounded-full" 
                          src={appointment.doctor?.imageUrl} 
                          alt={appointment.doctor?.name} 
                        />
                      </div>
                      <div className="md:flex-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {appointment.doctor?.name}
                        </h3>
                        <p className="text-primary font-medium">
                          {appointment.doctor?.specialty}
                        </p>
                        
                        <div className="mt-4 grid md:grid-cols-2 gap-3">
                          <div className="flex items-start">
                            <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                            <div>
                              <p className="text-gray-800 font-medium">
                                {formatAppointmentDate(appointment.date)}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {appointment.time}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                            <div>
                              <p className="text-gray-800 font-medium">
                                Office Visit
                              </p>
                              <p className="text-gray-600 text-sm">
                                {appointment.doctor?.address}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div className="flex">
                            <Button variant="outline" size="sm" className="mr-2">
                              Book Again
                            </Button>
                            <Button variant="outline" size="sm">
                              Leave Review
                            </Button>
                          </div>
                          <div className="text-sm text-gray-600">
                            Appointment ID: <span className="font-medium">{appointment.appointmentId}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Alert className="bg-gray-50 border-gray-200">
                <AlertTitle className="text-gray-800">No past appointments</AlertTitle>
                <AlertDescription className="text-gray-700">
                  You don't have any past appointments with our doctors.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
