import i18n  from '@/utils/i18n';

export enum ThemeMode {
  System = 'system',
  Light = 'light',
  Dark = 'dark',
}

export const ThemeOptions = [
  {
    label: i18n.t("options.theme_system"),
    value: ThemeMode.System
  },
  {
    label: i18n.t("options.theme_light"),
    value: ThemeMode.Light
  },
  {
    label: i18n.t("options.theme_dark"),
    value: ThemeMode.Dark
  },
]