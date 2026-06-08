export function validateActivationForm(password: string, passwordConfirmation: string): string | null {
  if (password.length < 8) return "A senha deve ter no mínimo 8 caracteres."
  if (password !== passwordConfirmation) return "As senhas não coincidem."
  return null
}
