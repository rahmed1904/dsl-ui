import React from 'react';
import { Box, Alert } from '@mui/material';

export default function ArtifactFetcherExample({ templateId }) {
  const [code, setCode] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!templateId) return;
    const fetchArtifact = async () => {
      try {
        const res = await fetch(`/api/templates/${templateId}/artifact`);
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        setCode(json.python_code);
      } catch (e) {
        setError(String(e));
      }
    };
    fetchArtifact();
  }, [templateId]);

  if (error) return (
    <Alert severity="error" sx={{ m: 2 }}>
      Error: {error}
    </Alert>
  );
  
  if (!code) return (
    <Box sx={{ p: 2, color: '#6C757D' }}>
      Loading artifact...
    </Box>
  );

  return (
    <Box sx={{ p: 2, bgcolor: '#F8F9FA' }}>
      <Box component="h3" sx={{ fontWeight: 600, mb: 1, fontSize: '0.9375rem', color: '#212529' }}>Artifact: {templateId}</Box>
      <Box component="pre" sx={{ 
        whiteSpace: 'pre-wrap', 
        fontSize: '0.8125rem',
        fontFamily: 'monospace',
        bgcolor: '#212529',
        color: '#F8F9FA',
        p: 2,
        borderRadius: 1,
        overflow: 'auto'
      }}>{code}</Box>
    </Box>
  );
}
