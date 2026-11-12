"use client"
import { useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Mail, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { WorkConnectMark } from "@/components/work-connect-ui"
import { supabase } from "@/lib/supabase" // ← 追加
import { useRouter } from "next/navigation" // ← 追加
export function AuthPreview({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup"
  const [message, setMessage] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter() // ← 追加
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // メールアドレスをフォームから取得
    const emailInput = (event.currentTarget.elements.namedItem("auth-email") as HTMLInputElement).value
    if (isSignup) {
      // パスワード確認
      if (password !== confirmPassword) {
        setMessage("パスワードが一致しません。入力内容を確認してください。")
        return
      }
      // Supabaseにサインアップ
      const { error } = await supabase.auth.signUp({
        email: emailInput,
        password,
      })
      if (error) {
        setMessage(error.message)
        return
      }
      setMessage("登録完了しました！ログインしてください。")
      router.push("/login")
    } else {
      // Supabaseにサインイン
      const { error } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password,
      })
      if (error) {
        setMessage(error.message)
        return
      }
      // ログイン成功 → トップへ
      router.push("/")
    }
  }
  return (
    <main className="auth-page">
      <section className="auth-story" aria-label="Work Connectについて">
        <Link href="/" className="brand-link auth-brand" aria-label="Work Connect 掲示板へ">
          <WorkConnectMark />
          <span className="brand-copy">
            <span className="brand-name">Work Connect</span>
            <span className="brand-subtitle">社内コミュニティ</span>
          </span>
        </Link>
        <div className="auth-story-copy">
          <span className="auth-story-icon"><ShieldCheck aria-hidden="true" /></span>
          <p className="page-eyebrow">A SAFE PLACE TO CONNECT</p>
          <h1>個人SNSを交換しなくても、<br />職場の声は届けられる。</h1>
          <p>現場の気づきも、人事からのお知らせも。安心して話せる社内コミュニティ。</p>
          <div className="auth-trust-list">
            <span><ShieldCheck aria-hidden="true" />全員共通の匿名アバター</span>
            <span><Mail aria-hidden="true" />メールアドレスで本人確認</span>
          </div>
        </div>
        <div className="auth-story-footer">Work Connect <span>·</span> みんなの声を、ここから。</div>
      </section>
      <section className="auth-form-area" aria-labelledby="auth-title">
        <Link href="/" className="auth-back-link"><ArrowLeft aria-hidden="true" />掲示板に戻る</Link>
        <Card className="auth-card">
          <CardHeader className="auth-card-header">
            <p className="page-eyebrow">{isSignup ? "SIGN UP" : "WELCOME BACK"}</p>
            <CardTitle id="auth-title">{isSignup ? "新規登録" : "おかえりなさい"}</CardTitle>
            <CardDescription>
              {isSignup ? "メールアドレスとパスワードで登録します。" : "メールアドレスとパスワードでログインします。"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="auth-card-content">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="auth-email">メールアドレス</FieldLabel>
                  <Input id="auth-email" type="email" autoComplete="email" placeholder="you@company.jp" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="auth-password">パスワード</FieldLabel>
                  <Input
                    id="auth-password"
                    type="password"
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    placeholder="8文字以上"
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </Field>
                {isSignup ? (
                  <Field>
                    <FieldLabel htmlFor="auth-confirm-password">パスワード（確認）</FieldLabel>
                    <Input
                      id="auth-confirm-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="もう一度入力"
                      minLength={8}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      required
                    />
                  </Field>
                ) : null}
              </FieldGroup>
              {message ? <p className="auth-status" role="status" aria-live="polite">{message}</p> : null}
            </CardContent>
            <CardFooter className="auth-card-footer">
              <Button type="submit" size="lg" className="auth-submit-button">
                {isSignup ? "登録する" : "ログイン"}<ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Button>
              <p className="auth-switch-link">
                {isSignup ? "すでにアカウントをお持ちですか？" : "はじめて利用する方はこちら"}{" "}
                <Link href={isSignup ? "/login" : "/signup"}>{isSignup ? "ログイン" : "新規登録"}</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </section>
    </main>
  )
}
