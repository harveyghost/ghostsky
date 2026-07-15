import {useState} from 'react'

export function useWelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  // GHOST: disabled entirely. This was a marketing/signup CTA aimed at
  // logged-out visitors of a public product — doesn't make sense for a
  // single-user personal app. isOpen just never becomes true.

  return {isOpen, open, close}
}
