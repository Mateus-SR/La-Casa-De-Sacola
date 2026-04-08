export function getAuthErrorMessage(error, mode = "login") {
  const rawMessage = (error?.message || "").toLowerCase();

  if (
    rawMessage.includes("invalid login credentials") ||
    rawMessage.includes("invalid email or password")
  ) {
    return "Email ou senha inválidos.";
  }

  if (rawMessage.includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar.";
  }

  if (rawMessage.includes("already registered") || rawMessage.includes("user already registered")) {
    return "Este e-mail já está cadastrado.";
  }

  if (rawMessage.includes("password should be at least") || rawMessage.includes("weak password")) {
    return "A senha deve ter pelo menos 6 caracteres.";
  }

  if (rawMessage.includes("unable to validate email address") || rawMessage.includes("invalid email")) {
    return "Digite um e-mail válido.";
  }

  if (rawMessage.includes("too many requests") || rawMessage.includes("rate limit")) {
    return "Muitas tentativas em pouco tempo. Tente novamente em alguns minutos.";
  }

  if (mode === "signup") {
    return "Não foi possível concluir o cadastro agora. Tente novamente.";
  }

  return "Não foi possível entrar agora. Tente novamente.";
}
