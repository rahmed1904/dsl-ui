import React, { useState } from "react";
import { useToast } from "../components/ToastProvider";
import { Lock as LockIcon, Mail as MailIcon, Visibility as EyeIcon, VisibilityOff as EyeOffIcon } from '@mui/icons-material';
import { Button, TextField, Card, CardContent, InputAdornment, IconButton, Box, Typography } from '@mui/material';

const FYNTRAC_LOGO = "https://customer-assets.emergentagent.com/job_code-finance-2/artifacts/hdj19r3w_Fyntrac%20%28600%20x%20400%20px%29%20%284%29.png";

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

    await new Promise(resolve => setTimeout(resolve, 500));

    if (email === VALID_USER.email && password === VALID_USER.password) {
      localStorage.setItem("fyntrac_user", JSON.stringify({ email }));
      toast.success("Welcome to DSL Studio!");
      onLogin({ email });
    } else {
      toast.error("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#F8F9FA',
        p: 3
      }}
      data-testid="login-page"
    >
      <Card 
        sx={{ 
          maxWidth: 420, 
          width: '100%',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <img 
              src={FYNTRAC_LOGO} 
              alt="Fyntrac" 
              style={{ height: 48, marginBottom: 24 }}
              data-testid="login-logo"
            />
            <Typography variant="h1" sx={{ fontSize: '1.75rem', fontWeight: 700, mb: 1, color: '#14213d' }}>
              DSL Studio
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to continue
            </Typography>
          </Box>

          <form onSubmit={handleLogin}>
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.primary' }}>
                Email Address
              </Typography>
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
                      <MailIcon sx={{ color: '#6C757D', fontSize: '1.25rem' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.primary' }}>
                Password
              </Typography>
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
                      <LockIcon sx={{ color: '#6C757D', fontSize: '1.25rem' }} />
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
                          <EyeOffIcon sx={{ fontSize: '1.25rem', color: '#6C757D' }} /> : 
                          <EyeIcon sx={{ fontSize: '1.25rem', color: '#6C757D' }} />
                        }
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              data-testid="login-submit"
              sx={{
                py: 1.25,
                fontSize: '0.875rem',
                fontWeight: 500,
                bgcolor: '#5B5FED',
                '&:hover': {
                  bgcolor: '#4346C8',
                },
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 3, color: 'text.secondary' }}>
            Domain Specific Language Studio for Finance
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;