import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function VerifyPage() {
  const params = useSearchParams()
  const token = params.get('token')
  const [status, setStatus] = useState('Verifying...')

  useEffect(() => {
    if (!token) return setStatus('Missing token')
    fetch(`/api/auth/verify?token=${token}`).then(r => r.json()).then(j => {
      if (j.ok) setStatus('Verified — you can login now')
      else setStatus(j.error || 'Verification failed')
    })
  }, [token])

  return <div className="max-w-md mx-auto py-12">{status}</div>
}
