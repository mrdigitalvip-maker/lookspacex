import { useEffect, useMemo, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)

  const isIOS = useMemo(() => {
    if (typeof navigator === 'undefined') return false
    return /iphone|ipad|ipod/i.test(navigator.userAgent)
  }, [])

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    const iosStandalone = Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
    setInstalled(standalone || iosStandalone)

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
    }

    const handleInstalled = () => {
      setInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  const install = async () => {
    if (!deferredPrompt) return 'unavailable' as const
    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === 'accepted') setDeferredPrompt(null)
    return choice.outcome
  }

  return {
    canInstall: Boolean(deferredPrompt) && !installed,
    installed,
    isIOS,
    install,
  }
}
