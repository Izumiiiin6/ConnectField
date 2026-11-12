"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Check, Home, LogOut, ShieldCheck, SquarePen, UserRound, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { usePrototypeStore } from "@/components/prototype-store"
import { AnonymousAvatar, WorkConnectMark } from "@/components/work-connect-ui"
import type { ReactNode } from "react"

const navigationItems = [
  { href: "/", label: "掲示板", icon: Home },
  { href: "/posts/new", label: "投稿を作成", icon: SquarePen },
  { href: "/notifications", label: "通知", icon: Bell },
  { href: "/profile", label: "プロフィール", icon: UserRound },
]

function isNavigationActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || (pathname.startsWith("/posts/") && pathname !== "/posts/new")
  return pathname === href
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { unreadCount, statusMessage, announce, profile } = usePrototypeStore()

  return (
    <div className="app-root">
      <header className="site-header">
        <div className="site-header-inner">
          <Link href="/" className="brand-link" aria-label="Work Connect 掲示板へ">
            <WorkConnectMark />
            <span className="brand-copy">
              <span className="brand-name">Work Connect</span>
              <span className="brand-subtitle">社内コミュニティ</span>
            </span>
          </Link>
          <div className="header-tagline"><ShieldCheck aria-hidden="true" /> <span>匿名で安心して共有</span></div>
          <div className="header-actions">
            <Link
              href="/notifications"
              className="header-icon-button"
              aria-label={unreadCount ? `通知一覧、未読${unreadCount}件` : "通知一覧"}
            >
              <Bell aria-hidden="true" />
              {unreadCount > 0 ? <span className="header-count" aria-hidden="true">{unreadCount > 9 ? "9+" : unreadCount}</span> : null}
            </Link>
            <Link href="/profile" className="header-profile">
              <AnonymousAvatar size="sm" />
              <span className="header-profile-label">{profile.name}</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="demo-banner">
        <div className="demo-banner-copy">
          <Badge variant="outline" className="prototype-badge">PROTOTYPE</Badge>
          <span>デモ版です。投稿本文以外の操作は一時表示で、リロードすると初期状態に戻ります。</span>
        </div>
        <Link href="/login" className="demo-auth-link">認証画面を見る <ArrowUpRight aria-hidden="true" /></Link>
      </div>

      <div className="workspace-layout">
        <aside className="workspace-sidebar" aria-label="ワークスペース">
          <div>
            <p className="sidebar-label">メニュー</p>
            <nav className="sidebar-nav" aria-label="メインナビゲーション">
              {navigationItems.map(({ href, label, icon: Icon }) => {
                const active = isNavigationActive(pathname, href)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn("sidebar-link", active && "is-active")}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon aria-hidden="true" />
                    <span>{label}</span>
                    {href === "/notifications" && unreadCount > 0 ? <span className="sidebar-count">{unreadCount}</span> : null}
                  </Link>
                )
              })}
            </nav>
          </div>

          <Card className="sidebar-privacy-card">
            <CardHeader className="sidebar-privacy-header">
              <span className="privacy-icon"><ShieldCheck aria-hidden="true" /></span>
              <CardTitle>匿名で、安心して。</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>掲示板では、全員共通のアバターを表示します。</CardDescription>
            </CardContent>
          </Card>

          <div className="sidebar-user-card">
            <AnonymousAvatar size="sm" />
            <div className="sidebar-user-copy">
              <span>{profile.name}</span>
              <small>{profile.department}</small>
            </div>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label="ログアウトは認証設定後に利用できます"
              title="ログアウトは認証設定後に利用できます"
              onClick={() => announce("ログアウト機能はSupabase Authの設定後に有効になります。")}
            >
              <LogOut data-icon="inline-start" aria-hidden="true" />
            </Button>
          </div>
        </aside>

        <main className="workspace-content" id="main-content">
          {children}
        </main>
      </div>

      <nav className="mobile-nav" aria-label="モバイルナビゲーション">
        {navigationItems.map(({ href, label, icon: Icon }) => {
          const active = isNavigationActive(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              className={cn("mobile-nav-link", active && "is-active")}
              aria-current={active ? "page" : undefined}
            >
              <span className="mobile-nav-icon-wrap">
                <Icon aria-hidden="true" />
                {href === "/notifications" && unreadCount > 0 ? <span className="mobile-nav-count" aria-hidden="true">{unreadCount}</span> : null}
              </span>
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {statusMessage ? (
        <div className="global-toast" role="status" aria-live="polite">
          <Check aria-hidden="true" />
          <span>{statusMessage}</span>
        </div>
      ) : null}
    </div>
  )
}
