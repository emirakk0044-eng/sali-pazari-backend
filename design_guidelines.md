{
  "project": {
    "name": "İstanbul Salı Pazarı AVM",
    "type": "hybrid_fullstack_public_storefront_plus_admin",
    "primary_language": "tr-TR",
    "brand_attributes": [
      "güven veren",
      "temiz ve düzenli",
      "modern ama yerel kimliği koruyan",
      "hızlı erişilebilir (mobil öncelikli)",
      "ürün odaklı (fotoğraf + fiyat + kategori)"
    ]
  },
  "visual_personality": {
    "style_fusion": {
      "layout_principle": "Swiss / editorial grid (net hiyerarşi, bol boşluk)",
      "surface_style": "soft-elevated cards (ince border + hafif shadow)",
      "accent_style": "botanical green highlights + micro-glow focus rings",
      "motion_style": "subtle slide/fade + hover lift (parallax sadece hero dekorunda)"
    },
    "do_not": [
      "Genel container'ı ortalama (text-align:center) yapma; sadece hero içindeki bazı öğeler ortalanabilir.",
      "Okunabilir alanlarda gradient kullanma; gradient sadece hero arka planında dekor olarak (viewport < %20).",
      "Küçük UI öğelerinde gradient kullanma (<100px).",
      "transition: all kullanma."
    ]
  },
  "design_tokens": {
    "css_variables": {
      "where": "/app/frontend/src/index.css (Tailwind base layer :root + .dark)",
      "notes": "Mevcut shadcn token yapısı var; shadcn kullanmasanız bile bu CSS vars ile Tailwind class'larınızı tutarlı yapın.",
      "light": {
        "--background": "0 0% 100%",
        "--foreground": "222 47% 11%",
        "--card": "0 0% 100%",
        "--card-foreground": "222 47% 11%",
        "--muted": "210 40% 96%",
        "--muted-foreground": "215 16% 47%",
        "--border": "214 32% 91%",
        "--input": "214 32% 91%",
        "--ring": "152 60% 35%",

        "--brand": "152 60% 35%",
        "--brand-2": "152 55% 28%",
        "--brand-soft": "152 45% 92%",
        "--brand-ink": "152 70% 18%",

        "--accent": "38 92% 50%",
        "--accent-soft": "38 90% 92%",

        "--danger": "0 72% 51%",
        "--warning": "38 92% 50%",
        "--success": "152 60% 35%",

        "--shadow-color": "222 47% 11%",
        "--radius-sm": "10px",
        "--radius-md": "14px",
        "--radius-lg": "18px"
      },
      "dark_admin": {
        "--admin-bg": "222 47% 7%",
        "--admin-surface": "222 35% 10%",
        "--admin-surface-2": "222 28% 13%",
        "--admin-text": "210 40% 98%",
        "--admin-muted": "215 20% 65%",
        "--admin-border": "222 20% 18%",
        "--admin-ring": "152 60% 45%"
      },
      "recommended_tailwind_mapping": {
        "brand_text": "text-[hsl(var(--brand))]",
        "brand_bg": "bg-[hsl(var(--brand))]",
        "brand_bg_hover": "hover:bg-[hsl(var(--brand-2))]",
        "brand_soft_bg": "bg-[hsl(var(--brand-soft))]",
        "ring": "focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        "card": "rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-white shadow-[0_10px_30px_-18px_hsl(var(--shadow-color)/0.25)]"
      }
    },
    "spacing": {
      "principle": "2–3x daha ferah: section padding yüksek, kart içi padding orta",
      "section_py": "py-14 sm:py-18 lg:py-24",
      "container": "mx-auto w-full max-w-6xl px-4 sm:px-6",
      "card_padding": "p-4 sm:p-5",
      "stack_gap": "gap-3 sm:gap-4"
    },
    "shadows": {
      "card": "shadow-[0_10px_30px_-18px_hsl(var(--shadow-color)/0.25)]",
      "hover_lift": "hover:shadow-[0_18px_50px_-24px_hsl(var(--shadow-color)/0.35)] hover:-translate-y-0.5",
      "focus": "focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
    },
    "radius": {
      "buttons": "rounded-xl",
      "cards": "rounded-[var(--radius-md)]",
      "chips_tabs": "rounded-full"
    }
  },
  "typography": {
    "fonts": {
      "heading": {
        "family": "Space Grotesk",
        "fallback": "ui-sans-serif, system-ui",
        "why": "Modern, geometrik; AVM/market hissine uygun, kurumsal ama sıcak"
      },
      "body": {
        "family": "Inter",
        "fallback": "ui-sans-serif, system-ui",
        "why": "Okunabilir, admin tablolarında net"
      },
      "mono_optional": {
        "family": "IBM Plex Mono",
        "use": "Admin'de SKU/ID alanları"
      },
      "google_fonts_import": "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');"
    },
    "scale": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight",
      "h2": "text-base md:text-lg text-slate-600",
      "section_title": "text-2xl sm:text-3xl font-semibold tracking-tight",
      "card_title": "text-base font-semibold",
      "body": "text-sm sm:text-base text-slate-700 leading-relaxed",
      "small": "text-xs text-slate-500"
    },
    "turkish_copy_tone": {
      "principles": [
        "Kısa, net, güven veren",
        "Yerel ifadeler: 'Bugün açık', 'Yol tarifi', 'WhatsApp'tan yaz'",
        "CTA'lar fiil ile başlasın: 'Ürünleri Gör', 'Konum Aç', 'Mesaj Gönder'"
      ]
    }
  },
  "layout": {
    "public_storefront": {
      "pattern": "single-page scroll (anchor nav) + sticky mini header",
      "grid": {
        "products": "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4",
        "categories": "grid grid-cols-2 sm:grid-cols-4 gap-3",
        "reviews": "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      },
      "header": {
        "style": "sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-[hsl(var(--border))]",
        "nav": "Logo left, anchor links (Kategoriler/Ürünler/Konum/Yorumlar/İletişim), right CTA: WhatsApp",
        "mobile": "hamburger -> slide-over menu"
      },
      "hero": {
        "structure": "Left: headline+slogan+CTAs, Right: hero image card + stats chips",
        "background": "solid white + very subtle decorative gradient blob behind image only (<=20% viewport)",
        "stats": "4 mini stat cards: Google puanı, yorum sayısı, kategori sayısı, bugün açık saat"
      },
      "info_bar": {
        "pattern": "3-4 inline info pills (Konum, Otopark, Ödeme, Açık Saat) with icons",
        "style": "bg-[hsl(var(--muted))] rounded-2xl p-3"
      },
      "map_hours": {
        "pattern": "Split: Map embed + Hours card; on mobile stack",
        "cta": "Yol tarifi (Google Maps link) + WhatsApp"
      },
      "contact": {
        "pattern": "Form left, quick contact cards right (Telefon, WhatsApp, Adres)",
        "whatsapp_redirect": "Form submit success -> show toast + WhatsApp deep link"
      },
      "whatsapp_fab": {
        "position": "fixed bottom-4 right-4",
        "size": "56px",
        "behavior": "hover: slight lift + shadow; on mobile: tap opens WhatsApp",
        "label": "Optional mini label on desktop: 'WhatsApp'"
      }
    },
    "admin_panel": {
      "pattern": "dark sidebar + light content area",
      "sidebar": {
        "style": "bg-[hsl(var(--admin-bg))] text-[hsl(var(--admin-text))] border-r border-[hsl(var(--admin-border))]",
        "active_item": "bg-[hsl(var(--admin-surface-2))] text-white ring-1 ring-[hsl(var(--admin-border))]",
        "icons": "lucide-react icons",
        "mobile": "sidebar becomes drawer"
      },
      "content": {
        "style": "bg-slate-50 min-h-screen",
        "topbar": "search (optional), user chip, quick actions"
      },
      "data_views": {
        "tables": "Products + Messages use table with sticky header, row hover",
        "forms": "Settings + Product editor use 2-column on desktop, 1-column on mobile"
      }
    }
  },
  "components": {
    "allowed_stack": {
      "primary": "Tailwind + custom components (NO shadcn required by user)",
      "note": "Repo'da shadcn ui mevcut; kullanmak isterseniz /src/components/ui içinden alınabilir ama zorunlu değil. HTML dropdown/calendar/toast yerine mevcut ui bileşenleri tercih edilebilir."
    },
    "component_inventory": {
      "public": [
        {
          "name": "StickyHeader",
          "description": "Logo + anchor nav + WhatsApp CTA",
          "data_testids": [
            "public-header",
            "public-nav-categories-link",
            "public-nav-products-link",
            "public-nav-map-link",
            "public-nav-reviews-link",
            "public-nav-contact-link",
            "public-header-whatsapp-button"
          ]
        },
        {
          "name": "Hero",
          "description": "Headline + slogan + stats + primary CTA",
          "data_testids": [
            "hero-section",
            "hero-primary-cta-button",
            "hero-secondary-cta-button",
            "hero-stat-google-rating",
            "hero-stat-review-count",
            "hero-stat-category-count",
            "hero-stat-open-hours"
          ]
        },
        {
          "name": "CategoryTabs",
          "description": "Horizontal scrollable tabs; active green pill",
          "data_testids": [
            "category-tabs",
            "category-tab-all",
            "category-tab-item"
          ]
        },
        {
          "name": "ProductCard",
          "description": "Image, name, price, category badge, WhatsApp quick action",
          "data_testids": [
            "product-card",
            "product-card-image",
            "product-card-title",
            "product-card-price",
            "product-card-whatsapp-button"
          ]
        },
        {
          "name": "Reviews",
          "description": "Grid or carousel; rating stars + short quote",
          "data_testids": [
            "reviews-section",
            "review-card"
          ]
        },
        {
          "name": "ContactForm",
          "description": "Name, phone, message; submit -> toast",
          "data_testids": [
            "contact-form",
            "contact-form-name-input",
            "contact-form-phone-input",
            "contact-form-message-textarea",
            "contact-form-submit-button",
            "contact-form-success-message",
            "contact-form-error-message"
          ]
        },
        {
          "name": "WhatsAppFAB",
          "description": "Floating action button",
          "data_testids": [
            "whatsapp-fab"
          ]
        }
      ],
      "admin": [
        {
          "name": "AdminLogin",
          "description": "Centered card on subtle background; brand green focus ring",
          "data_testids": [
            "admin-login-page",
            "admin-login-username-input",
            "admin-login-password-input",
            "admin-login-submit-button",
            "admin-login-error-message"
          ]
        },
        {
          "name": "AdminSidebar",
          "description": "Dark sidebar with nav items",
          "data_testids": [
            "admin-sidebar",
            "admin-nav-dashboard",
            "admin-nav-products",
            "admin-nav-messages",
            "admin-nav-settings",
            "admin-logout-button"
          ]
        },
        {
          "name": "KpiCards",
          "description": "Dashboard KPI cards (Ürün sayısı, okunmamış mesaj, son güncelleme)",
          "data_testids": [
            "admin-kpi-cards",
            "admin-kpi-products",
            "admin-kpi-unread-messages"
          ]
        },
        {
          "name": "ProductsTable",
          "description": "Table + filters + add product button",
          "data_testids": [
            "admin-products-page",
            "admin-products-add-button",
            "admin-products-search-input",
            "admin-products-table",
            "admin-product-row",
            "admin-product-edit-button",
            "admin-product-delete-button"
          ]
        },
        {
          "name": "ProductEditor",
          "description": "Add/Edit form with image upload preview",
          "data_testids": [
            "admin-product-editor",
            "admin-product-name-input",
            "admin-product-price-input",
            "admin-product-category-select",
            "admin-product-image-input",
            "admin-product-save-button",
            "admin-product-cancel-button"
          ]
        },
        {
          "name": "MessagesInbox",
          "description": "List + detail drawer",
          "data_testids": [
            "admin-messages-page",
            "admin-messages-list",
            "admin-message-row",
            "admin-message-detail",
            "admin-message-mark-read-button"
          ]
        },
        {
          "name": "SettingsForm",
          "description": "WhatsApp number, store info, hours",
          "data_testids": [
            "admin-settings-page",
            "admin-settings-whatsapp-input",
            "admin-settings-store-name-input",
            "admin-settings-hours-input",
            "admin-settings-save-button",
            "admin-settings-success-message"
          ]
        }
      ]
    },
    "optional_shadcn_component_paths_if_used": {
      "tabs": "/app/frontend/src/components/ui/tabs.jsx",
      "table": "/app/frontend/src/components/ui/table.jsx",
      "dialog": "/app/frontend/src/components/ui/dialog.jsx",
      "sheet_drawer": "/app/frontend/src/components/ui/sheet.jsx or /drawer.jsx",
      "sonner_toast": "/app/frontend/src/components/ui/sonner.jsx",
      "input": "/app/frontend/src/components/ui/input.jsx",
      "textarea": "/app/frontend/src/components/ui/textarea.jsx",
      "button": "/app/frontend/src/components/ui/button.jsx",
      "select": "/app/frontend/src/components/ui/select.jsx"
    }
  },
  "color_usage_rules": {
    "priority": [
      "White backgrounds for reading/content",
      "Muted gray surfaces for section separation",
      "Green accents for actions + active states",
      "Dark admin sidebar only (not public reading areas)"
    ],
    "gradients": {
      "restriction": "Follow GRADIENT RESTRICTION RULE from system prompt.",
      "allowed_example": "Hero decorative blob only: radial-gradient(closest-side, rgba(16,185,129,0.18), rgba(255,255,255,0))",
      "never": [
        "purple/pink combos",
        "dark saturated gradients",
        "gradients behind long text"
      ]
    }
  },
  "micro_interactions": {
    "buttons": {
      "base": "transition-colors duration-200",
      "hover": "hover:-translate-y-0.5 hover:shadow-md (apply only on primary CTA)",
      "active": "active:translate-y-0 active:scale-[0.99]",
      "focus": "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
    },
    "cards": {
      "hover": "hover:-translate-y-0.5 hover:border-[hsl(var(--brand)/0.35)]",
      "image": "group-hover:scale-[1.03] transition-transform duration-300"
    },
    "tabs": {
      "interaction": "Horizontal scroll on mobile; active pill animates with translate/opacity (Framer Motion optional)"
    },
    "scroll": {
      "section_reveal": "Use IntersectionObserver to add 'opacity-0 translate-y-2' -> 'opacity-100 translate-y-0' (respect prefers-reduced-motion)"
    },
    "whatsapp_fab": {
      "hover": "shadow grows + slight lift",
      "pulse": "Optional subtle pulse ring every 8s (disable on prefers-reduced-motion)"
    }
  },
  "accessibility": {
    "requirements": [
      "WCAG AA contrast: green text on white only for large text or use darker green (--brand-2) for body-sized text.",
      "All inputs must have visible labels (not placeholder-only).",
      "Focus states must be visible (ring).",
      "Touch targets >= 44px (FAB, tabs, buttons).",
      "prefers-reduced-motion: disable parallax/pulse/reveal animations."
    ]
  },
  "libraries": {
    "recommended": [
      {
        "name": "lucide-react",
        "why": "Modern icon set for nav, info pills, admin sidebar",
        "install": "npm i lucide-react",
        "usage": "import { MapPin, Clock, MessageCircle } from 'lucide-react'"
      },
      {
        "name": "framer-motion (optional)",
        "why": "Hero stats entrance + tab indicator animation",
        "install": "npm i framer-motion",
        "usage": "import { motion } from 'framer-motion'"
      },
      {
        "name": "sonner (optional)",
        "why": "Clean toasts for contact form + admin saves",
        "install": "npm i sonner",
        "usage": "import { toast } from 'sonner'"
      }
    ]
  },
  "image_urls": {
    "hero": [
      {
        "url": "https://images.pexels.com/photos/7314570/pexels-photo-7314570.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "description": "Hero sağ taraf: modern AVM/escalator görseli (yerel, modern his)"
      },
      {
        "url": "https://images.pexels.com/photos/19287629/pexels-photo-19287629.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "description": "Alternatif hero: atrium + cam asansör (ferah, premium)"
      }
    ],
    "categories_or_section_breaks": [
      {
        "url": "https://images.pexels.com/photos/18117320/pexels-photo-18117320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "description": "Kategoriler/Ürünler üstü: pazar tezgahı (tazelik, yerel pazar kimliği)"
      }
    ],
    "ambient_optional": [
      {
        "url": "https://images.pexels.com/photos/37148752/pexels-photo-37148752.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "description": "Reviews/Contact arası küçük ambient görsel (minimal kahve detayı)"
      }
    ]
  },
  "page_level_blueprints": {
    "public_home": {
      "sections_order": [
        "Hero",
        "InfoBar",
        "Categories",
        "Products Grid + CategoryTabs",
        "Map + Hours",
        "Customer Reviews",
        "Contact Form",
        "Footer",
        "WhatsApp FAB"
      ],
      "cta_strategy": {
        "primary": "WhatsApp'tan Yaz",
        "secondary": "Ürünleri Gör (scroll to products)",
        "trust": "Hero stats + reviews"
      }
    },
    "admin_login": {
      "layout": "Centered card; left optional brand panel on desktop",
      "copy": {
        "title": "Yönetim Girişi",
        "subtitle": "Ürünleri ve mesajları yönetmek için giriş yapın"
      }
    },
    "admin_dashboard": {
      "widgets": [
        "KPI cards",
        "Son eklenen ürünler (mini table)",
        "Son mesajlar (list)",
        "Hızlı aksiyon: Ürün Ekle"
      ]
    },
    "admin_products": {
      "must_have": [
        "Search",
        "Category filter",
        "Add product modal/page",
        "Image upload preview",
        "Delete confirm dialog"
      ]
    },
    "admin_messages": {
      "must_have": [
        "Unread badge",
        "Detail drawer",
        "Mark as read",
        "Quick WhatsApp reply (optional)"
      ]
    },
    "admin_settings": {
      "fields": [
        "WhatsApp numarası",
        "AVM adı",
        "Adres",
        "Çalışma saatleri",
        "Google Maps link"
      ]
    }
  },
  "implementation_notes_for_main_agent": {
    "instructions_to_main_agent": [
      "React dosyaları .js olacak (tsx değil).",
      "Public sayfa: tek sayfa scroll + anchor linkler; her section'a id ver (categories, products, map, reviews, contact).",
      "Kategori tabları mobilde yatay kaydırılabilir olmalı (overflow-x-auto, scrollbar-hide opsiyonel).",
      "Ürün kartlarında görsel oranını koru (aspect-[4/3] veya aspect-square) ve backend /uploads URL'lerini destekle.",
      "Admin: dark sidebar + light content; mobilde sidebar drawer.",
      "Tüm butonlar, inputlar, tablar, tablo aksiyonları ve kritik metinler data-testid içermeli (kebab-case).",
      "Toast için sonner kullanacaksanız: global Toaster'ı App root'a ekleyin; aksi halde minimal inline success/error state.",
      "App.css içindeki default CRA stillerini kaldırın; global stil index.css + Tailwind ile yönetilsin."
    ]
  }
}

