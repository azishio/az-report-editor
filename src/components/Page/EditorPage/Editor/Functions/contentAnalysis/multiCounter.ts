export default class MultiCounter {
  private readonly count;

  private readonly length;

  private update: boolean;

  constructor(num: number) {
    this.length = num;
    this.count = Array.from({ length: num }, () => 0);
    this.update = false;
  }

  clear() {
    if (this.update) {
      this.update = false;

      for (let i = 0; i < this.length; i++) {
        this.count[i] = 0;
      }
    }
  }

  countUp(index: number) {
    this.update = true;

    this.count[index]++;

    for (let i = index + 1; i < this.length; i++) {
      this.count[i] = 0;
    }
  }

  getUpTo(index: number) {
    return this.count.slice(0, index + 1);
  }

  getTo(index: number) {
    return this.count[index];
  }
}
