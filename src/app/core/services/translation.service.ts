import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export interface Language {
  code: string;
  name: string;
  direction: 'ltr' | 'rtl';
}

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private currentLanguageSubject = new BehaviorSubject<Language>({
    code: 'en',
    name: 'English',
    direction: 'ltr',
  });

  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private availableLanguages: Language[] = [
    { code: 'en', name: 'English', direction: 'ltr' },
    { code: 'fr', name: 'Français', direction: 'ltr' },
    { code: 'de', name: 'Deutsch', direction: 'ltr' },
    { code: 'es', name: 'Español', direction: 'ltr' },
  ];

  constructor(
    @Inject(LOCALE_ID) private localeId: string,
    private translateService: TranslateService,
  ) {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    const savedLanguage = localStorage.getItem('preferred-language');
    const browserLanguage = navigator.language.split('-')[0];

    const languageToUse = savedLanguage || browserLanguage || 'en';
    const language =
      this.availableLanguages.find((lang) => lang.code === languageToUse) ||
      this.availableLanguages[0];

    this.currentLanguageSubject.next(language);
    this.translateService.use(language.code);
  }

  getAvailableLanguages(): Language[] {
    return this.availableLanguages;
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  setLanguage(languageCode: string): void {
    const language = this.availableLanguages.find((lang) => lang.code === languageCode);

    if (language) {
      localStorage.setItem('preferred-language', languageCode);
      this.currentLanguageSubject.next(language);
      this.translateService.use(languageCode);
    }
  }

  getTranslation(key: string, params?: any): string {
    return this.translateService.instant(key, params);
  }
}
