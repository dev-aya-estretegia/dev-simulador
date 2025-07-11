import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatarMoeda, formatarPercentual } from "@/lib/utils"

interface CenariosTableProps {
  cenarios: any[]
}

export function CenariosTable({ cenarios }: CenariosTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Empreendimento</TableHead>
            <TableHead className="text-right">VGV Projetado</TableHead>
            <TableHead className="text-right">Diferença %</TableHead>
            <TableHead className="text-right">Unidades</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cenarios.map((cenario) => (
            <TableRow key={cenario.id}>
              <TableCell className="font-medium">{cenario.nome}</TableCell>
              <TableCell>{cenario.empreendimento_nome}</TableCell>
              <TableCell className="text-right">
                {cenario.vgv_projetado ? formatarMoeda(cenario.vgv_projetado) : "Não calculado"}
              </TableCell>
              <TableCell className="text-right">
                {cenario.diferenca_percentual !== null ? formatarPercentual(cenario.diferenca_percentual) : "-"}
              </TableCell>
              <TableCell className="text-right">{cenario.total_unidades}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/cenarios/${cenario.id}`}>Visualizar</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
