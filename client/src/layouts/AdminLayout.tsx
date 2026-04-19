import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import { LayoutDashboard, Book, PenTool, Tag, MessageSquare, LogOut, Menu, X, Moon, Sun } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { useState } from "react"
// import logo from "../assets/logo.png"
export default function AdminLayout() {
	const location = useLocation()
	const navigate = useNavigate()
	const { user, logout } = useAuth()
	const { isDark, toggleTheme } = useTheme()
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	const navItems = [
		{ name: "Dashboard", path: "/admin", icon: LayoutDashboard },
		{ name: "Library", path: "/admin/library", icon: Book },
		{ name: "New Post", path: "/admin/posts/new", icon: PenTool },
		{ name: "Categories", path: "/admin/categories", icon: Tag },
		{ name: "Moderation", path: "/admin/moderation", icon: MessageSquare },
	]

	return (
		<div className="min-h-screen bg-white dark:bg-background-dark flex flex-col">
			{/* Admin Top Navigation */}
			<header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark sticky top-0 z-50">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
					<div className="flex items-center gap-6">
						<Link
							to="/"
							className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
							<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg">
								R
							</div>
							RoboBlogs
						</Link>

						{/* <Link to="/" className="flex items-center gap-2">
							<img src={logo} alt="RoboBlogs" className="h-14 w-14" />
						</Link> */}
						<nav
							aria-label="Admin Navigation"
							className="hidden lg:flex items-center gap-1 text-sm font-medium">
							{navItems.map((item) => {
								const isActive = location.pathname === item.path
								const Icon = item.icon
								return (
									<Link
										key={item.path}
										to={item.path}
										className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
											isActive
												? "bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm"
												: "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50"
										}`}>
										<Icon className="w-4 h-4" />
										{item.name}
									</Link>
								)
							})}
						</nav>
					</div>

					<div className="flex items-center gap-4">
						<div className="text-right hidden sm:block border-r border-gray-100 dark:border-gray-800 pr-4 mr-1">
							<p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
								{user?.name}
							</p>
							<p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
								{user?.role === "admin" ? "Chief Editor" : "Author"}
							</p>
						</div>

						<button
							onClick={toggleTheme}
							className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
							title={isDark ? "Switch to light mode" : "Switch to dark mode"}
							aria-label="Toggle Theme">
							{isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
						</button>

						<button
							onClick={() => {
								logout()
								navigate("/login")
							}}
							className="p-2 text-gray-400 hover:text-error transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
							title="Logout"
							aria-label="Logout">
							<LogOut className="w-5 h-5" />
						</button>

						<div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm">
							<img
								src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
								alt="Admin avatar"
								className="w-full h-full object-cover"
							/>
						</div>

						<button
							className="lg:hidden p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
							onClick={() => setIsMobileMenuOpen(true)}
							aria-label="Open mobile menu"
							aria-expanded={isMobileMenuOpen}>
							<Menu className="w-5 h-5" />
						</button>
					</div>
				</div>
			</header>

			{/* Mobile Drawer Overlay */}
			<div
				className={`fixed inset-0 z-[60] lg:hidden transition-all duration-300 ease-in-out ${
					isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
				}`}>
				{/* Backdrop */}
				<div
					className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
						isMobileMenuOpen ? "opacity-100" : "opacity-0"
					}`}
					onClick={() => setIsMobileMenuOpen(false)}
				/>

				{/* Sliding Panel */}
				<div
					className={`relative flex w-full max-w-xs flex-col overflow-y-auto bg-white dark:bg-background-dark pb-12 shadow-xl h-full transition-transform duration-300 ease-in-out ${
						isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
					}`}>
					<div className="flex px-4 pb-2 pt-5 justify-between items-center border-b border-gray-100 dark:border-gray-800">
						<Link
							to="/"
							className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
							<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg">
								R
							</div>
							RoboBlogs
						</Link>
						<button
							type="button"
							className="-m-2 p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
							onClick={() => setIsMobileMenuOpen(false)}>
							<X className="h-6 w-6" aria-hidden="true" />
						</button>
					</div>

					<nav aria-label="Mobile Admin Navigation" className="space-y-1 px-4 py-6">
						{navItems.map((item) => {
							const isActive = location.pathname === item.path
							const Icon = item.icon
							return (
								<Link
									key={item.path}
									to={item.path}
									onClick={() => setIsMobileMenuOpen(false)}
									className={`block px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
										isActive
											? "bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400 font-medium"
											: "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50"
									}`}>
									<Icon className="w-5 h-5" aria-hidden="true" />
									{item.name}
								</Link>
							)
						})}
					</nav>

					<div className="mt-auto border-t border-gray-100 dark:border-gray-800 p-4">
						<button
							onClick={() => {
								setIsMobileMenuOpen(false)
								logout()
								navigate("/login")
							}}
							className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors font-medium">
							<LogOut className="w-5 h-5" />
							Logout
						</button>
					</div>
				</div>
			</div>

			{/* Main Workspace */}
			<main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
				<Outlet />
			</main>

			{/* Footer */}
			<footer className="w-full mt-auto py-6 text-xs text-gray-400">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
					<div>
						<p className="font-bold text-gray-900 dark:text-white">RoboBlogs</p>
						<p>The future of intelligent storytelling.</p>
					</div>
					<div className="flex gap-6">
						<a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
							Privacy Policy
						</a>
						<a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
							Terms of Service
						</a>
						<a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
							Contact
						</a>
					</div>
					<p>&copy; {new Date().getFullYear()} RoboBlogs. All rights reserved.</p>
				</div>
			</footer>
		</div>
	)
}
