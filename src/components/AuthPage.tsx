import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { VertoRideLogo } from './VertoRideLogo';
import { UserAvatar } from './UserAvatar';
import { getInitials } from '../utils/avatarUtils';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  BookOpen, 
  Building2, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Info,
  Camera,
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { signIn, signUp, loginDemo, error, clearError } = useAuth();
  
  const [activeMode, setActiveMode] = useState<'signin' | 'signup'>('signin');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState<string>('');
  const [signInPassword, setSignInPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    regNumber: '',
    course: 'B.Tech Computer Science & Engineering',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    blockOrHostel: 'BH-3',
    phone: '',
    password: '',
    confirmPassword: '',
    avatar: '',
    agreeTerms: true
  });

  const [photoOption, setPhotoOption] = useState<'upload' | 'initials'>('initials');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationError('Please select an image file (JPG, PNG, WebP).');
      return;
    }

    // Limit to 4MB
    if (file.size > 4 * 1024 * 1024) {
      setValidationError('Image size must be less than 4MB.');
      return;
    }

    setValidationError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setSignUpData((prev) => ({ ...prev, avatar: result }));
        setPhotoOption('upload');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setSignUpData((prev) => ({ ...prev, avatar: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  const coursesList = [
    'B.Tech Computer Science & Engineering',
    'B.Tech Mechanical Engineering',
    'B.Tech Electronics & Communication',
    'B.Tech Civil Engineering',
    'B.Des Fashion & Product Design',
    'MBA - Mittal School of Business',
    'BBA / Commerce',
    'School of Law (BA LLB / BBA LLB)',
    'School of Agriculture & Bio-Sciences',
    'School of Pharmaceutical Sciences',
    'BCA / MCA Information Technology',
    'Day Scholar / Postgraduate Research'
  ];

  const residencesList = [
    'BH-1 (Boys Hostel 1)',
    'BH-2 (Boys Hostel 2)',
    'BH-3 (Boys Hostel 3)',
    'BH-4 (Boys Hostel 4)',
    'BH-5 (Boys Hostel 5)',
    'BH-6 (Boys Hostel 6)',
    'BH-7 (Boys Hostel 7)',
    'BH-8 (Boys Hostel 8)',
    'BH-9 (Boys Hostel 9)',
    'BH-10 to 13 Complex',
    'GH-1 (Girls Hostel 1)',
    'GH-2 (Girls Hostel 2)',
    'GH-3 (Girls Hostel 3)',
    'GH-4 (Girls Hostel 4)',
    'GH-5 (Girls Hostel 5)',
    'GH-6 (Girls Hostel 6)',
    'GH-7 to 13 Complex',
    'Law Gate PG / Market Area',
    'Maheshwari Colony / Phagwara Road',
    'Day Scholar (Jalandhar / Phagwara)'
  ];

  // Handle Sign In Submit
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!signInEmail.trim()) {
      setValidationError('Please enter your LPU email or registration number.');
      return;
    }
    if (!signInPassword) {
      setValidationError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(signInEmail.trim(), signInPassword);
    } catch (err: any) {
      // error is captured by context
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Sign Up Submit
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!signUpData.name.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!signUpData.regNumber.trim()) {
      setValidationError('Please enter your LPU Registration Number (e.g. 12104523).');
      return;
    }
    if (!signUpData.email.trim()) {
      setValidationError('Please enter your university email address.');
      return;
    }
    if (!signUpData.password) {
      setValidationError('Please choose a password.');
      return;
    }
    if (signUpData.password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }
    if (signUpData.password !== signUpData.confirmPassword) {
      setValidationError('Passwords do not match. Please verify.');
      return;
    }
    if (!signUpData.agreeTerms) {
      setValidationError('Please agree to the LPU campus transit code of conduct.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp({
        name: signUpData.name,
        email: signUpData.email,
        password: signUpData.password,
        regNumber: signUpData.regNumber,
        course: signUpData.course,
        phone: signUpData.phone || '+91 98000-00000',
        gender: signUpData.gender,
        blockOrHostel: signUpData.blockOrHostel,
        avatar: signUpData.avatar || ''
      });
    } catch (err: any) {
      // handled
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demo Login Handler
  const handleDemoLogin = async (type: 'male' | 'female') => {
    setIsSubmitting(true);
    clearError();
    setValidationError(null);
    try {
      await loginDemo(type);
    } catch (err) {
      // handled
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 text-slate-100 relative overflow-hidden">
      {/* Background glowing ambient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner & University Branding */}
      <div className="w-full max-w-xl mx-auto text-center space-y-3 z-10">
        <div className="flex items-center justify-center gap-2">
          <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 flex items-center gap-2 text-xs font-semibold text-indigo-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Lovely Professional University Student Transit</span>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <div className="scale-110 sm:scale-125 py-2">
            <VertoRideLogo inverted />
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          Official campus carpooling, auto-sharing, and e-rickshaw coordination for Vertos. Sign in to reserve seats or share rides.
        </p>
      </div>

      {/* Main Authentication Box */}
      <div className="w-full max-w-xl mx-auto my-6 z-10">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 text-slate-900 overflow-hidden">
          
          {/* Sign In vs Sign Up Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200">
            <button
              type="button"
              id="tab-btn-signin"
              onClick={() => {
                setActiveMode('signin');
                setValidationError(null);
                clearError();
              }}
              className={`py-3 text-xs sm:text-sm font-extrabold rounded-2xl transition-all cursor-pointer text-center ${
                activeMode === 'signin'
                  ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              id="tab-btn-signup"
              onClick={() => {
                setActiveMode('signup');
                setValidationError(null);
                clearError();
              }}
              className={`py-3 text-xs sm:text-sm font-extrabold rounded-2xl transition-all cursor-pointer text-center ${
                activeMode === 'signup'
                  ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Create Account (Sign Up)
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">

            {/* Instant Demo Account Quick-Action Banner */}
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 p-4 rounded-2xl border border-indigo-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Instant 1-Click Demo Login</span>
                </span>
                <span className="text-[10px] bg-indigo-200/80 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                  No typing needed
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  id="btn-demo-male"
                  disabled={isSubmitting}
                  onClick={() => handleDemoLogin('male')}
                  className="py-2.5 px-3 rounded-xl bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 text-slate-800 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span className="text-base">👦</span>
                  <span>Aarav (BH-3 • Male)</span>
                </button>
                <button
                  type="button"
                  id="btn-demo-female"
                  disabled={isSubmitting}
                  onClick={() => handleDemoLogin('female')}
                  className="py-2.5 px-3 rounded-xl bg-white hover:bg-purple-600 hover:text-white border border-purple-200 text-slate-800 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span className="text-base">👧</span>
                  <span>Priya (GH-2 • Female)</span>
                </button>
              </div>
            </div>

            {/* Error Message Box */}
            {(error || validationError) && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium leading-relaxed">
                  {validationError || error}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setValidationError(null);
                    clearError();
                  }}
                  className="text-rose-500 hover:text-rose-800 p-0.5 rounded-lg cursor-pointer"
                  title="Dismiss message"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* ========================================================= */}
            {/* SIGN IN VIEW */}
            {/* ========================================================= */}
            {activeMode === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                
                {/* Email / Reg No */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>LPU Email or Registration Number</span>
                    <span className="text-[11px] font-normal text-slate-400">e.g. 12115892 or @lpu.in</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="signin-email-input"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="aarav.12115892@lpu.in or 12115892"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowHelpModal(true)}
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="signin-password-input"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="Enter your account password (verto123 for demo)"
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <span>Remember this device on campus</span>
                  </label>
                </div>

                {/* Submit Sign In */}
                <button
                  type="submit"
                  id="submit-signin-btn"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md shadow-indigo-600/20 active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to VERTORIDE</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-500 pt-2">
                  New Verto on campus?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveMode('signup')}
                    className="font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    Create student account here
                  </button>
                </p>

              </form>
            )}

            {/* ========================================================= */}
            {/* SIGN UP VIEW */}
            {/* ========================================================= */}
            {activeMode === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Full Name (as per LPU ID)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="signup-name-input"
                      value={signUpData.name}
                      onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Reg Number and Gender Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Registration No */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Registration Number</label>
                    <input
                      type="text"
                      id="signup-reg-input"
                      value={signUpData.regNumber}
                      onChange={(e) => setSignUpData({ ...signUpData, regNumber: e.target.value })}
                      placeholder="e.g. 12104523"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Gender Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Gender (For Hostel/Ride Filter)</label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['Male', 'Female', 'Other'] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setSignUpData({ ...signUpData, gender: g })}
                          className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                            signUpData.gender === g
                              ? 'bg-indigo-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* University Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>LPU Email Address</span>
                    <span className="text-[10px] text-indigo-600 font-semibold">@lpu.in recommended</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      id="signup-email-input"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      placeholder="name.12104523@lpu.in"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Course & Residence Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Course */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Academic Program</label>
                    <select
                      value={signUpData.course}
                      onChange={(e) => setSignUpData({ ...signUpData, course: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    >
                      {coursesList.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Hostel / Residence */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Hostel or Residence</label>
                    <select
                      value={signUpData.blockOrHostel}
                      onChange={(e) => setSignUpData({ ...signUpData, blockOrHostel: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    >
                      {residencesList.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Mobile Number (For Ride OTP)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      id="signup-phone-input"
                      value={signUpData.phone}
                      onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                      placeholder="+91 98765-43210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Create Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="signup-password-input"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        placeholder="Min 6 characters"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="signup-confirmpass-input"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                        placeholder="Re-enter password"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Optional Profile Photo / Initials Option */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Profile Picture (Optional)</span>
                      <span className="text-[11px] text-slate-500">Upload a custom photo or use your name initials</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      Optional
                    </span>
                  </div>

                  {/* Photo Mode Toggle */}
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/60 rounded-xl text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoOption('initials');
                        handleRemovePhoto();
                      }}
                      className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                        photoOption === 'initials' && !signUpData.avatar
                          ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Use Name Initials
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoOption('upload');
                        fileInputRef.current?.click();
                      }}
                      className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        photoOption === 'upload' || !!signUpData.avatar
                          ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                    </button>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                    id="signup-photo-upload-input"
                  />

                  {/* Visual Preview Box */}
                  <div className="flex items-center gap-3.5 p-2.5 bg-white rounded-xl border border-slate-200">
                    <UserAvatar
                      name={signUpData.name || 'Verto Student'}
                      avatar={signUpData.avatar}
                      size="lg"
                    />

                    <div className="flex-1 min-w-0">
                      {signUpData.avatar ? (
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Custom Photo Selected
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                            >
                              Change photo
                            </button>
                            <span className="text-slate-300">•</span>
                            <button
                              type="button"
                              onClick={handleRemovePhoto}
                              className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 underline cursor-pointer"
                            >
                              Remove (Use initials)
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">
                            Initials Badge: <span className="text-indigo-600 font-mono font-black">{getInitials(signUpData.name || 'Verto Student')}</span>
                          </span>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                            Displays first letter of first & last name. You can also upload a photo later from your profile.
                          </p>
                        </div>
                      )}
                    </div>

                    {!signUpData.avatar && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 border border-indigo-200 transition-colors cursor-pointer shrink-0"
                        title="Choose photo file"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={signUpData.agreeTerms}
                      onChange={(e) => setSignUpData({ ...signUpData, agreeTerms: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <span className="leading-snug text-[11px]">
                      I agree to the <strong>LPU Campus Transit Policy</strong>, fixed ₹10 campus fare regulations, and student co-rider safety terms.
                    </span>
                  </label>
                </div>

                {/* Submit Sign Up */}
                <button
                  type="submit"
                  id="submit-signup-btn"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md shadow-indigo-600/20 active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Registration & Enter</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-500 pt-1">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveMode('signin')}
                    className="font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    Sign in to your account
                  </button>
                </p>

              </form>
            )}

          </div>

          {/* Card Footer with Safety Notice */}
          <div className="bg-slate-50 p-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[11px]">256-bit Encrypted Student Session</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Firebase Auth Architecture</span>
          </div>

        </div>
      </div>

      {/* Bottom Features Strip */}
      <div className="w-full max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs text-slate-300 z-10 pt-2">
        <div className="flex items-center justify-center gap-2 bg-white/5 backdrop-blur-xs py-2 px-3 rounded-xl border border-white/10">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Fixed ₹10 Campus Fare</span>
        </div>
        <div className="flex items-center justify-center gap-2 bg-white/5 backdrop-blur-xs py-2 px-3 rounded-xl border border-white/10">
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Open Audi Road Hub</span>
        </div>
        <div className="flex items-center justify-center gap-2 bg-white/5 backdrop-blur-xs py-2 px-3 rounded-xl border border-white/10">
          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
          <span>Girls-Only Pool Filter</span>
        </div>
      </div>

      {/* Forgot Password / Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-slate-900 shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Student Account Help</h3>
                  <span className="text-xs text-slate-500">LPU UMS & VERTORIDE Credentials</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                For test & evaluation purposes, you can immediately use any of the pre-configured student accounts:
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 font-mono text-[11px]">
                <div><strong className="text-slate-800">Email:</strong> aarav.12115892@lpu.in</div>
                <div><strong className="text-slate-800">Password:</strong> verto123</div>
                <div className="text-slate-500 pt-1 text-[10px] font-sans">Or click the <strong>"⚡ Instant 1-Click Demo Login"</strong> buttons at the top of the sign in form!</div>
              </div>
              <p>
                When Firebase Authentication is plugged in, password resets will be handled automatically via Firebase Auth's `sendPasswordResetEmail()` service.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 cursor-pointer"
            >
              Got it, return to Sign In
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
