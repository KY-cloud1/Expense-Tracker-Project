export class Card {
  constructor(
    public key: string,
    public name: string,
    public spending: number,
    public limit: number,
    public imageUrl: string
  ) {}
}
