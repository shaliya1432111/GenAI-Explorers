import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmail, signUpWithEmail } from '../services/authService';

const Landing = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-login guest user when entering app
  const handleEnterApp = async () => {
    setIsLoading(true);
    try {
      // Try to sign in with guest account
      const guestEmail = 'guest@genaiexplorers.com';
      const guestPassword = 'guest123';
      
      let result = await signInWithEmail(guestEmail, guestPassword);
      
      // If guest account doesn't exist, create it
      if (!result.success) {
        result = await signUpWithEmail(
          guestEmail,
          guestPassword,
          'Guest User',
          ''
        );
      }
      
      if (result.success) {
        // Navigate to home after successful login
        navigate('/home');
      } else {
        console.error('Failed to enter app:', result.error);
        alert('Unable to enter app. Please try again.');
      }
    } catch (error) {
      console.error('Error entering app:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'explore', 'features', 'about'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-ai-darker text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-ai-blue/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ai-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-ai-pink/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating AI Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-ai-blue/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ai-darker/80 backdrop-blur-md border-b border-ai-blue/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => scrollToSection('home')}>
              <div className="relative">
                <div className="absolute inset-0 bg-ai-blue/30 blur-xl group-hover:bg-ai-cyan/40 transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-ai-blue to-ai-purple p-2 rounded-xl">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-9h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
                  </svg>
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-ai-blue via-ai-purple to-ai-pink bg-clip-text text-transparent">
                GenAIExplorers
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {['home', 'explore', 'features', 'about'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-sm font-medium transition-all duration-300 ${
                    activeSection === section
                      ? 'text-ai-cyan'
                      : 'text-ai-gray hover:text-white'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/auth')}
                className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-ai-blue to-ai-cyan rounded-full text-white hover:shadow-ai-glow transform hover:scale-105 transition-all duration-300"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fadeIn">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-ai-blue via-ai-purple to-ai-pink bg-clip-text text-transparent">
                Explore the Future
              </span>
              <br />
              <span className="text-white">of Artificial Intelligence</span>
            </h1>
            <p className="text-xl md:text-2xl text-ai-gray mb-12 max-w-3xl mx-auto">
              Discover cutting-edge AI tutorials, courses, and insights from the world's leading experts in Generative AI, Machine Learning, and AI Agents.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => navigate('/auth')}
                className="px-8 py-4 bg-gradient-to-r from-ai-blue to-ai-cyan rounded-full text-white font-semibold text-lg hover:shadow-ai-glow transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Get Started</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button
                onClick={() => scrollToSection('explore')}
                className="px-8 py-4 border-2 border-ai-blue/50 rounded-full text-white font-semibold text-lg hover:bg-ai-blue/10 hover:border-ai-cyan transition-all duration-300"
              >
                Explore Content
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            {[
              { icon: '🎓', value: '10K+', label: 'Students' },
              { icon: '📚', value: '500+', label: 'Courses' },
              { icon: '⭐', value: '4.9/5', label: 'Rating' },
              { icon: '🌍', value: '50+', label: 'Countries' },
            ].map((stat, index) => (
              <div key={index} className="bg-ai-card/50 backdrop-blur-sm border border-ai-blue/20 rounded-2xl p-6 hover:border-ai-cyan hover:shadow-ai-glow transition-all duration-300">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-ai-gray">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section id="explore" className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-ai-blue to-ai-purple bg-clip-text text-transparent">
                Explore AI Categories
              </span>
            </h2>
            <p className="text-xl text-ai-gray">
              Dive into specialized AI domains and master cutting-edge technologies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🤖', title: 'Generative AI', desc: 'Master GPT, DALL-E, and other generative models', color: 'from-ai-blue to-ai-cyan' },
              { icon: '🧠', title: 'Machine Learning', desc: 'Deep dive into ML algorithms and neural networks', color: 'from-ai-purple to-ai-pink' },
              { icon: '🎯', title: 'AI Agents', desc: 'Build intelligent autonomous agents and systems', color: 'from-ai-cyan to-ai-blue' },
              { icon: '💬', title: 'NLP & LLMs', desc: 'Natural Language Processing and Large Language Models', color: 'from-ai-pink to-ai-purple' },
              { icon: '👁️', title: 'Computer Vision', desc: 'Image recognition, object detection, and more', color: 'from-ai-blue to-ai-purple' },
              { icon: '🔮', title: 'AI Ethics', desc: 'Responsible AI development and deployment', color: 'from-ai-cyan to-ai-pink' },
            ].map((category, index) => (
              <div
                key={index}
                onClick={() => navigate('/auth')}
                className="group bg-ai-card/50 backdrop-blur-sm border border-ai-blue/20 rounded-2xl p-8 hover:border-ai-cyan hover:shadow-ai-glow transform hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{category.title}</h3>
                <p className="text-ai-gray mb-4">{category.desc}</p>
                <button className={`px-4 py-2 bg-gradient-to-r ${category.color} rounded-full text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                  Explore →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-6 bg-ai-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-ai-purple to-ai-pink bg-clip-text text-transparent">
                Why Choose GenAIExplorers?
              </span>
            </h2>
            <p className="text-xl text-ai-gray">
              The ultimate platform for AI learning and exploration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { icon: '⚡', title: 'Lightning Fast', desc: 'Optimized streaming and instant access to content' },
              { icon: '🎨', title: 'Beautiful UI', desc: 'Modern, intuitive interface designed for learning' },
              { icon: '📱', title: 'Fully Responsive', desc: 'Perfect experience on any device, anywhere' },
              { icon: '🔒', title: 'Secure & Private', desc: 'Your data is encrypted and protected' },
              { icon: '🌟', title: 'Expert Content', desc: 'Curated by industry-leading AI professionals' },
              { icon: '🚀', title: 'Always Updated', desc: 'New content added weekly, stay ahead of the curve' },
            ].map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-ai-blue to-ai-purple rounded-2xl flex items-center justify-center text-3xl group-hover:shadow-ai-glow transition-all duration-300">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-ai-gray">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="about" className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-ai-cyan to-ai-blue bg-clip-text text-transparent">
                What Our Learners Say
              </span>
            </h2>
            <p className="text-xl text-ai-gray">
              Join thousands of satisfied AI enthusiasts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Chen', role: 'ML Engineer', text: 'GenAIExplorers transformed my understanding of AI. The content is top-notch!', avatar: 'SC' },
              { name: 'Michael Rodriguez', role: 'Data Scientist', text: 'Best AI learning platform I\'ve used. Clear explanations and practical examples.', avatar: 'MR' },
              { name: 'Emily Watson', role: 'AI Researcher', text: 'Incredible resource for staying updated with the latest in AI technology.', avatar: 'EW' },
            ].map((testimonial, index) => (
              <div key={index} className="bg-ai-card/50 backdrop-blur-sm border border-ai-blue/20 rounded-2xl p-8 hover:border-ai-cyan hover:shadow-ai-glow transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-ai-blue to-ai-purple rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-sm text-ai-gray">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-ai-gray italic">"{testimonial.text}"</p>
                <div className="flex mt-4 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-ai-blue/20 to-ai-purple/20 backdrop-blur-sm border border-ai-blue/30 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-ai-blue via-ai-purple to-ai-pink bg-clip-text text-transparent">
                Ready to Start Your AI Journey?
              </span>
            </h2>
            <p className="text-xl text-ai-gray mb-8">
              Join thousands of learners exploring the future of AI technology
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="px-10 py-4 bg-gradient-to-r from-ai-blue to-ai-cyan rounded-full text-white font-semibold text-lg hover:shadow-ai-glow transform hover:scale-105 transition-all duration-300"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-ai-blue/20 bg-ai-card/30 backdrop-blur-sm py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-br from-ai-blue to-ai-purple p-2 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-9h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
                  </svg>
                </div>
                <span className="text-lg font-bold text-white">GenAIExplorers</span>
              </div>
              <p className="text-sm text-ai-gray">
                Your ultimate destination for AI learning and exploration.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-ai-gray">
                <li className="hover:text-ai-blue cursor-pointer transition-colors">Courses</li>
                <li className="hover:text-ai-blue cursor-pointer transition-colors">Tutorials</li>
                <li className="hover:text-ai-blue cursor-pointer transition-colors">Community</li>
                <li className="hover:text-ai-blue cursor-pointer transition-colors">Blog</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-ai-gray">
                <li className="hover:text-ai-blue cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-ai-blue cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-ai-blue cursor-pointer transition-colors">Contact</li>
                <li className="hover:text-ai-blue cursor-pointer transition-colors">Privacy</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex space-x-3">
                {['M', 'in', 'f', 'X'].map((social, i) => (
                  <button key={i} className="w-10 h-10 bg-ai-card border border-ai-blue/30 rounded-full flex items-center justify-center text-ai-blue hover:bg-ai-blue hover:text-white transition-all duration-300">
                    {social}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-ai-blue/20 text-center text-sm text-ai-gray">
            <p>© 2024 GenAIExplorers. Made with 💙 by Bob. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

// Made with Bob