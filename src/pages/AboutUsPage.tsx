import { Link } from "react-router-dom";
import {
  Heart,
  Target,
  Lightbulb,
  Users,
  Rocket,
  Award,
  Code2,
  Brain,
  Zap,
  ArrowRight,
  CheckCircle2,
  Github,
  Linkedin,
  Twitter,
  Mail,
} from "lucide-react";

export default function AboutUsPage() {
  const teamValues = [
    {
      icon: Heart,
      title: "Passion for Education",
      description:
        "We believe learning should be accessible, engaging, and visual for everyone.",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Lightbulb,
      title: "Innovation First",
      description:
        "We constantly explore new ways to make complex algorithms simple and intuitive.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Built by learners, for learners. Your feedback shapes our platform.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Target,
      title: "Quality Content",
      description:
        "Every visualization is carefully crafted to ensure accuracy and clarity.",
      color: "from-purple-500 to-indigo-500",
    },
  ];

  const milestones = [
    {
      year: "2024",
      title: "Platform Launch",
      description: "DecodeDSA goes live with 50+ algorithm visualizations",
    },
    {
      year: "2024",
      title: "Community Growth",
      description: "Reached 10,000+ active learners across 30+ countries",
    },
    {
      year: "2025",
      title: "Feature Expansion",
      description: "Added advanced topics: Graphs, Trees, and Array Algorithms",
    },
    {
      year: "2025",
      title: "50K+ Learners",
      description: "Growing community with 300+ interactive visualizations",
    },
  ];

  const features = [
    "Interactive step-by-step algorithm visualizations",
    "Real-time code examples with explanations",
    "Time & space complexity analysis",
    "Custom input for hands-on experimentation",
    "Responsive design for all devices",
    "Completely free and open to everyone",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative container mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-md rounded-full mb-6 font-medium">
            <Heart className="w-4 h-4 mr-2" />
            About Our Journey
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Making DSA Learning
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Simple, Visual & Fun
            </span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
            DecodeDSA was born from a simple belief: complex algorithms don't
            have to be confusing. Through interactive visualizations, we're
            transforming how students and developers understand Data Structures
            & Algorithms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/sorting"
              className="inline-flex items-center px-8 py-4 bg-white text-indigo-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              <Rocket className="w-5 h-5 mr-2" /> Start Learning Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <a
              href="#mission"
              className="inline-flex items-center px-8 py-4 border-2 border-white/50 backdrop-blur-md text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
            >
              <Brain className="w-5 h-5 mr-2" /> Our Mission
            </a>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section id="mission" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full mb-4 font-medium">
                <Target className="w-4 h-4 mr-2" />
                Our Mission
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Democratizing Algorithm Education
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Our mission is to make Data Structures and Algorithms accessible
                to everyone, regardless of their background or learning style.
                We believe that visual, interactive learning breaks down
                barriers and accelerates understanding.
              </p>
              <p className="text-gray-600 text-lg">
                By combining cutting-edge web technologies with pedagogical
                best practices, we're creating a platform where learners can
                not just read about algorithms—they can see them, interact with
                them, and truly understand how they work.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
                <Zap className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-indigo-100 mb-6">
                  To become the world's most trusted and loved platform for
                  learning Data Structures and Algorithms through visual
                  storytelling and interactive experiences.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Empower 1M+ learners globally</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Cover 500+ algorithm visualizations</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Build the largest DSA learning community</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at DecodeDSA
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamValues.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${value.color} text-white rounded-2xl mb-4`}
                >
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey/Timeline Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From a simple idea to a thriving learning platform
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>

              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative mb-12 ${
                    index % 2 === 0 ? "md:text-right" : "md:text-left"
                  }`}
                >
                  <div
                    className={`md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-12 md:ml-auto" : "md:pl-12"
                    }`}
                  >
                    <div className="bg-gradient-to-br from-slate-50 to-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                      <div
                        className={`inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-bold mb-3`}
                      >
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  {/* Timeline dot */}
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-4 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-white shadow-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full mb-4 font-medium">
                <Award className="w-4 h-4 mr-2" />
                What We Offer
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Everything You Need to Master DSA
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                DecodeDSA provides comprehensive, interactive learning
                experiences designed to help you understand algorithms deeply
                and intuitively.
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3 mt-1">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-700 text-lg">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  120+
                </div>
                <p className="text-gray-600">Algorithms</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  50K+
                </div>
                <p className="text-gray-600">Learners</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
                  300+
                </div>
                <p className="text-gray-600">Visualizations</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  30+
                </div>
                <p className="text-gray-600">Countries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative container mx-auto px-6 text-center">
          <Code2 className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
            Join thousands of learners who are mastering Data Structures and
            Algorithms through interactive visualizations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/sorting"
              className="inline-flex items-center px-8 py-4 bg-white text-indigo-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              <Rocket className="w-5 h-5 mr-2" /> Begin Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/array-algorithms"
              className="inline-flex items-center px-8 py-4 border-2 border-white/50 backdrop-blur-md text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
            >
              <Brain className="w-5 h-5 mr-2" /> Explore Algorithms
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">DecodeDSA</h3>
            <p className="text-sm text-gray-400">
              Interactive platform to master Data Structures & Algorithms
              through visualization.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/sorting" className="hover:text-white">
                  Sorting
                </Link>
              </li>
              <li>
                <Link to="/searching" className="hover:text-white">
                  Searching
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <button className="hover:text-white transition-colors">
                <Github className="w-6 h-6" />
              </button>
              <button className="hover:text-white transition-colors">
                <Linkedin className="w-6 h-6" />
              </button>
              <button className="hover:text-white transition-colors">
                <Twitter className="w-6 h-6" />
              </button>
              <button className="hover:text-white transition-colors">
                <Mail className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Have questions? We'd love to hear from you!
            </p>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-6">
          © {new Date().getFullYear()} DecodeDSA. All rights reserved. Made
          with <Heart className="w-4 h-4 inline text-red-500" /> for learners
          worldwide.
        </div>
      </footer>
    </div>
  );
}
