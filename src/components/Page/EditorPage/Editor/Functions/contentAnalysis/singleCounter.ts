export default class SingleCounter {
  private count: number;

  constructor() {
    this.count = 0;
  }

  clear() {
    this.count = 0;
  }

  countUp() {
    return ++this.count;
  }
}
