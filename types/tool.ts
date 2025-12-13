import { User } from "./user";

export interface Tool {
    id: string;
    name: string;
    price: number;
    owner: {
        id: string;
        username: string;
        avatar: string;
    };
    description: string;
    specifications: {
        [key: string]: string;
    };
    rentalConditions: string;
    images: string[];
}

