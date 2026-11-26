'use client'

import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { WorkConnectMark } from '@/components/work-connect-ui'

export default function Header() {
  const router = useRouter()
  const handleSignOut = async () => {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) return
    router.replace('/login')
    router.refresh()
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand-link" aria-label="Work Connect 掲示板へ">
          <WorkConnectMark />
          <span className="brand-copy">
            <span className="brand-name">Work Connect</span>
            <span className="brand-subtitle">社内コミュニティ</span>
          </span>
        </Link>
        {supabase ? (
          <Button type="button" variant="outline" className="header-logout-button" onClick={handleSignOut}>
            <LogOut data-icon="inline-start" aria-hidden="true" />ログアウト
          </Button>
        ) : null}
      </div>
    </header>
  )
}
