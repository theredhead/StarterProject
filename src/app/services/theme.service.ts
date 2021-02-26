import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';

const DARK_MODE_CSS_CLASS = 'dark';
const LIGHT_MODE_CSS_CLASS = 'light';
const THEME_STORAGE_KEY = `${environment.product.name}-dark-theme`;

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private body!: HTMLElement;
  private readonly themeClasses = [];

  get isDarkMode(): boolean {
    return this.body.classList.contains(DARK_MODE_CSS_CLASS);
  }

  get isLightMode(): boolean {
    return !this.isDarkMode;
  }

  constructor(private localStorageService: LocalStorageService) {
    const body = document.getElementsByTagName('body').item(0);
    if (!body) {
      throw new Error('Unable to get body element.');
    }
    this.body = body;
    this.restoreThemeFromStorage();
  }

  toggle(): void {
    if (this.isDarkMode) {
      this.setLightMode();
    } else {
      this.setDarkMode();
    }
  }
  setDarkMode(): void {
    this.clearThemeClasses();
    this.localStorageService.set(THEME_STORAGE_KEY, true);
    this.body.classList.add(DARK_MODE_CSS_CLASS);
  }

  setLightMode(): void {
    this.clearThemeClasses();
    this.localStorageService.set(THEME_STORAGE_KEY, false);
    this.body.classList.add(LIGHT_MODE_CSS_CLASS);
  }

  restoreThemeFromStorage(): void {
    const dark = this.localStorageService.get(THEME_STORAGE_KEY, false);
    if (dark) {
      this.setDarkMode();
    } else {
      this.setLightMode();
    }
  }

  private clearThemeClasses(): void {
    this.body.classList.remove(LIGHT_MODE_CSS_CLASS, DARK_MODE_CSS_CLASS);
  }
}
