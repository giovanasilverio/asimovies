export interface MovieInterface {
    name: string;
    analisys: string;
    rating: number;
    photo_path: string; 
    photo_url?: string; // URL da imagem no Firebase Storage 
    id: string;
}