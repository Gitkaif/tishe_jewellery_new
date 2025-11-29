import React from 'react';

const galleryImages = [
  'https://images.unsplash.com/photo-1602173577009-8d7dfde4abcc?auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=500&q=60'
];

const testimonials = [
  {
    quote: 'The quality of the jewelry is exceptional. I get compliments every time I wear my new necklace!',
    author: 'Sarah M.',
    rating: 5
  },
  {
    quote: 'Beautiful pieces and excellent customer service. Will definitely be shopping here again!',
    author: 'Michael T.',
    rating: 5
  },
  {
    quote: 'I was looking for something unique and found exactly what I wanted at Tishe. Highly recommend!',
    author: 'Jennifer K.',
    rating: 5
  }
];

const About = () => {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="uppercase tracking-widest text-sm text-pink-500 font-semibold">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">
            Crafting jewelry that captures your brightest moments
          </h1>
          <p className="text-lg text-gray-600 mt-6 max-w-3xl mx-auto">
            Tishe began with a simple belief: jewelry should feel as beautiful as the story behind it.
            Every design is hand-selected for its craftsmanship, ethical sourcing, and ability to make you feel
            unmistakably you.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Designed with intention</h2>
          <p className="text-gray-600 mb-4">
            From sketchbook to showcase, each piece passes through the hands of dedicated artisans who obsess
            over detail. Materials are responsibly sourced and stones are hand-selected to ensure lasting brilliance.
          </p>
          <p className="text-gray-600 mb-4">
            We partner with family-owned workshops and invest in fair labor practices. When you choose Tishe, you
            support craftsmanship that uplifts communities and honors tradition.
          </p>
          <p className="text-gray-600">
            Whether it&apos;s a milestone gift or an everyday sparkle, our team is here to help you find the perfect match.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {galleryImages.map((src, idx) => (
            <div key={src} className={`h-48 md:h-64 rounded-2xl overflow-hidden ${idx % 2 === 0 ? 'translate-y-3' : '-translate-y-3'}`}>
              <img src={src} alt="Tishe gallery" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What guides us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Craftsmanship', text: 'Each piece is reviewed by master jewelers before it leaves our studio.' },
              { title: 'Ethics', text: 'We only work with partners that meet strict ethical and sustainability standards.' },
              { title: 'Experience', text: 'From virtual styling to custom engraving, we are with you every step.' }
            ].map((item) => (
              <div key={item.title} className="bg-white p-6 rounded-xl shadow border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-pink-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Voices from our community</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.author} className="bg-white p-6 rounded-xl shadow border border-gray-100">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">“{testimonial.quote}”</p>
                <p className="font-semibold text-gray-900">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

