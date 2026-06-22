import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Menu, X, Moon, Sun, Monitor, Smartphone, ShoppingBag, 
  MapPin, CheckCircle, Clock, Send, Shield, Wrench, ChevronRight,
  User, LayoutDashboard, LogOut, Bell
} from 'lucide-react';
import {logo, items} from './assets/assets.js';


class ApiClient {
  constructor() {
    this.baseUrl = 'https://darkness-cosmos-encourage.ngrok-free.dev/api';
    this.delay = (ms) => new Promise(res => setTimeout(res, ms)); 
  }

  getToken() {
    return localStorage.getItem('brian_hub_token');
  }

  async fetchWithFallback(endpoint, method = 'GET', body = null) {
    try {
      const headers = { 'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
       };
      const token = this.getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
      });
      
      const data = await res.json();
      if (!res.ok) {
          throw new Error(data.error || data.error || 'Something went wrong');
      }
      return data;
    } catch (err) {
      console.warn('Backend not reachable', endpoint, err.message);
      throw err;
    }
  }

  login(email, password) { return this.fetchWithFallback('/auth/signin', 'POST', { email, password }); }
  register(name, email, password) { return this.fetchWithFallback('/auth/signup', 'POST', { name, email, password }); }
  bookAppointment(data) { return this.fetchWithFallback('/bookings', 'POST', data); }
  processMPesa(phone, amount) { return this.fetchWithFallback('/mpesa', 'POST', { phone, amount }); }
  getAdminStats() { return this.fetchWithFallback('/admin/stats', 'GET'); }
}

const api = new ApiClient();

const ThemeContext = createContext();
const AuthContext = createContext();
const ToastContext = createContext();

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
  const baseStyle = "px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/30 cursor-pointer",
    secondary: "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white cursor-pointer",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer",
    danger: "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Input = ({ label, type = 'text', value, onChange, placeholder, required = false, as = 'input', rows = 3 }) => {
  const baseClass = "w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all";
  return (
    <div className="mb-4 text-left">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {as === 'textarea' ? (
        <textarea value={value} onChange={onChange} placeholder={placeholder} required={required} rows={rows} className={baseClass} />
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} className={baseClass} />
      )}
    </div>
  );
};

