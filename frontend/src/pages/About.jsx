const About = () => {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-heading font-bold text-corporateBlue mb-8 text-center">About Janki Ballabh Services</h1>
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <p className="text-lg text-slate-600 mb-6 leading-relaxed">
            Janki Ballabh Services is a premier industrial infrastructure and renewable energy services company. We specialize in water pipeline laying, civil construction, fiber maintenance, solar piling, MMS structure work, and AC/DC electrical work.
          </p>
          <p className="text-lg text-slate-600 mb-6 leading-relaxed">
            Partnering with industry giants like L&T and Waaree Renewable Energy, we deliver projects with an uncompromising commitment to safety, innovation, and quality.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
             <div className="p-6 bg-slate-50 rounded-lg">
                <h3 className="text-3xl font-bold text-corporateGold mb-2">Our Vision</h3>
                <p className="text-sm text-slate-600">To be the most trusted infrastructure partner in India.</p>
             </div>
             <div className="p-6 bg-slate-50 rounded-lg">
                <h3 className="text-3xl font-bold text-corporateGold mb-2">Our Mission</h3>
                <p className="text-sm text-slate-600">Delivering excellence through innovation and safety.</p>
             </div>
             <div className="p-6 bg-slate-50 rounded-lg">
                <h3 className="text-3xl font-bold text-corporateGold mb-2">Our Values</h3>
                <p className="text-sm text-slate-600">Integrity, Quality, and Client Satisfaction.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
