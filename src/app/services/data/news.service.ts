import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { SsdfYearsService } from './ssdf-years.service';
import { NewsArticleModel } from '../../models/news-article.model';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, first } from 'rxjs/operators';

@Injectable()
export class NewsService {
  private newsArticles$ = new BehaviorSubject<NewsArticleModel[]>([]);
  constructor(private af: AngularFireDatabase,
    private ssdfYearsService: SsdfYearsService) {
    this.ssdfYearsService.getSelectedSsdfYear()
      .pipe(switchMap(ssdfYear => {
        return this.af
          .list(`/${ssdfYear}/newsArticles`)
          .snapshotChanges().pipe(map(dbNewsArticles => ({ ssdfYear, dbNewsArticles })));
      }))
      .subscribe(({ ssdfYear, dbNewsArticles }) => {
        const outNewsArticles: NewsArticleModel[] = [];
        dbNewsArticles.forEach(dbNewsArticle => {
          const inDbArticle: any = dbNewsArticle.payload.val();
          const newsArticle: NewsArticleModel = {
            id: `/${ssdfYear}/newsArticles/${dbNewsArticle.key}`,
            imageUrl: inDbArticle.imageUrl || '',
            isPublished: !!inDbArticle.isPublished,
            postedOn: inDbArticle.postedOn || 0,
            text: inDbArticle.text || ''
          };
          outNewsArticles.push(newsArticle);
        });

        outNewsArticles.sort((left, right) => right.postedOn - left.postedOn);
        this.newsArticles$.next(outNewsArticles);
      });
  }

  getAll(): Observable<NewsArticleModel[]> {
    return this.newsArticles$;
  }

  publishNewsArticle(articleId: string) {
    this.af.object(`${articleId}/isPublished`).set(true);
    this.af.object(`${articleId}/postedOn`).set(new Date().getTime() / 1000 | 0);
  }

  deleteArticle(articleId: string): void {
    this.af.object(articleId).remove();
  }

  insertArticle(newArticle: NewsArticleModel): void {
    newArticle.postedOn = new Date().getTime() / 1000 | 0;
    newArticle.isPublished = false;
    this.ssdfYearsService.getSelectedSsdfYear().pipe(first())
    .subscribe(ssdfYear => this.af.list(`/${ssdfYear}/newsArticles`).push(newArticle));
  }

  updateArticle(newsArticle: NewsArticleModel): void {
    this.af.object(`${newsArticle.id}/imageUrl`).set(newsArticle.imageUrl);
    this.af.object(`${newsArticle.id}/text`).set(newsArticle.text);
  }
}