const Card = ({ children, className = '', hover = true }) => (
  <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 ${hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : ''} ${className}`}>
    {children}
  </div>
);

const Home = ({ navigate }) => (
  <div className="animate-fade-in">
    <section className="relative pt-20 pb-32 flex items-center justify-center min-h-[85vh] overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium mb-6">
          <CheckCircle size={16} /> Available for Work in Thika & Nakuru
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 leading-tight">
          Engineering the Future, <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Repairing the Present.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
          Hi, I'm Brian Mutugi. Full-Stack Developer, Electronics Technician, and Maasai Beadwork Artisan. 
          From crafting scalable web applications to bringing dead electronics back to life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate('booking')} className="text-lg px-8 py-4">Book an Appointment</Button>
          <Button onClick={() => navigate('store')} variant="outline" className="text-lg px-8 py-4">Shop Beadwork</Button>
        </div>
      </div>
    </section>

    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">My Expertise</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
              <Monitor size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Software Development</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Modern, responsive websites and full-stack web applications tailored to your business needs using React, Node.js, and modern tools.
            </p>
          </Card>
          <Card>
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
              <Wrench size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Electronics Repair</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Expert repair for phones, laptops, TVs, woofers, and PlayStations. If I can find the problem, I can fix it.
            </p>
          </Card>
          <Card>
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400 mb-6">
              <ShoppingBag size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Maasai Beadwork</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Authentic Kenyan Maasai bead bracelets and shangas. Handcrafted with precision, perfect for gifts or personal style.
            </p>
          </Card>
        </div>
      </div>
    </section>
  </div>
);

const Booking = ({ navigate }) => {
  const { showToast } = useContext(ToastContext);
  const { user } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: 'repair',
    device: '',
    description: '',
    phone: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to book an appointment.', 'error');
      navigate('auth');
      return;
    }
    setLoading(true);
    try {
      await api.bookAppointment(formData);
      showToast('Appointment Request Sent!', 'success');
      setTimeout(() => {
        showToast('Automated WhatsApp confirmation triggering...', 'success');
      }, 1500);
      setStep(3); // Move to Payment Step
    } catch (error) {
      showToast(error.message || 'Failed to book.', 'error');
    }
    setLoading(false);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      await api.processMPesa(formData.phone, 500);
      showToast('Check your phone for the M-Pesa STK push.', 'success');
      navigate('home');
    } catch (err) {
      showToast('M-Pesa push failed.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 min-h-screen animate-fade-in">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Book a Service</h2>
      
      <div className="flex gap-4 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-2 flex-1 rounded-full ${step >= i ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
        ))}
      </div>

      <Card hover={false} className="p-8">
        {step === 1 && (
          <div>
            <h3 className="text-xl font-bold mb-6 dark:text-white">What do you need help with?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {['repair', 'software'].map(type => (
                <div 
                  key={type}
                  onClick={() => setFormData({...formData, serviceType: type})}
                  className={`p-4 border-2 rounded-xl cursor-pointer flex flex-col items-center gap-3 transition-all ${formData.serviceType === type ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'border-gray-200 dark:border-gray-700 dark:text-gray-300'}`}
                >
                  {type === 'repair' ? <Wrench size={32} /> : <Monitor size={32} />}
                  <span className="font-semibold capitalize">{type === 'repair' ? 'Electronics Repair' : 'Software Development'}</span>
                </div>
              ))}
            </div>
            <Button onClick={() => setStep(2)} className="w-full">Continue <ChevronRight size={18} className="ml-2" /></Button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold mb-6 dark:text-white">Details</h3>
            {formData.serviceType === 'repair' ? (
              <Input label="Device Type (e.g., PlayStation 5, HP Laptop)" value={formData.device} onChange={e => setFormData({...formData, device: e.target.value})} required />
            ) : (
              <Input label="Project Type (e.g., E-commerce Website)" value={formData.device} onChange={e => setFormData({...formData, device: e.target.value})} required />
            )}
            
            <Input label="Description of the issue / requirements" as="textarea" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
            <Input label="WhatsApp Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="07XX..." required />
            
            <div className="flex gap-4 mt-6">
              <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">Back</Button>
              <Button type="submit" className="flex-1" disabled={loading}>{loading ? 'Submitting...' : 'Submit Request'}</Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
            <h3 className="text-2xl font-bold mb-2 dark:text-white">Booking Received!</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              No consultation fee required, your appointment will be automatically locked and I serve in First Come First Serve (FCFS) basis.
            </p>
            {/* <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 mb-8 inline-block text-left">
               <p className="text-green-800 dark:text-green-300 font-mono font-bold text-lg mb-2">M-Pesa STK Push</p>
               <Input label="Confirm Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div> */}
            <div className="flex gap-4 justify-center">
               <Button variant="outline" onClick={() => navigate('home')}>Done</Button>
               {/* <Button onClick={handlePayment} disabled={loading} className="bg-green-600 hover:bg-green-700">
                 {loading ? 'Processing...' : 'Pay KSH 500'}
               </Button> */}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

const Store = () => {
  // const items = [
  //   { id: 1, name: 'African Bracelet', price: 'KSH 450', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTR4LzzWSooXqGLGn55jASIHDkOfXu-Tl-8w&s' },
  //   { id: 2, name: 'Custom Beaded Bracelet', price: 'KSH 250', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzeoAeZB753VlJLCTrscHwhOB55rTZWaGPNQ&s' },
  //   { id: 3, name: 'Kenyan Flag Theme Bracelet', price: 'KSH 300', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU7dIaetE_NQsSjzkdiyowZ1cOR7vq5iKayA&s' },
  // ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen animate-fade-in">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Maasai Beadwork Shop</h2>
        <p className="text-gray-600 dark:text-gray-400">Authentic, handcrafted jewelry made with precision.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {items.map(item => (
          <Card key={item.id} className="overflow-hidden p-0 flex flex-col">
            <div className={`h-48 w-full bg-${item.img}-500 dark:bg-${item.img}-800 opacity-80 flex items-center justify-center`}>
              <img src={item.img} alt="" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold dark:text-white mb-2">{item.name}</h3>
              <p className="text-lg font-mono text-blue-600 dark:text-blue-400 font-bold mb-4">{item.price}</p>
              <Button className="mt-auto w-full">Order via WhatsApp</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Auth = ({ navigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, setUser } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isLogin) {
        // Handle Registration
        const res = await api.register(name, email, password);
        
        showToast(res.message, 'success');
        setIsLogin(true); // Switch to login after successful register
        setPassword('');
      } else {
        // Handle Login
        const data = await api.login(email, password);
        login(data.token, data.user);
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        navigate('home');
      }
    } catch (error) {
      showToast(error.message || 'Authentication failed', 'error');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 animate-fade-in bg-gray-50 dark:bg-gray-900">
      <Card hover={false} className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <Shield size={32} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            {isLogin ? "" : "Register to book a service"}
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} required />}
          <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </Button>
        </form>
        
        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setIsLogin(!isLogin); setPassword(''); }} className="text-blue-600 font-bold hover:underline">
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </Card>
    </div>
  );
};

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const [stats, setStats] = useState({ totalBookings: 0, pendingRepairs: 0, recent: [] });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user?.role === 'admin') {
      api.getAdminStats()
        .then(data => { setStats(data); setLoading(false); })
        .catch(err => { showToast('Failed to load stats', 'error'); setLoading(false); });
    }
  }, [user]);

  if (user?.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-500 font-bold">Access Denied. Admins Only.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen animate-fade-in">
      <div className="flex items-center justify-between mb-10">
        <div>
           <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h2>
           <p className="text-gray-500 mt-2">Welcome back, Boss.</p>
        </div>
        <Button variant="outline"><Bell size={18} className="mr-2" /> Notifications</Button>
      </div>

      {loading ? (
        <div className="text-center py-20 dark:text-white">Loading data...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-none">
              <h4 className="text-gray-500 dark:text-gray-400 mb-2">Total Bookings</h4>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{stats.totalBookings}</p>
            </Card>
            <Card className="bg-orange-50 dark:bg-orange-900/20 border-none">
              <h4 className="text-gray-500 dark:text-gray-400 mb-2">Pending Jobs</h4>
              <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">{stats.pendingRepairs}</p>
            </Card>
            <Card className="bg-green-50 dark:bg-green-900/20 border-none">
              <h4 className="text-gray-500 dark:text-gray-400 mb-2">Total Revenue</h4>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">KSH --</p>
            </Card>
          </div>

          <Card hover={false}>
            <h3 className="text-xl font-bold mb-6 dark:text-white">Recent Service Requests</h3>
            <div className="space-y-4">
              {stats.recent.length === 0 ? (
                <p className="text-gray-500">No recent bookings found.</p>
              ) : (
                stats.recent.map(booking => (
                  <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600">
                          {booking.service_type === 'repair' ? <Wrench size={20}/> : <Monitor size={20}/>}
                        </div>
                        <div>
                          <p className="font-bold text-lg dark:text-white">{booking.device}</p>
                          <p className="text-sm text-gray-500">From: {booking.user_name} • Status: <span className="text-orange-500 uppercase text-xs font-bold">{booking.status}</span></p>
                        </div>
                    </div>
                    <Button variant="outline" className="px-4 py-2 text-sm">Review & Reply via WhatsApp</Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

const Navbar = ({ navigate, currentRoute }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: 'home' },
    { name: 'Services & Booking', path: 'booking' },
    { name: 'Beadwork Store', path: 'store' },
  ];

  const handleLogout = () => {
    logout();
    navigate('home');
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('home')}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
            <img className="rounded" src={logo} alt="Logo" />
          </div>
          <span className="font-bold text-xl dark:text-white tracking-tight">Brian Mutugi Tech</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <button 
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`font-medium cursor-pointer transition-colors ${currentRoute === link.path ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
            >
              {link.name}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500 mr-2 border-r border-gray-300 dark:border-gray-700 pr-4">
                Hi, <span className="font-bold text-gray-900 dark:text-white">{user.name.split(' ')[0]}</span>
              </div>
              {user.role === 'admin' && (
                <Button variant="outline" onClick={() => navigate('admin')} className="py-2 px-4 text-sm">Admin</Button>
              )}
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors">
                <LogOut size={18} /> Logout
              </button>
            </div>
          ) : (
             <Button onClick={() => navigate('auth')} className="py-2 px-6">Sign In</Button>
          )}
        </div>

        <button className="md:hidden p-2 text-gray-900 dark:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4 px-6 flex flex-col gap-4 shadow-xl">
           {navLinks.map(link => (
            <button key={link.path} onClick={() => { navigate(link.path); setIsMenuOpen(false); }} className="text-left font-medium text-lg dark:text-white py-2">
              {link.name}
            </button>
          ))}
          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
          {user ? (
             <>
               {user.role === 'admin' && <button onClick={() => { navigate('admin'); setIsMenuOpen(false); }} className="text-left font-medium text-blue-600 py-2">Admin Dashboard</button>}
               <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-left font-medium text-red-500 py-2">Logout</button>
             </>
          ) : (
            <Button onClick={() => { navigate('auth'); setIsMenuOpen(false); }} className="w-full">Sign In</Button>
          )}
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-gray-50 dark:bg-gray-950 py-12 border-t border-gray-200 dark:border-gray-800">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="font-bold text-xl mb-4 dark:text-white flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm">B</div> Mutugi Hub
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Professional Software Development, Electronics Repair, and Authentic Maasai Beadwork.
        </p>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-4 dark:text-white">Locations</h4>
        <ul className="space-y-3 text-gray-600 dark:text-gray-400 text-sm">
          <li className="flex items-start gap-2"><MapPin size={16} className="text-blue-500 flex-shrink-0 mt-1" /> Currently: Thika</li>
          <li className="flex items-start gap-2"><MapPin size={16} className="text-purple-500 flex-shrink-0 mt-1" /> Mainly: Nakuru Njoro (Egerton Main Gate)</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-4 dark:text-white">Contact Info</h4>
        <ul className="space-y-3 text-gray-600 dark:text-gray-400 text-sm">
          <li>Contact: 0115793480 | Email: 87brianmutugi@gmail.com.</li>
          <li>Login to Book an Appointment.</li>
        </ul>
      </div>
    </div>
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm">
      &copy; {new Date().getFullYear()} Brian Mutugi. Built with ❤️ in Kenya.
    </div>
  </footer>
);

