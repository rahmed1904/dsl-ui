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
    <Box sx={{ p: 2 }}>
      Loading artifact...
    </Box>
  );

  return (
    <Box sx={{ p: 2, bgcolor: '#f8fafc' }}>
      <h3 className="font-semibold mb-2">Artifact: {templateId}</h3>
      <pre className="whitespace-pre-wrap text-sm">{code}</pre>
    </Box>
  );
}
