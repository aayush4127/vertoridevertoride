import React from 'react';
import { PageTab } from '../types';
import { VertoRideLogo } from './VertoRideLogo';
import { ShieldCheck, Phone, Heart, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: PageTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <VertoRideLogo size={36} inverted={true} showSubtitle={false} />
            <p className="text-slate-400 text-xs leading-relaxed">
              Find classmates going your way across campus. Share the ride and split nominal costs across hostels, academic blocks, and campus gates.
            </p>
            <p className="text-[11px] text-slate-500">
              Built exclusively for Vertos of Lovely Professional University, Punjab.
            </p>
          </div>

          {/* Quick Nav */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Campus Navigation</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">
                  Home / Book Ride
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('book')} className="hover:text-white transition-colors cursor-pointer">
                  Available Rides
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('live')} className="hover:text-white transition-colors cursor-pointer">
                  Campus Auto Paths
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('find-students')} className="hover:text-white transition-colors cursor-pointer">
                  Find Students Going Your Way
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('my-rides')} className="hover:text-white transition-colors cursor-pointer">
                  My Booked Rides
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profile')} className="hover:text-white transition-colors cursor-pointer">
                  Student Profile & Rating
                </button>
              </li>
            </ul>
          </div>

          {/* Top Campus Hubs */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Popular Route Hubs</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>LPU Main Gate (GT Road NH-44)</li>
              <li>Law Gate & Student PG Zone</li>
              <li>UniMall & Central Food Court</li>
              <li>Phagwara Railway Station (8.5 km)</li>
              <li>Jalandhar Cantt Railway Station (14 km)</li>
              <li>Haveli Punjabi Restaurant (4.8 km)</li>
            </ul>
          </div>

          {/* Campus Safety & Emergency Support */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Campus Safety & Helplines
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every ride requires 4-digit boarding OTP verification. For any emergencies on GT Road or around gates:
            </p>
            <div className="space-y-1 text-slate-300 font-mono text-[11px]">
              <div>• LPU Security Booth: <strong>01824-444444</strong></div>
              <div>• Campus Hospital: <strong>01824-500000</strong></div>
              <div>• Women's Helpline: <strong>1091 / 112</strong></div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} VERTORIDE • Lovely Professional University Student Community Initiative.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Powered by direct student-to-student carpooling. Zero AI / ML.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
