import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowUpDown,
  Search,
  Database,
  Play,
  BookOpen,
  Zap,
  ChevronRight,
  Code2,
  Brain,
  Target,
  Users,
  Award,
  Github,
  Linkedin,
  Twitter,
  ArrowUp,
} from "lucide-react";

export default function Page() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

 const categories = [
    {
      title: "Sorting Algorithms",
      description: "Visualize how different sorting algorithms work step by step",
      icon: ArrowUpDown,
      color: "from-blue-500 to-cyan-500",
      algorithms: [
        {
          name: "Interactive Sorting Visualizer",
          path: "/sorting",
          description: "Bubble, Selection, Insertion, Merge, Quick & Heap Sort",
        },
      ],
    },
    {
      title: "Searching Algorithms",
      description: "Explore various search techniques and their implementations",
      icon: Search,
      color: "from-green-500 to-emerald-500",
      algorithms: [
        {
          name: "Interactive Searching Visualizer",
          path: "/searching",
          description: "Linear and Binary Search with step-by-step visualization",
        },
      ],
    },
    {
      title: "Array Algorithms",
      description: "Visualize two pointer, three pointer, and sliding window techniques",
      icon: Target,
      color: "from-orange-500 to-yellow-500",
      algorithms: [
        {
          name: "Array Algorithms Visualizer",
          path: "/array-algorithms",
          description: "Two Pointer, Three Pointer, Sliding Window techniques",
        },
      ],
    },
    {
      title: "Data Structures",
      description: "Learn fundamental data structures with interactive examples",
      icon: Database,
      color: "from-purple-500 to-pink-500",
      algorithms: [
        { name: "Linked List", path: "/data-structures/linked-list", description: "Dynamic linear data structure" },
        { name: "Binary Tree", path: "/data-structures/binary-tree", description: "Hierarchical tree structure" },
        { name: "Stack", path: "/data-structures/stack", description: "LIFO data structure" },
        { name: "Queue", path: "/data-structures/queue", description: "FIFO data structure" },
        { name: "Graph", path: "/data-structures/graph", description: "Graph data structure and algorithms" },
      ],
    },
    {
      title: "Operations",
      description: "Convert between infix, prefix, and postfix expressions",
      icon: BookOpen,
      color: "from-teal-500 to-lime-500",
      algorithms: [
        {
          name: "Expression Converter",
          path: "/operations/expression-converter",
          description: "Convert infix, prefix, and postfix expressions",
        },
      ],
    },
  ];

  const features = [
    {
      icon: Play,
      title: "Interactive Visualizations",
      description: "Step-by-step animations that make complex logic simple.",
    },
    {
      icon: Code2,
      title: "Code Examples",
      description: "Every algorithm explained with well-commented code.",
    },
    {
      icon: Brain,
      title: "Learn by Doing",
      description: "Experiment, tweak, and see how code reacts in real time.",
    },
    {
      icon: Target,
      title: "Complexity Analysis",
      description: "Time and space complexity made intuitive to understand.",
    },
  ];

  const stats = [
    { icon: Users, label: "Learners", value: "50K+" },
    { icon: Code2, label: "Algorithms", value: "120+" },
    { icon: Award, label: "Countries", value: "30+" },
    { icon: Brain, label: "Visualizations", value: "300+" },
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container relative px-6 py-24 mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 mb-6 font-medium text-blue-800 bg-blue-100 rounded-full">
            <Zap className="w-4 h-4 mr-2" />
            Empower Your DSA Journey
          </div>
          <h1 className="mb-6 text-5xl font-extrabold leading-tight text-gray-900 md:text-6xl">
            Master{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              Data Structures
            </span>{" "}
            &{" "}
            <span className="text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
              Algorithms
            </span>{" "}
            Visually
          </h1>
          <p className="max-w-3xl mx-auto mb-10 text-lg text-gray-600 md:text-xl">
            Experience algorithm learning like never before — intuitive,
            interactive, and deeply visual.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/about"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              <Play className="w-5 h-5 mr-2" /> Start Visualizing
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center px-8 py-4 font-semibold text-gray-700 transition-all border-2 border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50"
            >
              <BookOpen className="w-5 h-5 mr-2" /> Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
 

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container px-6 mx-auto text-center">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Why Choose Our Platform?
          </h2>
          <p className="max-w-2xl mx-auto mb-12 text-gray-600">
            A next-gen platform that transforms abstract concepts into
            interactive, visual stories.
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="p-6 transition-all shadow-md rounded-2xl hover:shadow-xl bg-gradient-to-br from-slate-50 to-white"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                  <f.icon className="w-8 h-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {f.title}
                </h3>
                <p className="text-gray-600">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
           <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container grid grid-cols-2 gap-8 px-6 mx-auto text-center md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-white shadow-md rounded-2xl">
                <s.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{s.value}</h3>
              <p className="text-gray-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>



         <section className="relative py-20 overflow-hidden text-white bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container relative z-10 px-6 mx-auto">
          <h2 className="mb-8 text-4xl font-extrabold text-center md:text-5xl">
            How It Works
          </h2>
          <p className="max-w-3xl mx-auto mb-16 text-center text-indigo-100">
            Learn data structures and algorithms visually — step-by-step,
            interactively, and with real-time feedback. Here’s how you can master DSA with us 👇
          </p>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {/* Step 1 */}
            <div className="p-8 text-center transition-all shadow-lg bg-white/10 backdrop-blur-md rounded-2xl hover:shadow-2xl hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 text-4xl rounded-full bg-white/20">
                  🎯
                </div>
              </div>
              <h3 className="mb-3 text-2xl font-bold">1. Choose a Topic</h3>
              <p className="text-indigo-100">
                Select any algorithm or data structure — from sorting and searching
                to graphs and recursion — all in one place.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 text-center transition-all shadow-lg bg-white/10 backdrop-blur-md rounded-2xl hover:shadow-2xl hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 text-4xl rounded-full bg-white/20">
                  🧠
                </div>
              </div>
              <h3 className="mb-3 text-2xl font-bold">2. Visualize & Interact</h3>
              <p className="text-indigo-100">
                Watch step-by-step visual animations, tweak input values, and
                explore how algorithms really work behind the scenes.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 text-center transition-all shadow-lg bg-white/10 backdrop-blur-md rounded-2xl hover:shadow-2xl hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 text-4xl rounded-full bg-white/20">
                  🚀
                </div>
              </div>
              <h3 className="mb-3 text-2xl font-bold">3. Practice & Master</h3>
              <p className="text-indigo-100">
                Solve challenges, analyze time complexity, and track your progress
                as you grow from beginner to pro in data structures and algorithms.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/about"
              className="inline-flex items-center px-10 py-4 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Begin Your Journey
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="container px-6 mx-auto text-center">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Explore Categories
          </h2>
          <p className="max-w-2xl mx-auto mb-12 text-gray-600">
            Dive deep into topics — from sorting and searching to advanced data
            structures.
          </p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat.title}
                className="overflow-hidden transition-transform transform border border-gray-100 shadow-lg rounded-2xl hover:shadow-2xl hover:-translate-y-2"
              >
                <div
                  className={`h-32 bg-gradient-to-r ${cat.color} flex items-center justify-center`}
                >
                  <cat.icon className="w-12 h-12 text-white" />
                </div>
                <div className="p-6 text-left">
                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    {cat.title}
                  </h3>
                  <p className="mb-6 text-sm text-gray-600">
                    {cat.description}
                  </p>
                  <div className="space-y-3">
                    {cat.algorithms.map((algo) => (
                      <Link
                        key={algo.name}
                        to={algo.path}
                        className="block p-3 transition-all border border-transparent bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {algo.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {algo.description}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
       {/* How It Works Section */}
   


      {/* FAQ Section */}
    {/* FAQ Section */}
<section className="relative py-24 overflow-hidden text-white bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700">
  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
  <div className="container relative z-10 px-6 mx-auto">
    <h2 className="mb-6 text-4xl font-extrabold text-center md:text-5xl">
      Frequently Asked Questions
    </h2>
    <p className="max-w-2xl mx-auto mb-16 text-center text-indigo-100">
      Everything you need to know about our platform, learning flow, and features.
    </p>

    <div className="max-w-3xl mx-auto space-y-6">
      {[
        {
          q: "What is DecodeDsa?",
          a: "DecodeDsa is an interactive platform that helps you learn algorithms and data structures visually. You can explore step-by-step animations, tweak inputs, and deeply understand each concept."
        },
        {
          q: "Is DecodeDsa free to use?",
          a: "Yes! AlgoVision is completely free for learners. We believe education should be accessible, visual, and engaging for everyone."
        },
        {
          q: "Do I need prior coding knowledge?",
          a: "Not necessarily. We’ve designed visual guides that start from the basics — making it easy for beginners to understand algorithms without heavy math or code."
        },
     
        {
          q: "Will new algorithms be added regularly?",
          a: "Absolutely! We’re constantly adding new visualizations, challenges, and topics to help you stay ahead in your DSA journey."
        }
      ].map((item, index) => (
        <details
          key={index}
          className="p-6 transition-all duration-300 border cursor-pointer group bg-white/10 backdrop-blur-md border-white/20 rounded-2xl hover:bg-white/20"
        >
          <summary className="flex items-center justify-between text-xl font-semibold list-none cursor-pointer">
            <span>{item.q}</span>
            <span className="text-indigo-200 transition-transform duration-300 group-open:rotate-180">
              ▼
            </span>
          </summary>
          <p className="mt-4 leading-relaxed text-indigo-100">{item.a}</p>
        </details>
      ))}
    </div>

    <div className="mt-16 text-center">
      <button
        
        className="inline-flex items-center px-8 py-4 font-semibold text-indigo-700 transition-all transform bg-white shadow-lg rounded-xl hover:bg-indigo-50 hover:shadow-xl hover:-translate-y-1"
      >
        Still have questions? Contact us →
      </button>
    </div>
  </div>
</section>

        <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

      <div className="absolute top-0 rounded-full left-1/4 w-96 h-96 bg-blue-500/10 blur-3xl"></div>
      <div className="absolute bottom-0 rounded-full right-1/4 w-96 h-96 bg-purple-500/10 blur-3xl"></div>

      <div className="container relative z-10 px-6 py-16 mx-auto">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center px-6 py-3 mb-6 border rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30">
            <Zap className="w-5 h-5 mr-2 text-blue-400" />
            <span className="text-sm font-semibold text-blue-300">Join 50,000+ learners mastering DSA</span>
          </div>
          <h3 className="mb-4 text-3xl font-bold text-white">Start Your Learning Journey Today</h3>
          <p className="max-w-2xl mx-auto mb-8 text-gray-400">
            Transform your understanding of algorithms with interactive visualizations and hands-on practice.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center px-8 py-4 font-semibold text-white transition-all transform shadow-lg rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:-translate-y-1"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-12 mb-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="ml-3 text-2xl font-bold text-white">DecodeDsa</h3>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-gray-400">
              Master Data Structures & Algorithms through interactive
              visualizations. Learn by seeing, understand by doing.
            </p>
            <div className="space-y-3">
              <div className="flex items-center px-4 py-2 transition-all border rounded-lg bg-blue-500/10 border-blue-500/20 w-fit hover:bg-blue-500/20">
                <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">50K+ Learners</span>
              </div>
              <div className="flex items-center px-4 py-2 transition-all border rounded-lg bg-green-500/10 border-green-500/20 w-fit hover:bg-green-500/20">
                <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
                <span className="text-sm font-medium text-green-400">120+ Algorithms</span>
              </div>
              <div className="flex items-center px-4 py-2 transition-all border rounded-lg bg-purple-500/10 border-purple-500/20 w-fit hover:bg-purple-500/20">
                <Award className="w-4 h-4 mr-2 text-purple-400" />
                <span className="text-sm font-medium text-purple-400">30+ Countries</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold tracking-wider text-white uppercase">Learn</h4>
            <ul className="space-y-3 text-sm">
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
                <Link
                  to="/searching"
                  className="flex items-center text-gray-400 transition-all group hover:text-blue-400"
                >
                  <ArrowRight className="w-0 h-4 mr-0 text-blue-400 transition-all duration-200 group-hover:w-4 group-hover:mr-2" />
                  Searching Algorithms
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/operations/expression-converter"
                  className="flex items-center text-gray-400 transition-all group hover:text-blue-400"
                >
                  <ArrowRight className="w-0 h-4 mr-0 text-blue-400 transition-all duration-200 group-hover:w-4 group-hover:mr-2" />
                  Operations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold tracking-wider text-white uppercase">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/about"
                  className="flex items-center text-gray-400 transition-all group hover:text-blue-400"
                >
                  <ArrowRight className="w-0 h-4 mr-0 text-blue-400 transition-all duration-200 group-hover:w-4 group-hover:mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="flex items-center text-gray-400 transition-all group hover:text-blue-400"
                >
                  <ArrowRight className="w-0 h-4 mr-0 text-blue-400 transition-all duration-200 group-hover:w-4 group-hover:mr-2" />
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="flex items-center text-gray-400 transition-all group hover:text-blue-400"
                >
                  <ArrowRight className="w-0 h-4 mr-0 text-blue-400 transition-all duration-200 group-hover:w-4 group-hover:mr-2" />
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="flex items-center text-gray-400 transition-all group hover:text-blue-400"
                >
                  <ArrowRight className="w-0 h-4 mr-0 text-blue-400 transition-all duration-200 group-hover:w-4 group-hover:mr-2" />
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold tracking-wider text-white uppercase">Connect</h4>
            <p className="mb-6 text-sm leading-relaxed text-gray-400">
              Join our community and stay updated with the latest algorithm
              visualizations.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 transition-all border border-gray-700 shadow-lg rounded-xl bg-gray-800/50 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 hover:border-transparent hover:scale-110 group hover:shadow-blue-500/50"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-gray-400 transition-colors group-hover:text-white" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 transition-all border border-gray-700 shadow-lg rounded-xl bg-gray-800/50 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 hover:border-transparent hover:scale-110 group hover:shadow-blue-500/50"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-gray-400 transition-colors group-hover:text-white" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 transition-all border border-gray-700 shadow-lg rounded-xl bg-gray-800/50 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 hover:border-transparent hover:scale-110 group hover:shadow-blue-500/50"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-gray-400 transition-colors group-hover:text-white" />
              </a>
              <a
                href="mailto:contact@decodedsa.com"
                className="flex items-center justify-center w-12 h-12 transition-all border border-gray-700 shadow-lg rounded-xl bg-gray-800/50 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 hover:border-transparent hover:scale-110 group hover:shadow-purple-500/50"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-gray-400 transition-colors group-hover:text-white" />
              </a>
            </div>
            <div className="p-4 mt-6 border rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
              <p className="mb-2 text-xs text-gray-400">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 text-sm text-white placeholder-gray-500 transition-colors border border-gray-700 rounded-lg bg-gray-800/50 focus:outline-none focus:border-blue-500"
                />
                <button className="px-4 py-2 text-sm font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-gray-800">
          <div className="flex flex-col items-center justify-between gap-6 text-sm md:flex-row">
            <div className="flex flex-col items-center gap-3 md:flex-row md:gap-6">
              <p className="text-gray-500">
                © {new Date().getFullYear()} DecodeDsa. All rights reserved.
              </p>
              <div className="flex gap-4 text-gray-500">
                <a href="#" className="transition-colors hover:text-blue-400">Privacy Policy</a>
                <span>·</span>
                <a href="#" className="transition-colors hover:text-blue-400">Terms of Service</a>
                <span>·</span>
                <a href="#" className="transition-colors hover:text-blue-400">Cookies</a>
              </div>
            </div>
            <p className="flex items-center text-gray-500">
              Made with <Heart className="w-4 h-4 mx-2 text-red-500 animate-pulse" /> for
              learners worldwide
            </p>
          </div>
        </div>
      </footer>
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-opacity duration-300 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}




/*  <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="container px-6 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Explore Categories
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Choose from our comprehensive visual algorithm categories.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {categories.map((category, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="overflow-hidden transition-all bg-white border border-gray-100 shadow-lg rounded-2xl hover:shadow-2xl"
              >
                <div className={`h-32 bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                  <category.icon className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-gray-900">{category.title}</h3>
                  <p className="mb-6 text-sm text-gray-600">{category.description}</p>
                  <div className="space-y-3">
                    {category.algorithms.map((algo) => (
                      <Link
                        key={algo.name}
                        to={algo.path}
                        className="block p-4 transition-all border bg-gray-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl hover:border-blue-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{algo.name}</h4>
                            <p className="text-sm text-gray-500">{algo.description}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
 */



      /* 
 */