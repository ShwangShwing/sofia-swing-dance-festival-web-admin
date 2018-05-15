import { Component, OnInit } from '@angular/core';

import { NewsService } from '../../services/data/news.service';
import { NewsArticleModel } from '../../models/news-article.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  newsArticles$: Observable<NewsArticleModel[]>;
  deleteArticleId: string;
  newEditArticleImageUrl: string;
  newEditArticleText: string;
  editArticleId = '';

  constructor(private newsService: NewsService) { }

  ngOnInit() {
    this.newsArticles$ = this.newsService.getAll();

    this.resetNewEdit();
  }

  publishArticle(articleId: string): void {
    this.newsService.publishNewsArticle(articleId);
  }

  setArticleForDeletion(id: string) {
    this.deleteArticleId = id;
  }

  deleteNewsArticle(): void {
    this.newsService.deleteArticle(this.deleteArticleId);
    this.deleteArticleId = null;
  }

  cancelNewsArticleDeletion(): void {
    this.deleteArticleId = null;
  }

  resetNewEdit(): void {
    this.newEditArticleImageUrl = '';
    this.newEditArticleText = '';
    this.editArticleId = '';
  }

  createNewArticle(): void {
    const newArticle: NewsArticleModel = {
      imageUrl: this.newEditArticleImageUrl,
      text: this.newEditArticleText
    };

    this.newsService.insertArticle(newArticle);

    this.resetNewEdit();
  }

  editArticle(editedArticle: NewsArticleModel): void {
    this.editArticleId = editedArticle.id;
    this.newEditArticleImageUrl = editedArticle.imageUrl;
    this.newEditArticleText = editedArticle.text;
  }

  updateArticle(): void {
    const newArticle: NewsArticleModel = {
      id: this.editArticleId,
      imageUrl: this.newEditArticleImageUrl,
      text: this.newEditArticleText
    };

    this.newsService.updateArticle(newArticle);

    this.resetNewEdit();
  }
}
