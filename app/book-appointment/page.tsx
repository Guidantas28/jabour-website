export default function BookAppointmentPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-primary-50 to-white section-padding">
        <div className="container-custom">
          <h1 className="text-5xl font-serif font-bold text-primary-900 mb-4">
            Book Your Appointment
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Meet with one of our experts in-store or online. We'll guide you through choosing
            your diamond or gemstone, understanding styles and designing your ring.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-lg p-12">
            <div className="text-center space-y-8 mb-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-serif font-normal text-primary-900">
                  Select Your Preferred Date and Time
                </h2>
                <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto">
                  Choose a convenient date and time for your appointment using the calendar below.
                </p>
              </div>
            </div>
            
            {/* Google Calendar Appointment Scheduling */}
            <iframe 
              src="https://calendar.google.com/calendar/appointments/AcZssZ3Xe-KXeVdqxYosRobNO1fIgn83Cru5edTR-uQ=?gv=true" 
              style={{ border: 0 }} 
              width="100%" 
              height="600" 
              frameBorder="0"
              title="Google Calendar Appointment Scheduling"
            ></iframe>
            {/* end Google Calendar Appointment Scheduling */}
          </div>
        </div>
      </section>
    </div>
  )
}
