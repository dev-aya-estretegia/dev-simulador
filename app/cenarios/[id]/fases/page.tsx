import { FasesClientPage } from "@/components/fases/fases-client-page"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

type Props = {
  params: {
    id: string
  }
}

function FasesLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-5 w-1/3" />
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="mt-2 h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  )
}

export default function FasesPage({ params }: Props) {
  const cenarioId = Number(params.id)

  if (isNaN(cenarioId)) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold text-red-600">ID de Cenário Inválido</h1>
        <p>O ID fornecido não é um número válido.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<FasesLoading />}>
        <FasesClientPage cenarioId={cenarioId} />
      </Suspense>
    </div>
  )
}
