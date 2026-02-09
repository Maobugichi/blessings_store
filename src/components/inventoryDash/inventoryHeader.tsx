import { useAuthContext } from "@/context/authContext"
import {
  Avatar,
  AvatarFallback,

} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"


const Header = () => {
  const { admin } = useAuthContext()


  const initials = admin?.email
    ? admin.email.slice(0, 2).toUpperCase()
    : "AD"

  return (
    <header className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
       
        <div>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight">
            Blessing&apos;s Inventory
          </h1>
          <p className="text-muted-foreground mt-1">
            Track stock, sales, and profits in real-time
          </p>
        </div>

       
        <DropdownMenu >
          <DropdownMenuTrigger className="md:h-11 md:w-11 h-10 w-10" asChild>
              <Avatar>
                <AvatarFallback className="md:text-lg">{initials}</AvatarFallback>
              </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link className="text-muted-foreground hover:text-black transition-colors duration-300" to="/dashboard">admin dashboard  <ArrowUpRight size={2}/></Link>
            </DropdownMenuItem> 
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default Header