const Toast = ({ message, type, onClose }) => (
  <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl z-50 animate-slide-up text-white ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
    {type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
    <p className="font-medium">{message}</p>
    <button onClick={onClose} className="ml-4 hover:opacity-75"><X size={16} /></button>
  </div>
);

export default function App() {
  const [theme, setTheme] = useState('light');
  const [currentRoute, setCurrentRoute] = useState('home');
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  // Load Auth State from LocalStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('brian_hub_token');
    const storedUser = localStorage.getItem('brian_hub_user');
    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Theme setup
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
  }, []);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Auth Handlers
  const login = (token, userData) => {
    localStorage.setItem('brian_hub_token', token);
    localStorage.setItem('brian_hub_user', JSON.stringify(userData));
    setUser(userData);
  };
  
  const logout = () => {
    localStorage.removeItem('brian_hub_token');
    localStorage.removeItem('brian_hub_user');
    setUser(null);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const navigate = (route) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentRoute(route);
  };

  const renderPage = () => {
    switch (currentRoute) {
      case 'home': return <Home navigate={navigate} />;
      case 'booking': return <Booking navigate={navigate} />;
      case 'store': return <Store />;
      case 'auth': return <Auth navigate={navigate} />;
      case 'admin': return <AdminDashboard />;
      default: return <Home navigate={navigate} />;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthContext.Provider value={{ user, login, logout, setUser }}>
        <ToastContext.Provider value={{ showToast }}>
          <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
            <Navbar navigate={navigate} currentRoute={currentRoute} />
            <main className="pt-20">
              {renderPage()}
            </main>
            <Footer />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
          </div>
          
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
            .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          `}} />
        </ToastContext.Provider>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}