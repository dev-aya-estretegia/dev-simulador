import React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbItemProps {
  children: React.ReactNode
  href?: string
  isLast?: boolean
}

function BreadcrumbItem({ children, href, isLast = false }: BreadcrumbItemProps) {
  const content = (
    <div className={`flex items-center gap-1 text-sm ${isLast ? "font-medium" : "text-muted-foreground"}`}>
      {children}
    </div>
  )

  if (href && !isLast) {
    return (
      <Link href={href} className="hover:text-foreground transition-colors">
        {content}
      </Link>
    )
  }

  return content
}

interface BreadcrumbProps {
  children: React.ReactNode
}

export function Breadcrumb({ children }: BreadcrumbProps) {
  // Converter children para array para poder manipular
  const childrenArray = React.Children.toArray(children)

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1 text-sm">
      {childrenArray.map((child, index) => {
        const isLast = index === childrenArray.length - 1

        // Clonar o elemento filho para adicionar a propriedade isLast
        const clonedChild = React.isValidElement(child) ? React.cloneElement(child, { isLast }) : child

        return (
          <React.Fragment key={index}>
            {clonedChild}
            {!isLast && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

// Adicionar Item como propriedade de Breadcrumb para uso mais limpo
Breadcrumb.Item = BreadcrumbItem

export default Breadcrumb
