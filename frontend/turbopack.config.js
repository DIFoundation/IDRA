export default {
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
	},
	experimental: {
		persistentCache: true,
		partialReload: true,
		reactRefresh: true,
	},
	optimize: {
		prebundle: ["react", "react-dom", "next", "framer-motion", "tailwindcss", "lucide-react"],
	},
	server: {
		port: process.env.PORT || 3000,
	},
}
