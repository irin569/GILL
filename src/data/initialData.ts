import { Product, GameKey, User, Coupon, Order, Review, SupportTicket, AuditLog, NotificationItem, StoreSettings } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-cp2077',
    sku: 'GS-STEAM-CP2077',
    name: 'Cyberpunk 2077: Phantom Liberty Bundle',
    slug: 'cyberpunk-2077-phantom-liberty-bundle',
    tagline: 'ผจญภัยใน Night City พร้อมเนื้อเรื่องเสริมสายลับสุดระทึก',
    description: 'Cyberpunk 2077 คือเกมแนวแอ็กชันผจญภัย RPG แบบโลกเปิดในอนาคตอันมืดมนของ Night City มหานครแห่งอำนาจ ความเย้ายวน และการดัดแปลงร่างกาย สวมบทบาทเป็น V ทหารรับจ้างไซเบอร์พังก์ พร้อมส่วนเสริม Phantom Liberty นำแสดงโดย Idris Elba!',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Bundle',
    platform: 'Steam',
    region: 'Global',
    genre: ['Action', 'RPG', 'Open World'],
    price: 1399,
    originalPrice: 2190,
    discountPercent: 36,
    cost: 1100,
    isFeatured: true,
    isBestSeller: true,
    isFlashSale: true,
    flashSaleEndsAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    rating: 4.9,
    reviewCount: 142,
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i7-6700 / AMD Ryzen 5 1600',
        memory: '12 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580',
        storage: '70 GB SSD'
      },
      recommended: {
        os: 'Windows 11 64-bit',
        processor: 'Intel Core i7-12700 / AMD Ryzen 7 7800X',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce RTX 3070 / AMD Radeon RX 6800 XT',
        storage: '70 GB NVMe SSD'
      }
    },
    tags: ['Cyberpunk', 'Ray Tracing', 'Story Rich', 'Sci-Fi'],
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'prod-elden-ring',
    sku: 'GS-STEAM-ELDEN-SOTE',
    name: 'ELDEN RING: Shadow of the Erdtree Edition',
    slug: 'elden-ring-shadow-of-the-erdtree',
    tagline: 'มหากาพย์เกมแห่งปีจาก FromSoftware พร้อม DLC แดนเงาทมิฬ',
    description: 'ก้าวเข้าสู่ดินแดนแห่งเงา (Realm of Shadow) และเปิดเผยความลี้ลับของ Miquella ในภาคเสริมที่ได้รับรางวัลระดับโลก สัมผัสความท้าทาย บอสใหม่ อาวุธ และคาถาอันตระการตา',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Game Key',
    platform: 'Steam',
    region: 'TH/Asia',
    genre: ['RPG', 'Action', 'Open World'],
    price: 1790,
    originalPrice: 2390,
    discountPercent: 25,
    cost: 1500,
    isFeatured: true,
    isBestSeller: true,
    isFlashSale: false,
    rating: 4.95,
    reviewCount: 388,
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5-8400 / AMD Ryzen 3 3300X',
        memory: '12 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1060 3 GB / AMD Radeon RX 580',
        storage: '60 GB Available Space'
      },
      recommended: {
        os: 'Windows 11 64-bit',
        processor: 'Intel Core i7-8700K / AMD Ryzen 5 3600X',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1070 8 GB / AMD Radeon RX Vega 56',
        storage: '60 GB SSD'
      }
    },
    tags: ['Souls-like', 'Masterpiece', 'Dark Fantasy', 'Challenging'],
    createdAt: '2026-01-12T10:00:00Z'
  },
  {
    id: 'prod-wukong',
    sku: 'GS-STEAM-WUKONG',
    name: 'Black Myth: Wukong',
    slug: 'black-myth-wukong',
    tagline: 'มหากาพย์ไซอิ๋วแอ็กชัน RPG กราฟิกระดับ Unreal Engine 5 สมจริงขั้นสุด',
    description: 'คุณจะได้ออกเดินทางในฐานะผู้ถูกลิขิต เพื่อผจญภัยไปตามรอยตำนานไซอิ๋ว ค้นพบความจริงอันน่าทึ่งที่ซ่อนอยู่เบื้องหลังตำนานโบราณ ต่อสู้กับเหล่าปีศาจด้วยกระบองวิเศษและวิชาแปลงกาย 72 ท่า',
    coverImage: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Game Key',
    platform: 'Steam',
    region: 'Global',
    genre: ['Action', 'RPG', 'Adventure'],
    price: 1599,
    originalPrice: 1899,
    discountPercent: 15,
    cost: 1350,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.88,
    reviewCount: 290,
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Core i5-8400 / Ryzen 5 1600',
        memory: '16 GB RAM',
        graphics: 'GeForce GTX 1060 6GB / RX 580 8GB',
        storage: '130 GB SSD'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Core i7-9700 / Ryzen 5 5500',
        memory: '16 GB RAM',
        graphics: 'GeForce RTX 2060 / RX 5700 XT',
        storage: '130 GB SSD'
      }
    },
    tags: ['Mythology', 'Martial Arts', 'Great Soundtrack', 'UE5'],
    createdAt: '2026-02-01T10:00:00Z'
  },
  {
    id: 'prod-gow-ragnarok',
    sku: 'GS-PS-GOW-RAGNAROK',
    name: 'God of War Ragnarök (PC/Steam Edition)',
    slug: 'god-of-war-ragnarok',
    tagline: 'การผจญภัยครั้งสุดท้ายของ Kratos และ Atreus ในดินแดน 9 ภพเทพนอร์ส',
    description: 'ร่วมเดินทางสู่มหาศึกแร็กนาร็อก Kratos และ Atreus ต้องออกเดินทางลึกเข้าไปในอาณาจักรทั้งเก้าเพื่อหาคำตอบ ขณะที่กองกำลังแห่งแอสการ์ดเตรียมพร้อมทำสงคราม',
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Game Key',
    platform: 'PlayStation',
    region: 'TH/Asia',
    genre: ['Action', 'Adventure', 'RPG'],
    price: 1690,
    originalPrice: 1990,
    discountPercent: 15,
    cost: 1450,
    isFeatured: true,
    isNewArrival: false,
    rating: 4.9,
    reviewCount: 165,
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel i5-6600k / AMD Ryzen 5 2400 G',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GTX 1060 (6 GB) / AMD RX 570 (4 GB)',
        storage: '190 GB SSD'
      },
      recommended: {
        os: 'Windows 10 64-bit',
        processor: 'Intel i7-7700k / AMD Ryzen 7 2700X',
        memory: '16 GB RAM',
        graphics: 'NVIDIA RTX 2060 Super / AMD RX 5700',
        storage: '190 GB SSD'
      }
    },
    tags: ['Story Rich', 'Nordic', 'Cinematic', 'Violent'],
    createdAt: '2026-02-10T10:00:00Z'
  },
  {
    id: 'prod-fc25',
    sku: 'GS-EA-FC25',
    name: 'EA SPORTS FC 25 Standard Edition',
    slug: 'ea-sports-fc-25',
    tagline: 'สัมผัสประสบการณ์ลูกหนังระดับโลกด้วยระบบ Rush 5v5 และ FC IQ',
    description: 'EA SPORTS FC 25 มอบวิธีเล่นและคว้าชัยชนะเพื่อสโมสรมากยิ่งขึ้น ร่วมทีมใน Rush แบบ 5 ต่อ 5 โหมดใหม่ และปฏิวัติแท็กติกด้วย FC IQ เพื่อสร้างแผนการเล่นที่สมจริงกว่าที่เคย',
    coverImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Game Key',
    platform: 'Epic Games',
    region: 'Global',
    genre: ['Sports', 'Action'],
    price: 1450,
    originalPrice: 2299,
    discountPercent: 37,
    cost: 1200,
    isFlashSale: true,
    flashSaleEndsAt: new Date(Date.now() + 86400000).toISOString(),
    rating: 4.4,
    reviewCount: 92,
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5-6600K / AMD Ryzen 5 1600',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GTX 1050 Ti 4GB / AMD RX 570 4GB',
        storage: '100 GB'
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i7-6700 / AMD Ryzen 7 2700X',
        memory: '12 GB RAM',
        graphics: 'NVIDIA GTX 1660 / AMD RX 5600 XT',
        storage: '100 GB SSD'
      }
    },
    tags: ['Football', 'Multiplayer', 'Competitive', 'Sports'],
    createdAt: '2026-02-15T10:00:00Z'
  },
  {
    id: 'prod-mh-wilds',
    sku: 'GS-STEAM-MH-WILDS',
    name: 'Monster Hunter Wilds',
    slug: 'monster-hunter-wilds',
    tagline: 'ยุคใหม่แห่งการล่าในโลกกว้างที่มีชีวิตชีวาและแปรเปลี่ยนตลอดเวลา',
    description: 'โลกที่สภาพแวดล้อมมีการเปลี่ยนแปลงอย่างรุนแรงและฉับพลัน นำมาซึ่งความดุร้ายของเหล่ามอนสเตอร์และโอกาสในการล่าที่ไร้ขีดจำกัด เตรียมอาวุธคู่ใจของคุณให้พร้อมในดินแดนต้องห้าม!',
    coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Game Key',
    platform: 'Steam',
    region: 'Global',
    genre: ['Action', 'RPG', 'Open World'],
    price: 1990,
    originalPrice: 2290,
    discountPercent: 13,
    cost: 1750,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.92,
    reviewCount: 310,
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5-10600 / AMD Ryzen 5 3600',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1660 Super / AMD Radeon RX 5600 XT',
        storage: '140 GB SSD'
      },
      recommended: {
        os: 'Windows 11 64-bit',
        processor: 'Intel Core i5-11600K / AMD Ryzen 5 5600X',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce RTX 2070 Super / AMD Radeon RX 6700 XT',
        storage: '140 GB SSD'
      }
    },
    tags: ['Hunting', 'Co-op', 'Monsters', 'Open World'],
    createdAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'prod-steam-thb-1000',
    sku: 'GS-GIFT-STEAM-1000',
    name: 'Steam Wallet Card ฿1,000 THB (Thai Baht)',
    slug: 'steam-wallet-card-1000-thb',
    tagline: 'บัตรเติมเงิน Steam Wallet รหัสแท้ เติมเข้าทันที 1,000 บาท',
    description: 'บัตรของขวัญ Steam Wallet มูลค่า 1,000 บาท สำหรับใช้ซื้อเกม ไอเทม และเนื้อหาดาวน์โหลดบนแพลตฟอร์ม Steam สำหรับไอดีไทย (TH Store) รหัสส่งทันทีหลังชำระเงิน',
    coverImage: 'https://images.unsplash.com/photo-1612287232230-e17f73d81dbe?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1612287232230-e17f73d81dbe?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Gift Card',
    platform: 'Steam',
    region: 'TH/Asia',
    genre: ['Sports'],
    price: 980,
    originalPrice: 1000,
    discountPercent: 2,
    cost: 950,
    isBestSeller: true,
    rating: 4.99,
    reviewCount: 520,
    tags: ['Gift Card', 'Steam Wallet', 'Instant', 'Auto Delivery'],
    createdAt: '2026-01-01T10:00:00Z'
  },
  {
    id: 'prod-psn-thb-1000',
    sku: 'GS-GIFT-PSN-1000',
    name: 'PlayStation Network Card ฿1,000 (TH Store)',
    slug: 'playstation-network-card-1000-thb',
    tagline: 'บัตรเติมเงิน PSN ประเทศไทย 1,000 บาท สำหรับ PS4 และ PS5',
    description: 'รหัสเติมเงิน PlayStation Network สำหรับบัญชีประเทศไทย (Thai PSN) ใช้ซื้อเกม แพ็คเสริม หรือสมัคร PlayStation Plus ได้ง่ายๆ ส่งรหัสอัตโนมัติ 24 ชม.',
    coverImage: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Gift Card',
    platform: 'PlayStation',
    region: 'TH/Asia',
    genre: ['Adventure'],
    price: 990,
    originalPrice: 1000,
    discountPercent: 1,
    cost: 960,
    rating: 4.97,
    reviewCount: 215,
    tags: ['PlayStation', 'PSN', 'Instant', 'Gift Card'],
    createdAt: '2026-01-05T10:00:00Z'
  },
  {
    id: 'prod-zelda-totk',
    sku: 'GS-NIN-ZELDA-TOTK',
    name: 'The Legend of Zelda: Tears of the Kingdom (Digital Code)',
    slug: 'zelda-tears-of-the-kingdom',
    tagline: 'สุดยอดการผจญภัยเหนือน่านฟ้าและใต้พิภพดินแดนไฮรูล',
    description: 'สานต่อการผจญภัยอันน่าอัศจรรย์ของ Link ด้วยพลังใหม่ที่ช่วยให้คุณสร้างสรรค์สิ่งประดิษฐ์ พาหนะ และอาวุธได้อย่างอิสระไร้ขอบเขตบน Nintendo Switch',
    coverImage: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Game Key',
    platform: 'Nintendo',
    region: 'Global',
    genre: ['Adventure', 'Open World', 'Action'],
    price: 1790,
    originalPrice: 2090,
    discountPercent: 14,
    cost: 1550,
    rating: 4.98,
    reviewCount: 198,
    tags: ['Zelda', 'Nintendo', 'GOTY', 'Masterpiece'],
    createdAt: '2026-01-08T10:00:00Z'
  },
  {
    id: 'prod-xbox-gamepass',
    sku: 'GS-XBOX-GPU-3M',
    name: 'Xbox Game Pass Ultimate - 3 Months Subscription',
    slug: 'xbox-game-pass-ultimate-3-months',
    tagline: 'เล่นเกมมากกว่า 100 เกมบน PC และ Xbox พร้อม EA Play',
    description: 'รหัสเติมสมาชิก Xbox Game Pass Ultimate ระยะเวลา 3 เดือน เล่นเกมฟอร์มยักษ์ตั้งแต่วันแรกที่วางจำหน่าย ทั้งบน PC, Xbox Console และ Cloud Gaming',
    coverImage: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Game Top-up',
    platform: 'Xbox',
    region: 'Global',
    genre: ['Action', 'RPG', 'Sports'],
    price: 890,
    originalPrice: 1190,
    discountPercent: 25,
    cost: 720,
    rating: 4.91,
    reviewCount: 140,
    tags: ['Subscription', 'Game Pass', 'Cloud Gaming', 'Xbox'],
    createdAt: '2026-01-14T10:00:00Z'
  },
  {
    id: 'prod-valorant-points',
    sku: 'GS-TOPUP-VAL-2400',
    name: 'Valorant Points 2,400 VP (TH Riot PIN)',
    slug: 'valorant-points-2400-vp',
    tagline: 'รหัสเติมพ้อยท์ Valorant เซิร์ฟเวอร์ไทย ซื้อสกินและ Battlepass ได้ทันที',
    description: 'เติม VP เพื่อปลดล็อกสกินปืนสุดเท่ มีดพรีเมียม และ Radiant Entertainment System รหัส Riot PIN ใช้เติมเข้าไอดีโซนไทยได้โดยตรง สะดวก ปลอดภัย',
    coverImage: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Game Top-up',
    platform: 'PC',
    region: 'TH/Asia',
    genre: ['Shooter'],
    price: 680,
    originalPrice: 750,
    discountPercent: 9,
    cost: 620,
    isBestSeller: true,
    rating: 4.93,
    reviewCount: 420,
    tags: ['Riot', 'Valorant', 'FPS', 'Top-up'],
    createdAt: '2026-01-20T10:00:00Z'
  },
  {
    id: 'prod-gta-v-ce',
    sku: 'GS-PC-GTAV-PREMIUM',
    name: 'Grand Theft Auto V: Premium Online Edition',
    slug: 'grand-theft-auto-v-premium',
    tagline: 'เกมระดับตำนานพร้อมชุด Criminal Enterprise Starter Pack 1,000,000 GTA$',
    description: 'สัมผัสการผจญภัยของ Michael, Franklin และ Trevor ใน Los Santos พร้อมสิทธิ์เข้าสู่โลกของ GTA Online และโบนัสเงินสด 1,000,000 GTA$ ในเกม',
    coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'Game Key',
    platform: 'Epic Games',
    region: 'Global',
    genre: ['Action', 'Open World', 'Shooter'],
    price: 499,
    originalPrice: 999,
    discountPercent: 50,
    cost: 390,
    isFlashSale: true,
    flashSaleEndsAt: new Date(Date.now() + 86400000 * 3).toISOString(),
    rating: 4.85,
    reviewCount: 680,
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64 Bit',
        processor: 'Intel Core 2 Quad CPU Q6600 @ 2.40GHz',
        memory: '4 GB RAM',
        graphics: 'NVIDIA 9800 GT 1GB / AMD HD 4870 1GB',
        storage: '72 GB space'
      },
      recommended: {
        os: 'Windows 10/11 64 Bit',
        processor: 'Intel Core i5 3470 @ 3.2GHz / AMD X8 FX-8350 @ 4GHz',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GTX 660 2GB / AMD HD 7870 2GB',
        storage: '72 GB SSD'
      }
    },
    tags: ['Rockstar', 'GTA', 'Open World', 'Crime'],
    createdAt: '2026-01-02T10:00:00Z'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-superadmin',
    name: 'Somchai (Super Admin)',
    email: 'superadmin@gamestore.local',
    role: 'super_admin',
    phone: '081-999-8888',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    walletBalance: 25000,
    points: 1250,
    emailVerified: true,
    createdAt: '2025-12-01T00:00:00Z',
    lastLogin: '2026-09-27T22:45:00Z'
  },
  {
    id: 'user-staff',
    name: 'Nattapong (Store Staff)',
    email: 'staff@gamestore.local',
    role: 'staff',
    phone: '089-777-6666',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    walletBalance: 2000,
    points: 150,
    emailVerified: true,
    createdAt: '2026-01-05T00:00:00Z',
    lastLogin: '2026-09-27T21:10:00Z'
  },
  {
    id: 'user-vip',
    name: 'Thanakorn Gamer (VIP)',
    email: 'vip@gamestore.local',
    role: 'customer',
    phone: '086-123-4567',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    walletBalance: 4500,
    points: 620,
    emailVerified: true,
    createdAt: '2026-01-15T00:00:00Z',
    lastLogin: '2026-09-27T20:30:00Z'
  },
  {
    id: 'user-regular',
    name: 'Krittin Pro',
    email: 'user@gamestore.local',
    role: 'customer',
    phone: '082-345-6789',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    walletBalance: 850,
    points: 85,
    emailVerified: true,
    createdAt: '2026-02-01T00:00:00Z',
    lastLogin: '2026-09-27T19:00:00Z'
  }
];

