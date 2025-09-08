import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  // VARIÁVEIS

  showAddMovieModal: boolean = false; // controle de exibição do modal de adição de filme
  searchQuery: string = ''; // controle de pesquisa de filmes
  displayedMovies: any[] = []; // filmes exibidos na tela
  movies = [ // lista de filmes
    {
      title: 'Ação',
      analysis: 'Filmes cheios de adrenalina e aventura.',
      photoPath: '../../../assets/imgs/acao.jpg',
      rating: 3
    },
    {
      title: 'Comédia',
      analysis: 'Para dar boas risadas com amigos e família.',
      photoPath: '../../../assets/imgs/comedia.jpg',
      rating: 5
    },
    {
      title: 'Drama',
      analysis: 'Histórias emocionantes que tocam o coração.',
      photoPath: '../../../assets/imgs/drama.jpg',
      rating: 1
    },
    {
      title: 'Terror',
      analysis: 'Filmes para quem gosta de sentir medo.',
      photoPath: '../../../assets/imgs/terror.jpg',
      rating: 4
    },
    {
      title: 'Ficção Científica',
      analysis: 'Filmes que exploram o futuro e o desconhecido.',
      photoPath: '../../../assets/imgs/ficcao.jpg',
      rating: 0
    }
  ];
  limit: number = 4; // 4 filmes no maximo por vez
  currentOffset: number = 0; // controle de visualização de filmes

  ngOnInit(){
    this.displayedMovies = this.movies.slice(this.currentOffset, this.currentOffset + this.limit); // exibe os 4 filmes iniciais
  }

  toggleAddMovieModal(){
    this.showAddMovieModal = !this.showAddMovieModal; // abre e fecha o modal
  }

  // 1) Utilitário de normalização (remove acentos e pontuação, deixa minúsculo)
  private normalizeText(s: string | undefined | null): string {
    return (s ?? '')
    .normalize('NFD')                    // separa acentos dos caracteres base
    .replace(/[\u0300-\u036f]/g, '')     // remove os acentos (combining marks)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')    // remove pontuação/sinais, mantém letras, números e espaço
    .replace(/\s+/g, ' ')                // normaliza espaços
    .trim();
  }


filterMovies(): void {
  const q = this.normalizeText(this.searchQuery);

  if (!q) {
    this.displayedMovies = this.movies.slice(this.currentOffset, this.currentOffset + this.limit);
    return;
  }

  // Filtra em cima de vários campos (ajuste conforme seu modelo)
  const filteredMovies = this.movies.filter(movie => {
    const title  = this.normalizeText(movie.title);
    const genre  = this.normalizeText((movie as any).genre);      // se existir
    const overview = this.normalizeText((movie as any).overview); // se existir

    return (
      title.includes(q) ||
      genre.includes(q) ||
      overview.includes(q)
    );
  });

  this.currentOffset = 0; // reinicia paginação
  this.displayedMovies = filteredMovies.slice(0, this.limit);
}


  // avançar no layout de filmes (4 por vez)
  showNext() {
    if (this.currentOffset + this.limit < this.movies.length) {
      this.currentOffset += this.limit;
      this.displayedMovies = this.movies.slice(this.currentOffset, this.currentOffset + this.limit);
    }
  }

  // voltar no layout de filmes (4 por vez)
  showPrevious() {
    if (this.currentOffset - this.limit >= 0) {
      this.currentOffset -= this.limit;
      this.displayedMovies = this.movies.slice(this.currentOffset, this.currentOffset + this.limit);
    }
  }
}

