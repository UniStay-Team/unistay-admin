import { Injectable, effect, signal } from '@angular/core';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

// Палитра повторяет фирменные цвета Flutter-клиента (unistay-app: lib/widgets.dart, lib/main.dart):
// ink #173D36, accent #2F6B55, фон #F7F7F0, граница #E3E6DC.
export const UniStayPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f1f7f4',
      100: '#dcece4',
      200: '#bbd9ca',
      300: '#8fbfa8',
      400: '#5f9f83',
      500: '#3f8268',
      600: '#2f6b55',
      700: '#285746',
      800: '#22473a',
      900: '#173d36',
      950: '#0f211b',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#f7f7f0',
          100: '#eef0e8',
          200: '#e3e6dc',
          300: '#cdd2c4',
          400: '#a8ae9f',
          500: '#757b6d',
          600: '#5c6255',
          700: '#3f453b',
          800: '#2c3029',
          900: '#1d201b',
          950: '#121410',
        },
        primary: {
          color: '{primary.600}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.700}',
          activeColor: '{primary.800}',
        },
        highlight: {
          background: '{primary.50}',
          focusBackground: '{primary.100}',
          color: '{primary.800}',
          focusColor: '{primary.900}',
        },
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '#f3f5f1',
          100: '#dde2da',
          200: '#c0c8bd',
          300: '#9aa596',
          400: '#76826f',
          500: '#5a6555',
          600: '#444d40',
          700: '#323a30',
          800: '#242b23',
          900: '#18201b',
          950: '#0e1411',
        },
        primary: {
          color: '{primary.400}',
          contrastColor: '{surface.950}',
          hoverColor: '{primary.300}',
          activeColor: '{primary.200}',
        },
        highlight: {
          background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
          focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
      },
    },
  },
});

export const DARK_MODE_CLASS = 'app-dark';
const STORAGE_KEY = 'unistay-admin-theme';

// Светлая тема по умолчанию: лучше читается на проекторе. Выбор хранится только в этом браузере.
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly dark = signal(readStoredDark());

  constructor() {
    effect(() => {
      const dark = this.dark();
      document.documentElement.classList.toggle(DARK_MODE_CLASS, dark);
      try {
        localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
      } catch {
        // Хранилище может быть недоступно (приватный режим); тема всё равно переключается.
      }
    });
  }

  toggle(): void {
    this.dark.update((value) => !value);
  }
}

function readStoredDark(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dark';
  } catch {
    return false;
  }
}
