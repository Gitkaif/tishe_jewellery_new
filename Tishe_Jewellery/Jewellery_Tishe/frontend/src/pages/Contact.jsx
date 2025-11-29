import React from 'react';

const contactChannels = [
  {
    title: 'Showroom',
    details: ['22, Artisan Lane, Mumbai', 'Open Mon–Sat, 10am – 7pm'],
    icon: '🏬'
  },
  {
    title: 'Customer Care',
    details: ['+91 98201 12345', 'support@tishejewels.com'],
    icon: '💬'
  },
  {
    title: 'Wholesale & Press',
    details: ['+91 98201 67890', 'press@tishejewels.com'],
    icon: '🤝'
  }
];

const Contact = () => {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-r from-pink-100 via-white to-purple-100 py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="uppercase tracking-widest text-sm text-pink-500 font-semibold">Let&apos;s Talk</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">We&apos;re here to help you shine</h1>
          <p className="text-lg text-gray-600 mt-6">
            Whether you&apos;re customizing a piece, planning a gift, or need guidance with an order, our stylists and
            gem experts are only a message away.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 lg:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Send us a message</h2>
          <p className="text-gray-500 mb-8">We reply within one business day.</p>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-300 focus:outline-none"
                placeholder="Aditi Sharma"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-300 focus:outline-none"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-300 focus:outline-none"
                placeholder="+91 9xxxxxxxxx"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-300 focus:outline-none">
                <option>Custom order</option>
                <option>Existing order</option>
                <option>Wholesale / press</option>
                <option>General question</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-300 focus:outline-none"
                placeholder="How can we help?"
                required
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg shadow"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          {contactChannels.map((channel) => (
            <div key={channel.title} className="bg-white border border-gray-100 rounded-2xl shadow p-6">
              <div className="text-3xl">{channel.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mt-4">{channel.title}</h3>
              <ul className="mt-3 text-gray-600 space-y-1">
                {channel.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
          <div className="bg-pink-600 text-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold">Book a virtual styling</h3>
            <p className="text-white/90 mt-2 mb-4">
              30-minute sessions with our concierge to review designs, sizing, or gifting ideas.
            </p>
            <button className="px-4 py-2 bg-white text-pink-600 font-semibold rounded-lg">Schedule</button>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Visit us</h3>
          <p className="text-gray-600 mb-4">
            Private appointments are available for engagement and bespoke projects. Reach out to plan your visit.
          </p>
          <div className="h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-sm">
            Map coming soon
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

