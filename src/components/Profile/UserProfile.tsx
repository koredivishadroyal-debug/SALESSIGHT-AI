import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Camera, 
  Building, 
  Briefcase, 
  ShieldCheck, 
  Bell, 
  Lock,
  Edit2,
  Check,
  X,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface UserProfileData {
  name: string;
  email: string;
  avatar: string;
  role: string;
  company: string;
  bio: string;
}

interface UserProfileProps {
  user: UserProfileData;
  onUpdate: (updatedUser: UserProfileData) => void;
}

export default function UserProfile({ user, onUpdate }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfileData>(user);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate password change
    console.log('Changing password...', passwordForm);
    setIsChangingPassword(false);
    setPasswordForm({ current: '', new: '', confirm: '' });
    // In a real app, you'd call an API here
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">User Settings</h1>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Personal Identification & Identity</p>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
          >
            <Edit2 size={14} />
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-3">
             <button 
                onClick={() => {
                  setFormData(user);
                  setIsEditing(false);
                }}
                className="px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20"
              >
                Save Changes
              </button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0f0f12] border border-white/10 rounded-[32px] p-8 text-center relative overflow-hidden group">
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
            
            <div className="relative z-10">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="w-full h-full rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl ring-4 ring-black/50 overflow-hidden">
                   {formData.avatar ? (
                     <img src={formData.avatar} alt={formData.name} className="w-full h-full object-cover rounded-2xl" />
                   ) : (
                     formData.name.substring(0, 1).toUpperCase()
                   )}
                </div>
                {isEditing && (
                  <>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden" 
                      accept="image/*"
                    />
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 p-2 bg-white text-black rounded-lg shadow-xl hover:scale-110 transition-transform z-20"
                    >
                      <Camera size={14} />
                    </button>
                  </>
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{formData.name}</h3>
              <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">{formData.role}</p>
              
              <div className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit mx-auto">
                 <ShieldCheck size={12} className="text-emerald-500" />
                 <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Verified Identity</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Status</span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             </div>
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Account Type</span>
                <span className="text-xs text-white font-bold">Enterprise Pro</span>
             </div>
          </div>
        </div>

        {/* Details Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-[#0f0f12] border border-white/10 rounded-[32px] p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-2">Display Name</label>
                <div className="relative group">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="text"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white outline-none focus:border-indigo-500 transition-all font-medium disabled:opacity-50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-2">Email Endpoint</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="email"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white outline-none focus:border-indigo-500 transition-all font-medium disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-2">Organization</label>
                <div className="relative group">
                  <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="text"
                    disabled={!isEditing}
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white outline-none focus:border-indigo-500 transition-all font-medium disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-2">Professional Role</label>
                <div className="relative group">
                  <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="text"
                    disabled={!isEditing}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white outline-none focus:border-indigo-500 transition-all font-medium disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-2">Operational Bio</label>
               <textarea 
                  disabled={!isEditing}
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 transition-all font-medium disabled:opacity-50 resize-none"
                  placeholder="Share a brief overview of your role..."
               />
            </div>

            <div className="pt-4 border-t border-white/5">
               <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Security & Preferences</h4>
               <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                     <div className="flex items-center gap-4">
                        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                           <Bell size={16} />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-white">Smart Notifications</p>
                           <p className="text-[10px] text-gray-500">ML-driven alerts based on sales patterns</p>
                        </div>
                     </div>
                     <div className="w-10 h-5 bg-indigo-600 rounded-full p-1 cursor-pointer">
                        <div className="w-3 h-3 bg-white rounded-full translate-x-5" />
                     </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                     <div className="flex items-center gap-4">
                        <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
                           <Key size={16} />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-white">Access Credentials</p>
                           <p className="text-[10px] text-gray-500">Regularly update your login secret</p>
                        </div>
                     </div>
                     <button 
                        type="button"
                        onClick={() => setIsChangingPassword(!isChangingPassword)}
                        className="flex items-center gap-2 text-brand-primary text-[10px] font-bold uppercase tracking-widest hover:underline cursor-pointer"
                     >
                        {isChangingPassword ? 'Cancel Update' : 'Change Password'} <Lock size={10} />
                     </button>
                  </div>

                  <AnimatePresence>
                    {isChangingPassword && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 p-6 bg-white/5 rounded-[24px] border border-brand-primary/20 space-y-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Current Password Confirmation</label>
                              <div className="relative">
                                 <input 
                                    type={showCurrent ? "text" : "password"}
                                    required
                                    value={passwordForm.current}
                                    onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white outline-none focus:border-brand-primary transition-all text-sm"
                                    placeholder="••••••••"
                                 />
                                 <button 
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                 >
                                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                 </button>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">New Secure Cipher</label>
                                 <div className="relative">
                                    <input 
                                       type={showNew ? "text" : "password"}
                                       required
                                       value={passwordForm.new}
                                       onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                                       className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white outline-none focus:border-brand-primary transition-all text-sm"
                                       placeholder="••••••••"
                                    />
                                    <button 
                                       type="button"
                                       onClick={() => setShowNew(!showNew)}
                                       className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                    >
                                       {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Validate Cipher</label>
                                 <input 
                                    type="password"
                                    required
                                    value={passwordForm.confirm}
                                    onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                                    className={cn(
                                      "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-primary transition-all text-sm",
                                      passwordForm.confirm && passwordForm.new !== passwordForm.confirm && "border-rose-500/50"
                                    )}
                                    placeholder="••••••••"
                                 />
                              </div>
                           </div>

                           <div className="pt-4 flex justify-end gap-3">
                              <button 
                                type="button"
                                onClick={() => setIsChangingPassword(false)}
                                className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                              >
                                Abandon
                              </button>
                              <button 
                                type="button"
                                onClick={handlePasswordSubmit}
                                disabled={!passwordForm.current || !passwordForm.new || passwordForm.new !== passwordForm.confirm}
                                className="px-6 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50 disabled:shadow-none"
                              >
                                Update Credentials
                              </button>
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                     <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                           <Lock size={16} />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-white">Two-Factor Authentication</p>
                           <p className="text-[10px] text-gray-500">Biometric and hardware token support</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-bold uppercase tracking-widest hover:underline cursor-pointer">
                        Configure <Edit2 size={10} />
                     </div>
                  </div>
               </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
