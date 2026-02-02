import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { UserSpending } from '../models/user-spending';
import { Card } from '../models/card';

@Injectable({
  providedIn: 'root',
})
export class UserSpendingDataService {

  private baseUrl = 'http://localhost:3000/userSpending';

  constructor(private http: HttpClient) { }

  getUserSpendingSummary(): Observable<UserSpending> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(data => {
        interface CardData {
          name: string;
          spending: number;
          limit: number;
          imageUrl: string;
        }

        // Convert the 'cards' objects into an array of Card instances safely.
        const cards: Card[] = Object.entries(data.cards)
          .filter((entry): entry is [string, CardData] => {
            const [key, card_data] = entry;  // Destructure entry.
            return (
              typeof card_data === 'object' &&
              card_data !== null &&
              'name' in card_data &&
              'spending' in card_data
            );
          })
          .map(([key, card_data]) => new Card(key, card_data.name,
            card_data.spending, card_data.limit, card_data.imageUrl));

        return new UserSpending(
          data.spending_ytd,
          data.spending_month,
          data.misc_spending_month,
          cards
        );
      })
    );
  }
}
