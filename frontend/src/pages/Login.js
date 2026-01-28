import React, { useState } from "react";
import { useToast } from "../components/ToastProvider";
import { 
  Lock as LockIcon, 
  Mail as MailIcon, 
  Visibility as EyeIcon, 
  VisibilityOff as EyeOffIcon 
} from '@mui/icons-material';
import { 
  Button, 
  TextField, 
  Card, 
  CardContent, 
  InputAdornment, 
  IconButton 
} from '@mui/material';

const FYNTRAC_LOGO = "https://customer-assets.emergentagent.com/job_code-finance-2/artifacts/hdj19r3w_Fyntrac%20%28600%20x%20400%20px%29%20%284%29.png";

// Hardcoded credentials
const VALID_USER = {
  email: "admin@fyntrac.com",
  password: "Funrun21@19b"
};

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email === VALID_USER.email && password === VALID_USER.password) {
      // Store login state
      localStorage.setItem("fyntrac_user", JSON.stringify({ email }));
      toast.success("Welcome to DSL Studio!");
      onLogin({ email });
    } else {
      toast.error("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4" 
      data-testid="login-page"
    >
      <Card 
        sx={{ 
          maxWidth: 448, 
          width: '100%', 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src={FYNTRAC_LOGO} 
              alt="Fyntrac" 
              className="h-16 w-auto object-contain"
              data-testid="login-logo"
            />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 
              className="text-2xl font-bold text-slate-900" 
              style={{ fontFamily: 'Manrope' }}
            >
              DSL Studio
            </h1>
            <p className="text-sm text-slate-600 mt-2">
              Sign in to your account
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                Email Address
              </label>
              <TextField
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fyntrac.com"
                required
                data-testid="login-email"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailIcon sx={{ color: '#94a3b8', fontSize: '1.25rem' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                Password
              </label>
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                data-testid="login-password"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#94a3b8', fontSize: '1.25rem' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? 
                          <EyeOffIcon sx={{ fontSize: '1.25rem' }} /> : 
                          <EyeIcon sx={{ fontSize: '1.25rem' }} />
                        }
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              data-testid="login-submit"
              sx={{
                background: 'linear-gradient(to right, #2563eb, #6366f1)',
                '&:hover': {
                  background: 'linear-gradient(to right, #1d4ed8, #4f46e5)',
                },
                py: 1.5,
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-xs text-slate-500 text-center mt-6">
            Design calculation logic with custom DSL functions
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