<General UI UX Design Guidelines>  
    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms
    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text
   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json

 **GRADIENT RESTRICTION RULE**
NEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc
NEVER use dark gradients for logo, testimonial, footer etc
NEVER let gradients cover more than 20% of the viewport.
NEVER apply gradients to text-heavy content or reading areas.
NEVER use gradients on small UI elements (<100px width).
NEVER stack multiple gradient layers in the same viewport.

**ENFORCEMENT RULE:**
    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors

**How and where to use:**
   • Section backgrounds (not content backgrounds)
   • Hero section header content. Eg: dark to light to dark color
   • Decorative overlays and accent elements only
   • Hero section with 2-3 mild color
   • Gradients creation can be done for any angle say horizontal, vertical or diagonal

- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**

</Font Guidelines>

- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. 
   
- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.

- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.
   
- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly
    Eg: - if it implies playful/energetic, choose a colorful scheme
           - if it implies monochrome/minimal, choose a black–white/neutral scheme

**Component Reuse:**
	- Prioritize using pre-existing components from src/components/ui when applicable
	- Create new components that match the style and conventions of existing components when needed
	- Examine existing components to understand the project's component patterns before creating new ones

**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component

**Best Practices:**
	- Use Shadcn/UI as the primary component library for consistency and accessibility
	- Import path: ./components/[component-name]

**Export Conventions:**
	- Components MUST use named exports (export const ComponentName = ...)
	- Pages MUST use default exports (export default function PageName() {...})

**Toasts:**
  - Use `sonner` for toasts"
  - Sonner component are located in `/app/src/components/ui/sonner.tsx`

Use 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.
</General UI UX Design Guidelines>
