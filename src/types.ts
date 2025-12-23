export interface Product {
    id: string;
    name_en: string;
    name_fr: string;
    desc_en: string;
    desc_fr: string;
    category: string;
    origin: string;
    price: number;
    season: string;
    moq: number;
    quantity: number;
    images?: string[];
    // Extended fields
    sku?: string | null;
    slug?: string;
    tags?: string[];
    isFeatured?: boolean;
    is_active?: boolean;
    createdAt?: string;
}
