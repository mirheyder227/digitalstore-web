import React, { useState } from "react";
// Assuming hand_Image is still used elsewhere or will be re-used, keeping the import.
import hand_Image from "../../assets/image/aboutUs/hands-pick.png"; 

const AboutUs = () => {
  const [activeSection, setActiveSection] = useState("ourCompany");

  return (
    <section className="min-h-screen flex flex-col items-center justify-start bg-gray-950 text-white pb-16 font-sans">
      <div className="relative w-full flex items-center justify-center overflow-hidden min-h-[550px] lg:min-h-[650px] shadow-lg">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700 ease-in-out transform scale-100 hover:scale-105"
          style={{
            backgroundImage: `url(${hand_Image})`,
            backgroundSize: "max(100%, 750px) auto",
            backgroundPosition: "center center",
          }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-black opacity-70"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center p-6">
          <h2 className="text-6xl md:text-7xl font-extrabold mb-5 drop-shadow-2xl animate-fade-in-down text-gradient-to-r from-white to-gray-300">
            ABOUT US
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold drop-shadow-xl mb-4 animate-fade-in-down delay-100 text-green-400">
            ULTIMATE SERVICE
          </h3>
          <p className="mt-3 text-xl md:text-2xl max-w-3xl leading-relaxed animate-fade-in-down delay-200 text-gray-200">
            Customer-oriented, innovatively moving with the times, and profoundly dedicated
            to delivering excellence in every facet of our operations.
          </p>
        </div>
      </div>

      <div className="mt-20 w-full max-w-6xl flex flex-col items-center px-6">
        <div className="flex gap-5 md:gap-8 flex-wrap justify-center mb-16">
          {["ourCompany", "joinUs", "contactUs"].map((sectionKey) => (
            <button
              key={sectionKey}
              className={`
                px-10 py-4 rounded-full border-2 text-xl font-semibold transition-all duration-400 ease-in-out
                ${
                  activeSection === sectionKey
                    ? "border-green-600 bg-gradient-to-r from-green-500 to-green-700 text-white shadow-xl transform scale-105"
                    : "border-gray-400 text-gray-300 hover:border-green-400 hover:text-green-400 hover:bg-gray-800 hover:shadow-md"
                }
              `}
              onClick={() => setActiveSection(sectionKey)}
            >
              {sectionKey === "ourCompany" ? "Our Company" : sectionKey === "joinUs" ? "Join Us" : "Contact Us"}
            </button>
          ))}
        </div>

        <div className="w-full">
          {activeSection === "ourCompany" && (
            <div className="text-center p-10 bg-gray-800 bg-opacity-80 rounded-3xl shadow-3xl border border-gray-700 animate-fade-in-up">
              <h3 className="text-5xl font-extrabold mb-6 text-green-400 leading-tight">
                Shaping the Future Through Innovation
              </h3>
              <p className="text-2xl leading-loose max-w-4xl mx-auto text-gray-100">
                At our company, we are committed to building **smart**, **efficient**, and
                **sustainable** solutions that pave the way for a brighter tomorrow. By seamlessly blending
                cutting-edge technology with creative vision, we consistently deliver services and products
                that truly make a difference. Every project we undertake underscores our unwavering
                dedication to **superior quality**, **pioneering innovation**, and absolute **customer satisfaction**.
              </p>
            </div>
          )}

          {activeSection === "joinUs" && (
            <div className="text-center p-10 bg-gray-800 bg-opacity-80 rounded-3xl shadow-3xl border border-gray-700 animate-fade-in-up">
              <h3 className="text-5xl font-extrabold mb-6 text-green-400 leading-tight">
                Become Part of an Ambitious Team
              </h3>
              <p className="text-2xl leading-loose max-w-4xl mx-auto text-gray-100">
                We actively seek passionate, highly talented, and forward-thinking
                individuals to join our rapidly expanding team. At our company,
                you'll gain unparalleled opportunities to collaborate on exciting and
                high-impact projects, cultivate new skills, and strategically shape your
                career within a dynamic, empowering, and exceptionally supportive environment.
                Explore our **current openings** and embark on your rewarding journey with us today!
              </p>
            </div>
          )}

          {activeSection === "contactUs" && (
            <div className="text-center p-10 bg-gray-800 bg-opacity-80 rounded-3xl shadow-3xl border border-gray-700 animate-fade-in-up">
              <h3 className="text-5xl font-extrabold mb-6 text-green-400 leading-tight">
                Let’s Connect and Collaborate
              </h3>
              <p className="text-2xl leading-loose max-w-4xl mx-auto text-gray-100">
                Do you have a question, an innovative idea, or a project in mind
                that you'd like to discuss? We genuinely welcome your inquiries!
                Please reach out to our dedicated team for expert assistance,
                comprehensive support, or exciting partnership opportunities. You can
                fill out the convenient form below or email us directly — we are
                committed to responding promptly and building strong, lasting relationships.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-20 w-full flex flex-wrap justify-center gap-10 px-6">
        <div className="w-52 h-52 flex flex-col items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white shadow-2xl p-6 text-center transform hover:scale-110 transition-transform duration-400 cursor-pointer border-4 border-green-400">
          <h4 className="text-3xl font-extrabold">200+</h4>
          <p className="text-base mt-2 font-medium">Countries & Regions</p>
        </div>

        <div className="w-52 h-52 flex flex-col items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-2xl p-6 text-center transform hover:scale-110 transition-transform duration-400 cursor-pointer border-4 border-blue-400">
          <h4 className="text-3xl font-extrabold">700M+</h4>
          <p className="text-base mt-2 font-medium">Active Users</p>
        </div>

        <div className="w-52 h-52 flex flex-col items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-2xl p-6 text-center transform hover:scale-110 transition-transform duration-400 cursor-pointer border-4 border-purple-400">
          <h4 className="text-3xl font-extrabold">70%</h4>
          <p className="text-base mt-2 font-medium">Market Share (Third Party FOTA)</p>
        </div>
      </div>

      {/* NEW AND IMPROVED NEWSLETTER SECTION */}
      <section className="w-full bg-gradient-to-br from-gray-800 to-gray-900 py-24 px-6 mt-24 relative overflow-hidden rounded-3xl mx-auto max-w-7xl shadow-3xl border border-gray-700">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-500 rounded-full opacity-10 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl transform translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 text-center md:text-left">
          {/* Text Content */}
          <div className="flex flex-col md:w-3/5 gap-6">
            <h3 className="font-extrabold text-white text-5xl md:text-6xl leading-tight drop-shadow-lg">
              Unlock Exclusive <span className="text-yellow-400">Insights</span> & <span className="text-sky-400">Offers</span>!
            </h3>
            <p className="font-light text-gray-300 text-xl md:text-2xl leading-relaxed opacity-95">
              Subscribe to our premium newsletter and be the first to receive early access to
              **new product launches**, **member-only discounts**, in-depth **industry reports**,
              and invitations to exclusive **webinars & events**. Don't miss out!
            </p>
          </div>

          {/* Input and Button */}
          <div className="flex flex-col sm:flex-row gap-5 items-center w-full md:w-2/5 max-w-md">
            <input
              type="email"
              placeholder="Enter your email address"
              aria-label="Your email address"
              className="w-full border-2 border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-4 focus:ring-green-400 focus:border-green-400 rounded-xl p-5 outline-none transition-all duration-300 shadow-xl text-lg font-medium tracking-wide"
            />
            <button className="cursor-pointer w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 active:from-blue-800 active:to-blue-950 border border-blue-600 text-white font-extrabold py-5 px-12 rounded-xl shadow-2xl transition duration-300 ease-in-out transform hover:-translate-y-2 hover:scale-105 text-xl tracking-wider uppercase flex items-center justify-center gap-2">
              Subscribe
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

    </section>
  );
};

export default AboutUs;