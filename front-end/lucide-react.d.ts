declare module "lucide-react" {
  import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react"

  interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number
    absoluteStrokeWidth?: boolean
    color?: string
    strokeWidth?: string | number
  }

  type LucideIcon = ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>

  export const ArrowLeft: LucideIcon
  export const Bell: LucideIcon
  export const Building: LucideIcon
  export const Check: LucideIcon
  export const CheckIcon: LucideIcon
  export const ChevronDownIcon: LucideIcon
  export const ChevronRightIcon: LucideIcon
  export const ChevronUpIcon: LucideIcon
  export const ChevronsUpDown: LucideIcon
  export const CircleIcon: LucideIcon
  export const Copy: LucideIcon
  export const Download: LucideIcon
  export const Edit: LucideIcon
  export const Eye: LucideIcon
  export const FileDown: LucideIcon
  export const FileImage: LucideIcon
  export const FileText: LucideIcon
  export const Filter: LucideIcon
  export const Image: LucideIcon
  export const Loader2: LucideIcon
  export const Lock: LucideIcon
  export const Mail: LucideIcon
  export const Menu: LucideIcon
  export const Moon: LucideIcon
  export const MoreHorizontal: LucideIcon
  export const Pencil: LucideIcon
  export const Play: LucideIcon
  export const Plus: LucideIcon
  export const Printer: LucideIcon
  export const Save: LucideIcon
  export const Search: LucideIcon
  export const SearchIcon: LucideIcon
  export const Settings: LucideIcon
  export const Shield: LucideIcon
  export const Sun: LucideIcon
  export const Trash2: LucideIcon
  export const Upload: LucideIcon
  export const User: LucideIcon
  export const UserRound: LucideIcon
  export const Variable: LucideIcon
  export const VariableIcon: LucideIcon
  export const X: LucideIcon
  export const XIcon: LucideIcon
}