export const INITIAL_GAME_KEYS: GameKey[] = [
  // CP2077
  { id: 'key-cp-1', productId: 'prod-cp2077', productName: 'Cyberpunk 2077: Phantom Liberty Bundle', keyString: 'CP77-BNDL-9X42-TR99', status: 'available', createdAt: '2026-01-10T10:00:00Z' },
  { id: 'key-cp-2', productId: 'prod-cp2077', productName: 'Cyberpunk 2077: Phantom Liberty Bundle', keyString: 'CP77-BNDL-3K11-ML87', status: 'available', createdAt: '2026-01-10T10:00:00Z' },
  { id: 'key-cp-3', productId: 'prod-cp2077', productName: 'Cyberpunk 2077: Phantom Liberty Bundle', keyString: 'CP77-BNDL-8H67-QA23', status: 'available', createdAt: '2026-01-10T10:00:00Z' },
  // Elden Ring
  { id: 'key-er-1', productId: 'prod-elden-ring', productName: 'ELDEN RING: Shadow of the Erdtree Edition', keyString: 'ERST-ELDN-4F22-KP90', status: 'available', createdAt: '2026-01-12T10:00:00Z' },
  { id: 'key-er-2', productId: 'prod-elden-ring', productName: 'ELDEN RING: Shadow of the Erdtree Edition', keyString: 'ERST-ELDN-7Y65-NM41', status: 'available', createdAt: '2026-01-12T10:00:00Z' },
  // Wukong
  { id: 'key-wk-1', productId: 'prod-wukong', productName: 'Black Myth: Wukong', keyString: 'BMWK-DEST-55M2-QW89', status: 'available', createdAt: '2026-02-01T10:00:00Z' },
  { id: 'key-wk-2', productId: 'prod-wukong', productName: 'Black Myth: Wukong', keyString: 'BMWK-DEST-88P3-LK12', status: 'available', createdAt: '2026-02-01T10:00:00Z' },
  // God of War
  { id: 'key-gw-1', productId: 'prod-gow-ragnarok', productName: 'God of War Ragnarök', keyString: 'GOWR-PSPC-11A9-ZX44', status: 'available', createdAt: '2026-02-10T10:00:00Z' },
  { id: 'key-gw-2', productId: 'prod-gow-ragnarok', productName: 'God of War Ragnarök', keyString: 'GOWR-PSPC-22B8-CV55', status: 'available', createdAt: '2026-02-10T10:00:00Z' },
  // FC 25
  { id: 'key-fc-1', productId: 'prod-fc25', productName: 'EA SPORTS FC 25 Standard Edition', keyString: 'FC25-EAPC-99Q7-PL33', status: 'available', createdAt: '2026-02-15T10:00:00Z' },
  { id: 'key-fc-2', productId: 'prod-fc25', productName: 'EA SPORTS FC 25 Standard Edition', keyString: 'FC25-EAPC-44R6-TY22', status: 'available', createdAt: '2026-02-15T10:00:00Z' },
  // MH Wilds
  { id: 'key-mh-1', productId: 'prod-mh-wilds', productName: 'Monster Hunter Wilds', keyString: 'MHWL-CAPC-77X3-BN99', status: 'available', createdAt: '2026-03-01T10:00:00Z' },
  { id: 'key-mh-2', productId: 'prod-mh-wilds', productName: 'Monster Hunter Wilds', keyString: 'MHWL-CAPC-33Z2-GH77', status: 'available', createdAt: '2026-03-01T10:00:00Z' },
  // Steam 1000
  { id: 'key-st-1', productId: 'prod-steam-thb-1000', productName: 'Steam Wallet Card ฿1,000 THB', keyString: 'STMW-TH10-9821-4455', status: 'available', createdAt: '2026-01-01T10:00:00Z' },
  { id: 'key-st-2', productId: 'prod-steam-thb-1000', productName: 'Steam Wallet Card ฿1,000 THB', keyString: 'STMW-TH10-7712-3321', status: 'available', createdAt: '2026-01-01T10:00:00Z' },
  // PSN 1000
  { id: 'key-ps-1', productId: 'prod-psn-thb-1000', productName: 'PlayStation Network Card ฿1,000', keyString: 'PSNT-H100-3344-9988', status: 'available', createdAt: '2026-01-05T10:00:00Z' },
  // Zelda
  { id: 'key-zd-1', productId: 'prod-zelda-totk', productName: 'The Legend of Zelda: Tears of the Kingdom', keyString: 'NINT-TOTK-8812-4400', status: 'available', createdAt: '2026-01-08T10:00:00Z' },
  // Xbox
  { id: 'key-xb-1', productId: 'prod-xbox-gamepass', productName: 'Xbox Game Pass Ultimate - 3 Months', keyString: 'XBOX-GPU3-5566-7788', status: 'available', createdAt: '2026-01-14T10:00:00Z' },
  // Valorant
  { id: 'key-vl-1', productId: 'prod-valorant-points', productName: 'Valorant Points 2,400 VP', keyString: 'RIOT-VALP-2400-9911', status: 'available', createdAt: '2026-01-20T10:00:00Z' },
  // GTA V
  { id: 'key-gt-1', productId: 'prod-gta-v-ce', productName: 'Grand Theft Auto V: Premium Online Edition', keyString: 'GTAV-EPIC-7744-1122', status: 'available', createdAt: '2026-01-02T10:00:00Z' },
  // Sold Key (sample)
  {
    id: 'key-sold-sample-1',
    productId: 'prod-cp2077',
    productName: 'Cyberpunk 2077: Phantom Liberty Bundle',
    keyString: 'CP77-BNDL-HIST-8822',
    status: 'sold',
    orderId: 'ORD-2026-001',
    soldToUserId: 'user-vip',
    soldAt: '2026-03-20T14:32:00Z',
    createdAt: '2026-01-10T10:00:00Z'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'GAME2026',
    description: 'ลดทันที 20% สำหรับยอดสั่งซื้อตั้งแต่ ฿500 ขึ้นไป',
    discountType: 'percentage',
    discountValue: 20,
    minSpend: 500,
    maxDiscount: 400,
    usageLimit: 200,
    usedCount: 43,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
    applicableCategory: 'All'
  },
  {
    id: 'coup-2',
    code: 'WELCOME10',
    description: 'ต้อนรับลูกค้าใหม่ ลด 10% ไม่มีขั้นต่ำ (สูงสุด ฿200)',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 0,
    maxDiscount: 200,
    usageLimit: 500,
    usedCount: 112,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
    applicableCategory: 'All'
  },
  {
    id: 'coup-3',
    code: 'FLASH50',
    description: 'ส่วนลดเงินสด ฿50 เมื่อช้อปครบ ฿300',
    discountType: 'fixed',
    discountValue: 50,
    minSpend: 300,
    usageLimit: 100,
    usedCount: 88,
    startDate: '2026-03-01',
    endDate: '2026-04-30',
    isActive: true,
    applicableCategory: 'All'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2026-001',
    userId: 'user-vip',
    customerName: 'Thanakorn Gamer (VIP)',
    customerEmail: 'vip@gamestore.local',
    customerPhone: '086-123-4567',
    items: [
      {
        productId: 'prod-cp2077',
        productName: 'Cyberpunk 2077: Phantom Liberty Bundle',
        coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
        platform: 'Steam',
        price: 1399,
        originalPrice: 2190,
        quantity: 1,
        deliveredKeys: ['CP77-BNDL-HIST-8822']
      }
    ],
    subtotal: 1399,
    discountAmount: 200,
    couponCode: 'WELCOME10',
    fee: 0,
    total: 1199,
    status: 'Delivered',
    paymentMethod: 'PromptPay',
    paymentStatus: 'Paid',
    transactionRef: 'TXN-PP-994821',
    digitalDeliveryStatus: 'Delivered',
    paidAt: '2026-03-20T14:32:00Z',
    deliveredAt: '2026-03-20T14:32:05Z',
    createdAt: '2026-03-20T14:30:00Z'
  },
  {
    id: 'ORD-2026-002',
    userId: 'user-regular',
    customerName: 'Krittin Pro',
    customerEmail: 'user@gamestore.local',
    customerPhone: '082-345-6789',
    items: [
      {
        productId: 'prod-steam-thb-1000',
        productName: 'Steam Wallet Card ฿1,000 THB',
        coverImage: 'https://images.unsplash.com/photo-1612287232230-e17f73d81dbe?auto=format&fit=crop&w=400&q=80',
        platform: 'Steam',
        price: 980,
        originalPrice: 1000,
        quantity: 1,
        deliveredKeys: ['STMW-TH10-9821-4455']
      }
    ],
    subtotal: 980,
    discountAmount: 50,
    couponCode: 'FLASH50',
    fee: 0,
    total: 930,
    status: 'Delivered',
    paymentMethod: 'CreditCard',
    paymentStatus: 'Paid',
    transactionRef: 'TXN-CC-842109',
    digitalDeliveryStatus: 'Delivered',
    paidAt: '2026-03-25T11:15:00Z',
    deliveredAt: '2026-03-25T11:15:08Z',
    createdAt: '2026-03-25T11:14:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-cp2077',
    userId: 'user-vip',
    userName: 'Thanakorn Gamer',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    comment: 'ร้านนี้ส่งคีย์ไวมากครับ จ่ายผ่าน PromptPay ปุ๊บ คีย์เด้งเข้าทันที นำไป Activate บน Steam ได้ 100% เล่นภาค Phantom Liberty สนุกมาก!',
    isVerifiedPurchase: true,
    createdAt: '2026-03-21T09:00:00Z',
    status: 'published'
  },
  {
    id: 'rev-2',
    productId: 'prod-elden-ring',
    userId: 'user-regular',
    userName: 'Krittin Pro',
    rating: 5,
    comment: 'ซื้อ Shadow of the Erdtree ราคาถูกกว่าหน้าสโตร์ตรงเยอะเลย บริการดีเยี่ยม มีระบบหลังบ้านบันทึกคีย์ไว้ให้กลับมาดูได้ตลอดเวลา',
    isVerifiedPurchase: true,
    createdAt: '2026-03-22T16:20:00Z',
    status: 'published'
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-1001',
    userId: 'user-vip',
    userName: 'Thanakorn Gamer',
    userEmail: 'vip@gamestore.local',
    subject: 'สอบถามวิธีการเปิดใช้งานคีย์บนแพลตฟอร์ม Epic Games',
    category: 'Technical',
    status: 'Answered',
    priority: 'Medium',
    createdAt: '2026-03-24T10:00:00Z',
    updatedAt: '2026-03-24T10:15:00Z',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        senderName: 'Thanakorn Gamer',
        message: 'สวัสดีครับ เพิ่งซื้อเกมของ Epic Games ไป ไม่ทราบว่านำคีย์ไปกรอกตรงไหนของ Epic Games Launcher ครับ?',
        timestamp: '2026-03-24T10:00:00Z'
      },
      {
        id: 'msg-2',
        sender: 'staff',
        senderName: 'Nattapong (Staff)',
        message: 'สวัสดีครับ สามารถเปิด Epic Games Launcher จากนั้นคลิกที่รูปโปรไฟล์มุมขวาบน แล้วเลือกเมนู "Redeem Code" (แลกรับรหัส) แล้วนำคีย์ไปวางได้ทันทีครับผม',
        timestamp: '2026-03-24T10:15:00Z'
      }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'user-superadmin',
    userName: 'Somchai (Super Admin)',
    role: 'super_admin',
    action: 'Initial Store Setup',
    target: 'Store System',
    ip: '192.168.1.1',
    timestamp: '2026-03-20T08:00:00Z'
  },
  {
    id: 'log-2',
    userId: 'user-staff',
    userName: 'Nattapong (Store Staff)',
    role: 'staff',
    action: 'Import Game Keys',
    target: 'Cyberpunk 2077 (3 keys)',
    ip: '192.168.1.25',
    timestamp: '2026-03-20T10:30:00Z'
  },
  {
    id: 'log-3',
    userId: 'user-superadmin',
    userName: 'Somchai (Super Admin)',
    role: 'super_admin',
    action: 'Create Coupon',
    target: 'GAME2026',
    ip: '192.168.1.1',
    timestamp: '2026-03-20T11:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    targetRole: 'admin',
    title: 'มีคำสั่งซื้อใหม่ #ORD-2026-002',
    message: 'ลูกค้า Krittin Pro ชำระเงินเรียบร้อย ฿930 ผ่านบัตรเครดิต',
    type: 'order',
    isRead: false,
    timestamp: '2026-03-25T11:15:00Z'
  },
  {
    id: 'notif-2',
    targetRole: 'admin',
    title: 'การแจ้งเตือนคลังสินค้า',
    message: 'เกม The Legend of Zelda: Tears of the Kingdom เหลือน้อยกว่า 2 คีย์',
    type: 'stock',
    isRead: false,
    timestamp: '2026-03-26T09:00:00Z'
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'GAME STORE',
  contactEmail: 'support@gamestore.local',
  contactPhone: '02-888-9999',
  enablePromptPay: true,
  enableCreditCard: true,
  enableBankTransfer: true,
  enableWallet: true,
  lowStockThreshold: 3,
  pointsRate: 100, // 1 point per 100 THB spent
  autoDeliverKeys: true,
  dashboardConfig: {
    dailyTarget: 25000,
    monthlyTarget: 500000,
    dashboardNotice: '📢 สัปดาห์นี้แคมเปญ Flash Sale ขายดีเป็นพิเศษ! ทีมงานอย่าลืมเติมคีย์ Steam และ Monster Hunter Wilds ให้เพียงพอกับยอดสั่งซื้อ',
    showNotice: true,
    accentTheme: 'amber',
    visibleWidgets: {
      todaySales: true,
      totalRevenue: true,
      ordersCount: true,
      keysAvailable: true,
      totalProducts: true,
      totalCustomers: true,
      lowStockAlert: true,
      autoDeliveryRate: true,
      salesChart: true,
      platformShare: true,
      recentOrdersTable: true,
      lowStockTable: true,
    },
    cardOverrides: {},
    customCards: [
      {
        id: 'cust-1',
        title: 'ยอดผู้เข้าชมวันนี้ (Visitors)',
        value: '3,840 คน',
        changeText: '+24.8% สัปดาห์นี้',
        isPositive: true,
        color: 'purple',
        subtitle: 'จากแคมเปญ Google & Facebook Ads'
      },
      {
        id: 'cust-2',
        title: 'กำไรขั้นต้นประมาณการ (Est. Profit)',
        value: '฿38,450',
        changeText: '+18.2% อัตรากำไร 28%',
        isPositive: true,
        color: 'emerald',
        subtitle: 'คำนวณหลังหักต้นทุนคีย์'
      }
    ],
    weeklySalesData: [
      { day: 'จ.', val: 4200, pct: 45 },
      { day: 'อ.', val: 6800, pct: 65 },
      { day: 'พ.', val: 5100, pct: 52 },
      { day: 'พฤ.', val: 7900, pct: 78 },
      { day: 'ศ.', val: 12400, pct: 95 },
      { day: 'ส.', val: 11200, pct: 88 },
      { day: 'อา.', val: 10800, pct: 82 },
    ],
    platformShareData: [
      { platform: 'Steam Keys', percent: 52, color: 'bg-sky-500' },
      { platform: 'Epic Games', percent: 22, color: 'bg-purple-500' },
      { platform: 'PlayStation / PSN', percent: 14, color: 'bg-blue-500' },
      { platform: 'Xbox & Nintendo', percent: 12, color: 'bg-emerald-500' },
    ],
    adminNotes: [
      { id: 'note-1', text: 'ตรวจสอบคีย์ Elden Ring ล็อตใหม่จากผู้จัดจำหน่าย', completed: true, createdAt: '2026-03-26T10:00:00Z' },
      { id: 'note-2', text: 'เตรียมโค้ดส่วนลดสงกรานต์ SONGKRAN2026 ลด 25%', completed: false, createdAt: '2026-03-27T08:30:00Z' },
      { id: 'note-3', text: 'ตรวจทานรีวิวลูกค้าที่แจ้งขอคำแนะนำการเติมบัตร PSN', completed: false, createdAt: '2026-03-27T14:15:00Z' }
    ]
  }
};

