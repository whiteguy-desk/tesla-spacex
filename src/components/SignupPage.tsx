import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { updateProfile, formatAuthError } from '../lib/auth';
import { useAuth } from '../context/AuthContext';
import { navigate } from '../lib/navigation';

export const SignupPage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    country: '',
    currency: '',
    phone: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        setErrorMessage(formatAuthError(authError));
        setIsSubmitting(false);
        return;
      }

      const createdUser = authData.user;
      if (!createdUser) {
        setErrorMessage('Failed to create user account. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // 2. Update the profile row that was created by the database trigger
      const { error: profileError } = await updateProfile(createdUser.id, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        gender: formData.gender,
        date_of_birth: formData.dob,
        country: formData.country,
        currency: formData.currency,
        phone: formData.phone,
      });

      if (profileError) {
        console.error('Error updating profile metadata:', profileError);
      }

      // 3. Refresh profile in AuthContext
      await refreshProfile();

      // Check if session was returned or exists
      const session = authData.session || (await supabase.auth.getSession()).data.session;

      if (session) {
        setHasSession(true);
        // Navigate directly to authenticated dashboard
        navigate('/dashboard');
      } else {
        setHasSession(false);
        setSubmitted(true);
      }
    } catch (err) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="min-h-[100dvh] bg-black flex items-start sm:items-center justify-center px-6 py-20 pt-24 sm:py-24 overflow-y-auto">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(232,33,39,0.03)_0%,_transparent_60%)] pointer-events-none"></div>
        <div className="relative w-full max-w-lg">
          <div className="text-center mb-10">
            <a
              className="text-lg font-bold tracking-[0.25em] uppercase text-white inline-block cursor-pointer"
              style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
            >
              Meta <span className="text-red-500">Wealth</span>
            </a>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 sm:p-10">
            <div className="mb-8">
              <h1
                className="text-2xl font-bold tracking-[0.04em] text-white mb-2"
                style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}
              >
                Create your account
              </h1>
              <p className="text-sm text-white/40 font-light mb-4">
                Start building your portfolio today
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 font-light leading-relaxed">
                {errorMessage}
              </div>
            )}

            {submitted ? (
              <div className="text-center py-8">
                {hasSession ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-xl">
                      ✓
                    </div>
                    <h2 className="text-xl font-bold mb-2">Account Created</h2>
                    <p className="text-sm text-white/60 mb-6">
                      Welcome aboard! Your registration is complete.
                    </p>
                    <a
                      href="/dashboard"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/dashboard');
                      }}
                      className="inline-block px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                    >
                      Go to Dashboard
                    </a>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-xl">
                      ✉
                    </div>
                    <h2 className="text-xl font-bold mb-2">Account Created</h2>
                    <p className="text-sm text-white/60 mb-6 leading-relaxed">
                      Please check your email to confirm your account before logging in.
                      <br />
                      <span className="text-xs text-white/40 mt-2 block">
                        (To enable instant sign-up without email confirmation, disable &quot;Confirm email&quot; in Supabase Auth Settings.)
                      </span>
                    </p>
                    <a
                      href="/invest/login"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/invest/login');
                      }}
                      className="inline-block px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                    >
                      Go to Sign In
                    </a>
                  </>
                )}
              </div>
            ) : (
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="john.doe@example.com"
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 font-light outline-none focus:border-white/30 transition-colors duration-300"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium mb-2"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      required
                      placeholder="John"
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 font-light outline-none focus:border-white/30 transition-colors duration-300"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      required
                      placeholder="Doe"
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 font-light outline-none focus:border-white/30 transition-colors duration-300"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium mb-2"
                    >
                      Gender
                    </label>
                    <div className="relative">
                      <select
                        id="gender"
                        required
                        className={`w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 text-sm font-light outline-none focus:border-white/30 transition-colors duration-300 appearance-none cursor-pointer [&>option]:bg-[#0a0a0a] [&>option]:text-white ${
                          formData.gender ? 'text-white' : 'text-white/20'
                        }`}
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-xs">
                        ▼
                      </span>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="dob"
                      className="block text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium mb-2"
                    >
                      Date of Birth
                    </label>
                    <input
                      id="dob"
                      type="date"
                      required
                      className={`w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 text-sm font-light outline-none focus:border-white/30 transition-colors duration-300 !px-3 sm:!px-4 box-border ${
                        formData.dob ? 'text-white' : 'text-white/20'
                      }`}
                      style={{ colorScheme: 'dark' }}
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium mb-2"
                    >
                      Country
                    </label>
                    <div className="relative">
                      <select
                        id="country"
                        required
                        className={`w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 text-sm font-light outline-none focus:border-white/30 transition-colors duration-300 appearance-none cursor-pointer [&>option]:bg-[#0a0a0a] [&>option]:text-white ${
                          formData.country ? 'text-white' : 'text-white/20'
                        }`}
                        value={formData.country}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        <option value="Afghanistan">Afghanistan</option>
                        <option value="Albania">Albania</option>
                        <option value="Algeria">Algeria</option>
                        <option value="Andorra">Andorra</option>
                        <option value="Angola">Angola</option>
                        <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Armenia">Armenia</option>
                        <option value="Australia">Australia</option>
                        <option value="Austria">Austria</option>
                        <option value="Azerbaijan">Azerbaijan</option>
                        <option value="Bahamas">Bahamas</option>
                        <option value="Bahrain">Bahrain</option>
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="Barbados">Barbados</option>
                        <option value="Belarus">Belarus</option>
                        <option value="Belgium">Belgium</option>
                        <option value="Belize">Belize</option>
                        <option value="Benin">Benin</option>
                        <option value="Bhutan">Bhutan</option>
                        <option value="Bolivia">Bolivia</option>
                        <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                        <option value="Botswana">Botswana</option>
                        <option value="Brazil">Brazil</option>
                        <option value="Brunei">Brunei</option>
                        <option value="Bulgaria">Bulgaria</option>
                        <option value="Burkina Faso">Burkina Faso</option>
                        <option value="Burundi">Burundi</option>
                        <option value="Cabo Verde">Cabo Verde</option>
                        <option value="Cambodia">Cambodia</option>
                        <option value="Cameroon">Cameroon</option>
                        <option value="Canada">Canada</option>
                        <option value="Central African Republic">Central African Republic</option>
                        <option value="Chad">Chad</option>
                        <option value="Chile">Chile</option>
                        <option value="China">China</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Comoros">Comoros</option>
                        <option value="Congo (Brazzaville)">Congo (Brazzaville)</option>
                        <option value="Congo (Kinshasa)">Congo (Kinshasa)</option>
                        <option value="Costa Rica">Costa Rica</option>
                        <option value="Croatia">Croatia</option>
                        <option value="Cuba">Cuba</option>
                        <option value="Cyprus">Cyprus</option>
                        <option value="Czech Republic">Czech Republic</option>
                        <option value="Denmark">Denmark</option>
                        <option value="Djibouti">Djibouti</option>
                        <option value="Dominica">Dominica</option>
                        <option value="Dominican Republic">Dominican Republic</option>
                        <option value="East Timor">East Timor</option>
                        <option value="Ecuador">Ecuador</option>
                        <option value="Egypt">Egypt</option>
                        <option value="El Salvador">El Salvador</option>
                        <option value="Equatorial Guinea">Equatorial Guinea</option>
                        <option value="Eritrea">Eritrea</option>
                        <option value="Estonia">Estonia</option>
                        <option value="Eswatini">Eswatini</option>
                        <option value="Ethiopia">Ethiopia</option>
                        <option value="Fiji">Fiji</option>
                        <option value="Finland">Finland</option>
                        <option value="France">France</option>
                        <option value="Gabon">Gabon</option>
                        <option value="Gambia">Gambia</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Germany">Germany</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Greece">Greece</option>
                        <option value="Grenada">Grenada</option>
                        <option value="Guatemala">Guatemala</option>
                        <option value="Guinea">Guinea</option>
                        <option value="Guinea-Bissau">Guinea-Bissau</option>
                        <option value="Guyana">Guyana</option>
                        <option value="Haiti">Haiti</option>
                        <option value="Honduras">Honduras</option>
                        <option value="Hungary">Hungary</option>
                        <option value="Iceland">Iceland</option>
                        <option value="India">India</option>
                        <option value="Indonesia">Indonesia</option>
                        <option value="Iran">Iran</option>
                        <option value="Iraq">Iraq</option>
                        <option value="Ireland">Ireland</option>
                        <option value="Israel">Israel</option>
                        <option value="Italy">Italy</option>
                        <option value="Ivory Coast">Ivory Coast</option>
                        <option value="Jamaica">Jamaica</option>
                        <option value="Japan">Japan</option>
                        <option value="Jordan">Jordan</option>
                        <option value="Kazakhstan">Kazakhstan</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Kiribati">Kiribati</option>
                        <option value="Kosovo">Kosovo</option>
                        <option value="Kuwait">Kuwait</option>
                        <option value="Kyrgyzstan">Kyrgyzstan</option>
                        <option value="Laos">Laos</option>
                        <option value="Latvia">Latvia</option>
                        <option value="Lebanon">Lebanon</option>
                        <option value="Lesotho">Lesotho</option>
                        <option value="Liberia">Liberia</option>
                        <option value="Libya">Libya</option>
                        <option value="Liechtenstein">Liechtenstein</option>
                        <option value="Lithuania">Lithuania</option>
                        <option value="Luxembourg">Luxembourg</option>
                        <option value="Madagascar">Madagascar</option>
                        <option value="Malawi">Malawi</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Maldives">Maldives</option>
                        <option value="Mali">Mali</option>
                        <option value="Malta">Malta</option>
                        <option value="Marshall Islands">Marshall Islands</option>
                        <option value="Mauritania">Mauritania</option>
                        <option value="Mauritius">Mauritius</option>
                        <option value="Mexico">Mexico</option>
                        <option value="Micronesia">Micronesia</option>
                        <option value="Moldova">Moldova</option>
                        <option value="Monaco">Monaco</option>
                        <option value="Mongolia">Mongolia</option>
                        <option value="Montenegro">Montenegro</option>
                        <option value="Morocco">Morocco</option>
                        <option value="Mozambique">Mozambique</option>
                        <option value="Myanmar">Myanmar</option>
                        <option value="Namibia">Namibia</option>
                        <option value="Nauru">Nauru</option>
                        <option value="Nepal">Nepal</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="New Zealand">New Zealand</option>
                        <option value="Nicaragua">Nicaragua</option>
                        <option value="Niger">Niger</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="North Korea">North Korea</option>
                        <option value="North Macedonia">North Macedonia</option>
                        <option value="Norway">Norway</option>
                        <option value="Oman">Oman</option>
                        <option value="Pakistan">Pakistan</option>
                        <option value="Palau">Palau</option>
                        <option value="Palestine">Palestine</option>
                        <option value="Panama">Panama</option>
                        <option value="Papua New Guinea">Papua New Guinea</option>
                        <option value="Paraguay">Paraguay</option>
                        <option value="Peru">Peru</option>
                        <option value="Philippines">Philippines</option>
                        <option value="Poland">Poland</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Qatar">Qatar</option>
                        <option value="Romania">Romania</option>
                        <option value="Russia">Russia</option>
                        <option value="Rwanda">Rwanda</option>
                        <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                        <option value="Saint Lucia">Saint Lucia</option>
                        <option value="Saint Vincent and the Grenadines">
                          Saint Vincent and the Grenadines
                        </option>
                        <option value="Samoa">Samoa</option>
                        <option value="San Marino">San Marino</option>
                        <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Senegal">Senegal</option>
                        <option value="Serbia">Serbia</option>
                        <option value="Seychelles">Seychelles</option>
                        <option value="Sierra Leone">Sierra Leone</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Slovakia">Slovakia</option>
                        <option value="Slovenia">Slovenia</option>
                        <option value="Solomon Islands">Solomon Islands</option>
                        <option value="Somalia">Somalia</option>
                        <option value="South Africa">South Africa</option>
                        <option value="South Korea">South Korea</option>
                        <option value="South Sudan">South Sudan</option>
                        <option value="Spain">Spain</option>
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="Sudan">Sudan</option>
                        <option value="Suriname">Suriname</option>
                        <option value="Sweden">Sweden</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="Syria">Syria</option>
                        <option value="Taiwan">Taiwan</option>
                        <option value="Tajikistan">Tajikistan</option>
                        <option value="Tanzania">Tanzania</option>
                        <option value="Thailand">Thailand</option>
                        <option value="Togo">Togo</option>
                        <option value="Tonga">Tonga</option>
                        <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                        <option value="Tunisia">Tunisia</option>
                        <option value="Turkey">Turkey</option>
                        <option value="Turkmenistan">Turkmenistan</option>
                        <option value="Tuvalu">Tuvalu</option>
                        <option value="Uganda">Uganda</option>
                        <option value="Ukraine">Ukraine</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="Uzbekistan">Uzbekistan</option>
                        <option value="Vanuatu">Vanuatu</option>
                        <option value="Vatican City">Vatican City</option>
                        <option value="Venezuela">Venezuela</option>
                        <option value="Vietnam">Vietnam</option>
                        <option value="Yemen">Yemen</option>
                        <option value="Zambia">Zambia</option>
                        <option value="Zimbabwe">Zimbabwe</option>
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-xs">
                        ▼
                      </span>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="currency"
                      className="block text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium mb-2"
                    >
                      Currency
                    </label>
                    <div className="relative">
                      <select
                        id="currency"
                        required
                        className={`w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 text-sm font-light outline-none focus:border-white/30 transition-colors duration-300 appearance-none cursor-pointer [&>option]:bg-[#0a0a0a] [&>option]:text-white ${
                          formData.currency ? 'text-white' : 'text-white/20'
                        }`}
                        value={formData.currency}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        <option value="USD">USD</option>
                        <option value="GBP">GBP</option>
                        <option value="EUR">EUR</option>
                        <option value="CAD">CAD</option>
                        <option value="AUD">AUD</option>
                        <option value="ZAR">ZAR</option>
                        <option value="INR">INR</option>
                        <option value="BRL">BRL</option>
                        <option value="JPY">JPY</option>
                        <option value="SGD">SGD</option>
                        <option value="AED">AED</option>
                        <option value="CHF">CHF</option>
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-xs">
                        ▼
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 font-light outline-none focus:border-white/30 transition-colors duration-300"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Min. 8 characters"
                      minLength={8}
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 font-light outline-none focus:border-white/30 transition-colors duration-300 pr-12"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-xs tracking-wide uppercase cursor-pointer"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-red-600 text-white text-sm font-semibold tracking-[0.1em] uppercase rounded-full transition-all duration-300 hover:bg-red-500 hover:scale-[1.02] shadow-[0_0_20px_rgba(232,33,39,0.2)] mt-2 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 cursor-pointer"
                  style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}

            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-[1px] bg-white/[0.06]"></div>
              <span className="text-[11px] text-white/20 uppercase tracking-widest">or</span>
              <div className="flex-1 h-[1px] bg-white/[0.06]"></div>
            </div>

            <p className="text-center text-sm text-white/40 font-light">
              Already have an account?{' '}
              <a
                className="text-white/70 hover:text-white transition-colors duration-300 font-medium cursor-pointer"
                href="/invest/login"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/invest/login');
                }}
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
