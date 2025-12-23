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
}
