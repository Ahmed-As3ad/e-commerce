import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-4">Markit</h3>
            <p className="text-gray-300 mb-4">Subscribe</p>
            <p className="text-gray-400 text-sm mb-4">Get 10% off your first order</p>
            
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent border border-white rounded px-3 py-2 pr-10 text-white placeholder-gray-400 focus:outline-none focus:border-gray-300"
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-4">Support</h3>
            <div className="space-y-2 text-gray-300">
              <p className="text-sm">King Street, Alexandria,</p>
              <p className="text-sm">DH 1515, Egypt.</p>
              <p className="text-sm mt-4">Markit@gmail.com</p>
              <p className="text-sm">+201019247379</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="text-sm hover:text-white transition-colors">My Account</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Login / Register</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Cart</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Wishlist</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Shop</a></li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-4">Quick Link</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Terms Of Use</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-4">Download App</h3>
            <p className="text-gray-400 text-xs mb-4">Save $3 with App New User Only</p>
            
            <div className="flex items-start space-x-2 mb-4">
              <div className="w-20 h-20 bg-white rounded flex items-center justify-center">
                <div className="w-16 h-16 bg-black rounded grid grid-cols-8 gap-px p-1">
                  {[...Array(64)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-full h-full ${
                        Math.random() > 0.5 ? 'bg-white' : 'bg-black'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="bg-gray-800 border border-gray-600 rounded px-3 py-1 flex items-center space-x-2">
                  <i className="fab fa-google-play text-white text-lg"></i>
                  <div className="text-xs">
                    <p className="text-gray-400 text-xs">GET IT ON</p>
                    <p className="text-white font-semibold">Google Play</p>
                  </div>
                </div>
                
                <div className="bg-gray-800 border border-gray-600 rounded px-3 py-1 flex items-center space-x-2">
                  <i className="fab fa-apple text-white text-lg"></i>
                  <div className="text-xs">
                    <p className="text-gray-400 text-xs">Download on the</p>
                    <p className="text-white font-semibold">App Store</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-facebook-f text-xl"></i>
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-linkedin-in text-xl"></i>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-sm">© Copyright Ahmed Assaad 2025. All right reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;