import { AppShell } from "@/components/app-shell"
import { PostDetailView } from "@/components/post-detail-view"

type PostPageProps = {
  params: Promise<{ id: string }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params
  return <AppShell><PostDetailView postId={id} /></AppShell>
}
