/**
 * Utilitários de validação
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Validação de email
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email é obrigatório');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Email deve ter um formato válido');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validação de senha
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Senha é obrigatória');
  } else {
    if (password.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra minúscula');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Senha deve conter pelo menos um número');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validação de nome
export function validateName(name: string): ValidationResult {
  const errors: string[] = [];
  
  if (!name) {
    errors.push('Nome é obrigatório');
  } else if (name.length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
    errors.push('Nome deve conter apenas letras e espaços');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validação de formulário genérico
export function validateForm(
  data: Record<string, any>, 
  rules: Record<string, (value: any) => ValidationResult>
): ValidationResult {
  const allErrors: string[] = [];
  
  Object.entries(rules).forEach(([field, validator]) => {
    const result = validator(data[field]);
    if (!result.isValid) {
      allErrors.push(...result.errors.map(error => `${field}: ${error}`));
    }
  });
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
}

// Sanitização de string
export function sanitizeString(str: string): string {
  return str.trim().replace(/\s+/g, ' ');
}

// Validação de URL
export function validateUrl(url: string): ValidationResult {
  const errors: string[] = [];
  
  if (!url) {
    errors.push('URL é obrigatória');
  } else {
    try {
      new URL(url);
    } catch {
      errors.push('URL deve ter um formato válido');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}