export const STORE_FAQS = [
  {
    q: 'ซื้อคีย์เกมแล้วได้รับสินค้าอย่างไร?',
    a: 'ระบบของ GAME STORE เป็นระบบส่งอัตโนมัติ (Digital Auto-Delivery) เมื่อการชำระเงินเสร็จสมบูรณ์ รหัส Game Key จะปรากฏทันทีบนหน้าจอ และถูกบันทึกไว้ในเมนู "My Account > Game Keys" ของคุณ'
  },
  {
    q: 'Game Key สามารถนำไปใช้กับบัญชีโซนไหนได้บ้าง?',
    a: 'แต่ละสินค้าจะระบุ Region อย่างชัดเจน เช่น Global (เปิดใช้งานได้ทั่วโลก) หรือ TH/Asia (สำหรับไอดีไทยและเอเชีย) กรุณาตรวจสอบ Region ของสินค้าก่อนกดสั่งซื้อ'
  },
  {
    q: 'รองรับช่องทางชำระเงินใดบ้าง?',
    a: 'รองรับสแกน QR Code PromptPay ฟรีค่าธรรมเนียม, บัตรเครดิต/เดบิต (Visa, Mastercard), โอนเงินผ่านธนาคาร และ Digital Wallet ยอดนิยม'
  },
  {
    q: 'หากคีย์มีปัญหา หรือใช้งานไม่ได้ ทำอย่างไร?',
    a: 'สามารถติดต่อฝ่ายดูแลลูกค้าผ่านระบบ Support Tickets ได้ตลอด 24 ชั่วโมง โดยแนบภาพหน้าจอข้อความ Error และ Order ID ทีมงานจะตรวจสอบและดูแลเปลี่ยนคีย์ใหม่หรือคืนเงินตามนโยบายรับประกัน'
  },
  {
    q: 'GAME STORE เป็นตัวแทนจำหน่ายอย่างเป็นทางการหรือไม่?',
    a: 'GAME STORE จำหน่าย Digital License & Game Key ถูกต้องตามกฎหมาย โดยจัดหาผ่านผู้จัดจำหน่ายที่ได้รับอนุญาตทั่วโลก ทั้งนี้เราไม่ได้อ้างสิทธิ์เป็นตัวแทนโดยตรงของเจ้าของเครื่องหมายการค้าใดๆ เว้นแต่จะได้รับอนุญาตอย่างชัดเจน'
  }
];
