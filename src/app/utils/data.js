export const products = [
    {
        id: 1,
        name: "Клубничное сердце",
        description: "8 крупных ягод клубники в бельгийском молочном шоколаде с золотым декором",
        price: 450000,
        image: "/images/data/1.webp",
        category: "classic",
        weight: "320г",
        strawberries: 8,
        inStock: true,
        popular: true
    },
    {
        id: 2,
        name: "Золотая коллекция",
        description: "12 ягод клубники в темном шоколаде с съедобным золотом и фисташковой крошкой",
        price: 650000,
        image: "/images/data/2.jpg",
        category: "premium",
        weight: "450г",
        strawberries: 12,
        inStock: true,
        popular: true
    },
    {
        id: 3,
        name: "Романтический ужин",
        description: "6 клубничных сердец в розовом шоколаде с шампанским внутри",
        price: 380000,
        image: "/images/data/3.png",
        category: "romantic",
        weight: "280г",
        strawberries: 6,
        inStock: true,
        popular: false
    },
    {
        id: 4,
        name: "Семейный бокс",
        description: "16 ягод ассорти: молочный, темный и белый шоколад",
        price: 890000,
        image: "/images/data/4.jpg",
        category: "family",
        weight: "600г",
        strawberries: 16,
        inStock: true,
        popular: true
    },
    {
        id: 5,
        name: "Мини-бокс",
        description: "4 отборные ягоды в молочном шоколаде с кокосовой стружкой",
        price: 190000,
        image: "/images/data/5.jpg",
        category: "mini",
        weight: "150г",
        strawberries: 4,
        inStock: true,
        popular: false
    },
    {
        id: 6,
        name: "Премиум ассорти",
        description: "10 ягод: 5 с бельгийским шоколадом, 5 с итальянским трюфелем",
        price: 750000,
        image: "/images/data/6.webp",
        category: "premium",
        weight: "400г",
        strawberries: 10,
        inStock: true,
        popular: false
    },
    {
        id: 7,
        name: "Свадебный бокс",
        description: "24 ягоды в белом шоколаде с жемчужным декором",
        price: 1290000,
        image: "/images/data/7.jpg",
        category: "premium",
        weight: "950г",
        strawberries: 24,
        inStock: false,
        popular: false
    },
    {
        id: 8,
        name: "Шоколадная феерия",
        description: "8 ягод в темном шоколаде с карамелью и морской солью",
        price: 520000,
        image: "/images/data/8.jpg",
        category: "classic",
        weight: "340г",
        strawberries: 8,
        inStock: true,
        popular: true
    },
    {
        id: 9,
        name: "Фруктовый микс",
        description: "6 клубничных ягод и 6 трюфелей ручной работы",
        price: 580000,
        image: "/images/data/9.jpg",
        category: "mix",
        weight: "420г",
        strawberries: 6,
        inStock: true,
        popular: false
    },
    {
        id: 10,
        name: "Императорский бокс",
        description: "15 ягод премиум-класса с 24-каратным золотом",
        price: 1500000,
        image: "/images/data/10.avif",
        category: "luxury",
        weight: "550г",
        strawberries: 15,
        inStock: true,
        popular: true
    }
];

export const categories = [
    { id: "all", name: "Все боксы" },
    { id: "classic", name: "Классические" },
    { id: "premium", name: "Премиум" },
    { id: "romantic", name: "Романтические" },
    { id: "family", name: "Семейные" },
    { id: "luxury", name: "Luxury" }
];

export const getProductById = (id) => {
    return products.find(product => product.id === id);
};

export const getPopularProducts = () => {
    return products.filter(product => product.popular);
};