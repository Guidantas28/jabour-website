export default function BookAppointmentPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-primary-50 to-white section-padding">
        <div className="container-custom">
          <h1 className="text-5xl font-serif font-bold text-primary-900 mb-4">
            Book Your Free Appointment
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
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-serif font-normal text-primary-900">
                  Select Your Preferred Date and Time
                </h2>
                <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto">
                  Click the button below to open our booking calendar where you can choose a convenient date and time for your appointment.
                </p>
              </div>
              
              <div className="pt-4">
                <a
                  href="https://calendar.app.google/8CrGK2i6DBkRdua48"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary-900 hover:bg-primary-800 text-white font-serif font-normal text-lg px-12 py-4 rounded-sm transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Open Booking Calendar
                </a>
              </div>

              <div className="pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  You'll be redirected to our Google Calendar booking page to select your preferred appointment time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
