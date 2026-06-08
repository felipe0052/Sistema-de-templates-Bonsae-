import type { LucideIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormFieldWithIconProps {
  label: string
  htmlFor: string
  icon: LucideIcon
  inputProps: React.InputHTMLAttributes<HTMLInputElement>
}

export function FormFieldWithIcon({
  label,
  htmlFor,
  icon: Icon,
  inputProps,
}: FormFieldWithIconProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" {...inputProps} />
      </div>
    </div>
  )
}
