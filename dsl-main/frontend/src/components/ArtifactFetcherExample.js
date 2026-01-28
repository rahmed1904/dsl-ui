import React from 'react'

export default function ArtifactFetcherExample({ templateId }) {
  const [code, setCode] = React.useState(null)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (!templateId) return
    const fetchArtifact = async () => {
      try {
        const res = await fetch(`/api/templates/${templateId}/artifact`)
        if (!res.ok) throw new Error(await res.text())
        const json = await res.json()
        setCode(json.python_code)
      } catch (e) {
        setError(String(e))
      }
    }
    fetchArtifact()
  }, [templateId])

  if (error) return <div className="p-4 bg-red-50 text-red-800">Error: {error}</div>
  if (!code) return <div className="p-4">Loading artifact...</div>

  return (
    <div className="p-4 bg-gray-50">
      <h3 className="font-semibold mb-2">Artifact: {templateId}</h3>
      <pre className="whitespace-pre-wrap text-sm">{code}</pre>
    </div>
  )
}
