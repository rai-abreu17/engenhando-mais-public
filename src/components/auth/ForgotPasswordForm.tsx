import { useState } from 'react'
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"

interface ForgotPasswordFormProps {
  onBackToLogin: () => void
}

export default function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [emailError, setEmailError] = useState('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    if (emailError) {
      setEmailError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setEmailError('Email é obrigatório')
      return
    }
    
    if (!validateEmail(email)) {
      setEmailError('Por favor, digite um email válido')
      return
    }
    
    setIsLoading(true)

    // Simular chamada de API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <>
        <h1 className="text-white text-2xl font-semibold mb-4 text-center">
          Email enviado!
        </h1>
        
        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <p className="text-engenha-light-cream text-center mb-6 max-w-sm">
          Enviamos as instruções para redefinir sua senha para <strong>{email}</strong>
        </p>
        
        <p className="text-engenha-sky-blue text-sm text-center mb-8 max-w-sm">
          Verifique sua caixa de entrada e siga as instruções no email para criar uma nova senha.
        </p>
        
        <button
          onClick={onBackToLogin}
          className="w-full max-w-sm bg-engenha-orange hover:bg-engenha-dark-orange text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao login
        </button>
      </>
    )
  }

  return (
    <>
      <h1 className="text-white text-2xl font-semibold mb-4 text-center">
        Esqueceu a senha?
      </h1>
      
      <p className="text-engenha-light-cream text-center mb-8 max-w-sm">
        Digite seu email para receber as instruções de redefinição
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-engenha-sky-blue" size={20} />
          <input
            type="email"
            placeholder="DIGITE SEU EMAIL"
            value={email}
            onChange={handleEmailChange}
            className={`w-full bg-white/20 border rounded-lg pl-12 pr-4 py-3 text-engenha-light-blue placeholder-engenha-sky-blue focus:outline-none focus:ring-2 transition-colors ${
              emailError 
                ? 'border-red-400 focus:ring-red-400' 
                : 'border-engenha-sky-blue focus:ring-engenha-sky-blue'
            }`}
            required
          />
          {emailError && (
            <p className="text-red-400 text-sm mt-1">{emailError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !email || !!emailError}
          className="w-full bg-engenha-orange hover:bg-engenha-dark-orange disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block" />
              ENVIANDO...
            </>
          ) : (
            'REDEFINIR SENHA'
          )}
        </button>

        <button
          type="button"
          onClick={onBackToLogin}
          className="w-full text-engenha-light-cream text-sm underline mt-4 flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao login
        </button>
      </form>
    </>
  )
}
