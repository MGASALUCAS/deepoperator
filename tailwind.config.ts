
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				
				// Enhanced Emotional Color System
				coral: {
					DEFAULT: 'hsl(var(--coral))',
					light: 'hsl(var(--coral-light))',
					dark: 'hsl(var(--coral-dark))',
					glow: 'hsl(var(--coral-glow))'
				},
				mint: {
					DEFAULT: 'hsl(var(--mint))',
					light: 'hsl(var(--mint-light))',
					dark: 'hsl(var(--mint-dark))',
					glow: 'hsl(var(--mint-glow))'
				},
				violet: {
					DEFAULT: 'hsl(var(--violet))',
					light: 'hsl(var(--violet-light))',
					dark: 'hsl(var(--violet-dark))',
					glow: 'hsl(var(--violet-glow))'
				},
				gold: {
					DEFAULT: 'hsl(var(--gold))',
					light: 'hsl(var(--gold-light))',
					dark: 'hsl(var(--gold-dark))',
					glow: 'hsl(var(--gold-glow))'
				},
				
				// Core System Colors
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				
				// Success, Warning, Error
				success: 'hsl(var(--success))',
				warning: 'hsl(var(--warning))',
				error: 'hsl(var(--error))',
				info: 'hsl(var(--info))',
				
				// Glass System
				glass: {
					bg: 'hsl(var(--glass-bg))',
					border: 'hsl(var(--glass-border))'
				}
			},
			fontFamily: {
				display: ['var(--font-display)', 'system-ui', 'sans-serif'],
				body: ['var(--font-body)', 'system-ui', 'sans-serif'],
				mono: ['var(--font-mono)', 'monospace']
			},
			spacing: {
				'xs': 'var(--space-xs)',
				'sm': 'var(--space-sm)', 
				'md': 'var(--space-md)',
				'lg': 'var(--space-lg)',
				'xl': 'var(--space-xl)',
				'2xl': 'var(--space-2xl)',
				'3xl': 'var(--space-3xl)'
			},
			boxShadow: {
				'soft': 'var(--shadow-soft)',
				'medium': 'var(--shadow-medium)',
				'strong': 'var(--shadow-strong)',
				'magical': 'var(--shadow-magical)'
			},
			transitionTimingFunction: {
				'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
				'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'elastic': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
