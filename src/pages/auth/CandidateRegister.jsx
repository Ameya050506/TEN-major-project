import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Code2, Eye, EyeOff, Check, User, Mail, Phone, Building, Briefcase, Lock } from "lucide-react";

export const CandidateRegister = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    designation: "",
    password: "",
    confirmPassword: "",
    termsAgreed: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { registerCandidate } = useAuth();
  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 25;
    return strength;
  };

  const strength = getPasswordStrength(formData.password);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Valid email is required";
    if (!formData.organization.trim()) errs.organization = "College / Organization is required";
    if (formData.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (!formData.termsAgreed) errs.termsAgreed = "You must agree to the CodeJudge Terms of Service";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await registerCandidate(formData);
      navigate("/candidate/dashboard");
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white mx-auto mb-3 shadow-md">
            <Code2 className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Create Candidate Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sign up to take proctored coding assessments and track results
          </p>
        </div>

        {errors.form && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Ameya Inamdar"
            icon={User}
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            error={errors.fullName}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="candidate@vesit.edu.in"
            icon={Mail}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="College / Org"
              placeholder="VESIT"
              icon={Building}
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              error={errors.organization}
            />
            <Input
              label="Course / Role"
              placeholder="Computer Eng"
              icon={Briefcase}
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            />
          </div>

          <Input
            label="Phone Number"
            type="tel"
            placeholder="+91 9820011223"
            icon={Phone}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <div>
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                icon={Lock}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength meter */}
            {formData.password && (
              <div className="mt-2">
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strength <= 25 ? "bg-rose-500" : strength <= 50 ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${strength}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Strength: {strength <= 25 ? "Weak" : strength <= 50 ? "Moderate" : "Strong"}
                </p>
              </div>
            )}
          </div>

          <Input
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            icon={Lock}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
          />

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={formData.termsAgreed}
              onChange={(e) => setFormData({ ...formData, termsAgreed: e.target.checked })}
              className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="terms" className="text-xs text-slate-600 dark:text-slate-400">
              I agree to the CodeJudge Assessment Honor Code and Terms of Service.
            </label>
          </div>
          {errors.termsAgreed && <p className="text-xs text-rose-500">{errors.termsAgreed}</p>}

          <Button type="submit" variant="primary" className="w-full mt-4" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          Already registered?{" "}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};