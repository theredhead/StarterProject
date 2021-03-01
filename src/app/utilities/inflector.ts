class Inflector {
  ucfirst(s: string): string {
    return s.substr(0, 1).toLocaleUpperCase() + s.substr(1);
  }
  pascalize(s: string): string {
    return s
      .split('_')
      .map((p) => this.ucfirst(p.toLocaleLowerCase()))
      .join('');
  }
}
export const inflector = new Inflector();
