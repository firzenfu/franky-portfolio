export type ContactMessage = {
  name: string
  email: string
  message: string
}

export function buildMailtoUrl(input: ContactMessage) {
  const subject = encodeURIComponent(`Portfolio enquiry from ${input.name.trim()}`)
  const body = encodeURIComponent(
    `Name: ${input.name.trim()}\nEmail: ${input.email.trim()}\n\n${input.message.trim()}`,
  )
  return `mailto:firzenfu@gmail.com?subject=${subject}&body=${body}`
}
