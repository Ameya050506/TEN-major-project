import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Avatar } from "../../components/common/Avatar";
import { User, Mail, Phone, Building, Briefcase, Calendar, Save } from "lucide-react";

export const CandidateProfile = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "Ameya Inamdar",
    email: user?.email || "ameya.inamdar@vesit.edu.in",
    phone: user?.phone || "+91 9820011223",
    organization: user?.organization || "VESIT",
    designation: user?.designation || "Computer Engineering",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Profile credentials updated successfully", "success");
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Candidate Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your contact credentials and institutional verification
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <Avatar name={formData.fullName} size="xl" />
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {formData.fullName}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{formData.email}</p>
          <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start text-xs text-slate-600 dark:text-slate-300">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              {formData.organization}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              {formData.designation}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
          Personal Information
        </h3>

        <Input
          label="Full Name"
          icon={User}
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            value={formData.email}
            disabled
            helperText="Email cannot be changed directly"
          />
          <Input
            label="Phone Number"
            type="tel"
            icon={Phone}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="College / Organization"
            icon={Building}
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
          />
          <Input
            label="Course / Designation"
            icon={Briefcase}
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
          />
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" variant="primary" icon={Save} isLoading={isSaving}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};