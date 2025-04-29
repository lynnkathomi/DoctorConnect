#Medi Book – Connecting Patients to the Right Care

A web-based solution that helps consumers effortlessly find and book appointments with nearby medical specialists such as gynecologists, neurologists, and cardiologists. Built with a consumer-first approach to reduce healthcare access barriers and streamline the patient journey.

## Project Scope

- Simplifies specialist discovery based on location and availability
- Enables direct appointment booking with verified doctors
- Offers real-time search and filtering for a seamless user experience
- Designed to reduce wait times and improve access to timely care

## Tech Stack

- Backend: Node.js, Express
- Database: PostgreSQL
- Frontend: React 

## Setup Instructions

1. Clone the repository
   git clone 
   cd specialist-finder

2. Install dependencies
   npm install

3. Configure the database
   - Create a PostgreSQL database (e.g., specialist_finder)
   - Copy .env.example to .env and update your PostgreSQL credentials:
     DATABASE_URL=postgresql://user:password@localhost:5432/specialist_finder

4. Run database migrations (if using Prisma)
   npx prisma migrate dev --name init

5. Start the development server
   npm run dev

6. Visit the application
   Go to http://localhost:3000 in your browser


## Future Enhancements

- SMS or email notifications for appointment confirmations
- Patient reviews and specialist ratings
- Admin dashboard for hospital or clinic staff
- Integration with insurance verification systems

