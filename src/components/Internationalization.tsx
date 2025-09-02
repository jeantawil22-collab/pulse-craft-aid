import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

interface Translation {
  [key: string]: string | Translation;
}

interface Translations {
  [locale: string]: Translation;
}

interface InternationalizationContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatNumber: (value: number) => string;
  formatDate: (date: Date) => string;
  supportedLocales: LocaleInfo[];
  isRTL: boolean;
}

interface LocaleInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

const InternationalizationContext = createContext<InternationalizationContextType | undefined>(undefined);

const supportedLocales: LocaleInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' }
];

const translations: Translations = {
  en: {
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      submit: 'Submit',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Logout',
      login: 'Login',
      signup: 'Sign Up',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      name: 'Name',
      age: 'Age',
      height: 'Height',
      weight: 'Weight',
      date: 'Date',
      time: 'Time',
      calories: 'Calories',
      protein: 'Protein',
      carbs: 'Carbs',
      fat: 'Fat',
      fiber: 'Fiber'
    },
    navigation: {
      dashboard: 'Dashboard',
      workouts: 'Workouts',
      nutrition: 'Nutrition',
      progress: 'Progress',
      mealScanner: 'Meal Scanner',
      profile: 'Profile'
    },
    fitness: {
      workoutCompleted: 'Workout completed!',
      exerciseStarted: 'Exercise started',
      restTime: 'Rest time',
      nextExercise: 'Next exercise',
      workoutPaused: 'Workout paused',
      workoutResumed: 'Workout resumed',
      intensity: 'Intensity',
      duration: 'Duration',
      reps: 'Reps',
      sets: 'Sets',
      beginnerLevel: 'Beginner',
      intermediateLevel: 'Intermediate',
      advancedLevel: 'Advanced'
    },
    nutrition: {
      mealLogged: 'Meal logged successfully',
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      snack: 'Snack',
      mealScore: 'Meal Score',
      nutritionGoals: 'Nutrition Goals',
      dailyCalories: 'Daily Calories',
      macroBreakdown: 'Macro Breakdown',
      waterIntake: 'Water Intake'
    },
    achievements: {
      levelUp: 'Level up! You reached level {level}',
      pointsEarned: 'You earned {points} points!',
      streakMaintained: 'Streak maintained for {days} days',
      challengeCompleted: 'Challenge completed!',
      dailyGoalReached: 'Daily goal reached!',
      weeklyGoalReached: 'Weekly goal reached!'
    },
    errors: {
      genericError: 'Something went wrong. Please try again.',
      networkError: 'Network error. Please check your connection.',
      authenticationError: 'Authentication failed. Please log in again.',
      validationError: 'Please check your input and try again.',
      fileUploadError: 'Failed to upload file. Please try again.',
      cameraError: 'Failed to access camera. Please check permissions.'
    },
    units: {
      kg: 'kg',
      lbs: 'lbs',
      cm: 'cm',
      ft: 'ft',
      in: 'in',
      kcal: 'kcal',
      g: 'g',
      ml: 'ml',
      oz: 'oz',
      min: 'min',
      sec: 'sec',
      bpm: 'bpm'
    }
  },
  es: {
    common: {
      loading: 'Cargando...',
      save: 'Guardar',
      cancel: 'Cancelar',
      submit: 'Enviar',
      back: 'Atrás',
      next: 'Siguiente',
      previous: 'Anterior',
      delete: 'Eliminar',
      edit: 'Editar',
      search: 'Buscar',
      settings: 'Configuración',
      profile: 'Perfil',
      logout: 'Cerrar sesión',
      login: 'Iniciar sesión',
      signup: 'Registrarse',
      email: 'Correo electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña',
      name: 'Nombre',
      age: 'Edad',
      height: 'Altura',
      weight: 'Peso',
      date: 'Fecha',
      time: 'Tiempo',
      calories: 'Calorías',
      protein: 'Proteína',
      carbs: 'Carbohidratos',
      fat: 'Grasa',
      fiber: 'Fibra'
    },
    navigation: {
      dashboard: 'Panel',
      workouts: 'Entrenamientos',
      nutrition: 'Nutrición',
      progress: 'Progreso',
      mealScanner: 'Escáner de comidas',
      profile: 'Perfil'
    },
    fitness: {
      workoutCompleted: '¡Entrenamiento completado!',
      exerciseStarted: 'Ejercicio iniciado',
      restTime: 'Tiempo de descanso',
      nextExercise: 'Siguiente ejercicio',
      workoutPaused: 'Entrenamiento pausado',
      workoutResumed: 'Entrenamiento reanudado',
      intensity: 'Intensidad',
      duration: 'Duración',
      reps: 'Repeticiones',
      sets: 'Series',
      beginnerLevel: 'Principiante',
      intermediateLevel: 'Intermedio',
      advancedLevel: 'Avanzado'
    },
    nutrition: {
      mealLogged: 'Comida registrada con éxito',
      breakfast: 'Desayuno',
      lunch: 'Almuerzo',
      dinner: 'Cena',
      snack: 'Merienda',
      mealScore: 'Puntuación de comida',
      nutritionGoals: 'Objetivos nutricionales',
      dailyCalories: 'Calorías diarias',
      macroBreakdown: 'Desglose de macros',
      waterIntake: 'Consumo de agua'
    },
    achievements: {
      levelUp: '¡Subiste de nivel! Alcanzaste el nivel {level}',
      pointsEarned: '¡Ganaste {points} puntos!',
      streakMaintained: 'Racha mantenida por {days} días',
      challengeCompleted: '¡Desafío completado!',
      dailyGoalReached: '¡Objetivo diario alcanzado!',
      weeklyGoalReached: '¡Objetivo semanal alcanzado!'
    },
    errors: {
      genericError: 'Algo salió mal. Por favor, inténtalo de nuevo.',
      networkError: 'Error de red. Verifica tu conexión.',
      authenticationError: 'Autenticación fallida. Inicia sesión de nuevo.',
      validationError: 'Verifica tu entrada e inténtalo de nuevo.',
      fileUploadError: 'Error al subir archivo. Inténtalo de nuevo.',
      cameraError: 'Error al acceder a la cámara. Verifica los permisos.'
    },
    units: {
      kg: 'kg',
      lbs: 'lbs',
      cm: 'cm',
      ft: 'ft',
      in: 'in',
      kcal: 'kcal',
      g: 'g',
      ml: 'ml',
      oz: 'oz',
      min: 'min',
      sec: 'seg',
      bpm: 'lpm'
    }
  },
  de: {
    common: {
      loading: 'Laden...',
      save: 'Speichern',
      cancel: 'Abbrechen',
      submit: 'Senden',
      back: 'Zurück',
      next: 'Weiter',
      previous: 'Vorherige',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      search: 'Suchen',
      settings: 'Einstellungen',
      profile: 'Profil',
      logout: 'Abmelden',
      login: 'Anmelden',
      signup: 'Registrieren',
      email: 'E-Mail',
      password: 'Passwort',
      confirmPassword: 'Passwort bestätigen',
      name: 'Name',
      age: 'Alter',
      height: 'Größe',
      weight: 'Gewicht',
      date: 'Datum',
      time: 'Zeit',
      calories: 'Kalorien',
      protein: 'Eiweiß',
      carbs: 'Kohlenhydrate',
      fat: 'Fett',
      fiber: 'Ballaststoffe'
    },
    navigation: {
      dashboard: 'Dashboard',
      workouts: 'Workouts',
      nutrition: 'Ernährung',
      progress: 'Fortschritt',
      mealScanner: 'Mahlzeit-Scanner',
      profile: 'Profil'
    },
    fitness: {
      workoutCompleted: 'Workout abgeschlossen!',
      exerciseStarted: 'Übung gestartet',
      restTime: 'Pausenzeit',
      nextExercise: 'Nächste Übung',
      workoutPaused: 'Workout pausiert',
      workoutResumed: 'Workout fortgesetzt',
      intensity: 'Intensität',
      duration: 'Dauer',
      reps: 'Wiederholungen',
      sets: 'Sätze',
      beginnerLevel: 'Anfänger',
      intermediateLevel: 'Fortgeschritten',
      advancedLevel: 'Experte'
    },
    nutrition: {
      mealLogged: 'Mahlzeit erfolgreich protokolliert',
      breakfast: 'Frühstück',
      lunch: 'Mittagessen',
      dinner: 'Abendessen',
      snack: 'Snack',
      mealScore: 'Mahlzeit-Bewertung',
      nutritionGoals: 'Ernährungsziele',
      dailyCalories: 'Tägliche Kalorien',
      macroBreakdown: 'Makro-Aufschlüsselung',
      waterIntake: 'Wasseraufnahme'
    },
    achievements: {
      levelUp: 'Level aufgestiegen! Du hast Level {level} erreicht',
      pointsEarned: 'Du hast {points} Punkte verdient!',
      streakMaintained: 'Serie für {days} Tage aufrechterhalten',
      challengeCompleted: 'Herausforderung abgeschlossen!',
      dailyGoalReached: 'Tagesziel erreicht!',
      weeklyGoalReached: 'Wochenziel erreicht!'
    },
    errors: {
      genericError: 'Etwas ist schiefgelaufen. Bitte versuche es erneut.',
      networkError: 'Netzwerkfehler. Bitte überprüfe deine Verbindung.',
      authenticationError: 'Authentifizierung fehlgeschlagen. Bitte melde dich erneut an.',
      validationError: 'Bitte überprüfe deine Eingabe und versuche es erneut.',
      fileUploadError: 'Datei-Upload fehlgeschlagen. Bitte versuche es erneut.',
      cameraError: 'Kamera-Zugriff fehlgeschlagen. Bitte überprüfe die Berechtigungen.'
    },
    units: {
      kg: 'kg',
      lbs: 'lbs',
      cm: 'cm',
      ft: 'ft',
      in: 'in',
      kcal: 'kcal',
      g: 'g',
      ml: 'ml',
      oz: 'oz',
      min: 'min',
      sec: 'sek',
      bpm: 'spm'
    }
  },
  ar: {
    common: {
      loading: 'جاري التحميل...',
      save: 'حفظ',
      cancel: 'إلغاء',
      submit: 'إرسال',
      back: 'رجوع',
      next: 'التالي',
      previous: 'السابق',
      delete: 'حذف',
      edit: 'تعديل',
      search: 'بحث',
      settings: 'الإعدادات',
      profile: 'الملف الشخصي',
      logout: 'تسجيل الخروج',
      login: 'تسجيل الدخول',
      signup: 'إنشاء حساب',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      name: 'الاسم',
      age: 'العمر',
      height: 'الطول',
      weight: 'الوزن',
      date: 'التاريخ',
      time: 'الوقت',
      calories: 'السعرات الحرارية',
      protein: 'البروتين',
      carbs: 'الكربوهيدرات',
      fat: 'الدهون',
      fiber: 'الألياف'
    },
    navigation: {
      dashboard: 'لوحة القيادة',
      workouts: 'التمارين',
      nutrition: 'التغذية',
      progress: 'التقدم',
      mealScanner: 'ماسح الوجبات',
      profile: 'الملف الشخصي'
    },
    fitness: {
      workoutCompleted: 'تم إكمال التمرين!',
      exerciseStarted: 'بدأ التمرين',
      restTime: 'وقت الراحة',
      nextExercise: 'التمرين التالي',
      workoutPaused: 'تم إيقاف التمرين مؤقتاً',
      workoutResumed: 'تم استئناف التمرين',
      intensity: 'الشدة',
      duration: 'المدة',
      reps: 'التكرارات',
      sets: 'المجموعات',
      beginnerLevel: 'مبتدئ',
      intermediateLevel: 'متوسط',
      advancedLevel: 'متقدم'
    },
    nutrition: {
      mealLogged: 'تم تسجيل الوجبة بنجاح',
      breakfast: 'الإفطار',
      lunch: 'الغداء',
      dinner: 'العشاء',
      snack: 'وجبة خفيفة',
      mealScore: 'نقاط الوجبة',
      nutritionGoals: 'أهداف التغذية',
      dailyCalories: 'السعرات اليومية',
      macroBreakdown: 'تفصيل الماكرو',
      waterIntake: 'شرب الماء'
    },
    achievements: {
      levelUp: 'ارتقيت بالمستوى! وصلت للمستوى {level}',
      pointsEarned: 'حصلت على {points} نقطة!',
      streakMaintained: 'تم الحفاظ على الخط لمدة {days} أيام',
      challengeCompleted: 'تم إكمال التحدي!',
      dailyGoalReached: 'تم الوصول للهدف اليومي!',
      weeklyGoalReached: 'تم الوصول للهدف الأسبوعي!'
    },
    errors: {
      genericError: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
      networkError: 'خطأ في الشبكة. يرجى التحقق من الاتصال.',
      authenticationError: 'فشل في المصادقة. يرجى تسجيل الدخول مرة أخرى.',
      validationError: 'يرجى التحقق من الإدخال والمحاولة مرة أخرى.',
      fileUploadError: 'فشل في رفع الملف. يرجى المحاولة مرة أخرى.',
      cameraError: 'فشل في الوصول للكاميرا. يرجى التحقق من الأذونات.'
    },
    units: {
      kg: 'كغ',
      lbs: 'رطل',
      cm: 'سم',
      ft: 'قدم',
      in: 'بوصة',
      kcal: 'سعرة',
      g: 'غ',
      ml: 'مل',
      oz: 'أونصة',
      min: 'دقيقة',
      sec: 'ثانية',
      bpm: 'ن/د'
    }
  }
};

interface InternationalizationProviderProps {
  children: ReactNode;
}

export function InternationalizationProvider({ children }: InternationalizationProviderProps) {
  const [locale, setLocaleState] = useState(() => {
    // Try to get locale from localStorage first, then browser language, then default to 'en'
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && supportedLocales.some(l => l.code === savedLocale)) {
      return savedLocale;
    }
    
    const browserLocale = navigator.language.split('-')[0];
    if (supportedLocales.some(l => l.code === browserLocale)) {
      return browserLocale;
    }
    
    return 'en';
  });

  const currentLocaleInfo = supportedLocales.find(l => l.code === locale) || supportedLocales[0];
  const isRTL = currentLocaleInfo.rtl || false;

  useEffect(() => {
    // Apply RTL/LTR direction to document
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    
    // Save locale to localStorage
    localStorage.setItem('locale', locale);
  }, [locale, isRTL]);

  const setLocale = (newLocale: string) => {
    if (supportedLocales.some(l => l.code === newLocale)) {
      setLocaleState(newLocale);
      toast.success(`Language changed to ${supportedLocales.find(l => l.code === newLocale)?.name}`);
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[locale];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        // Fallback to English if translation not found
        value = translations.en;
        for (const fallbackKey of keys) {
          value = value?.[fallbackKey];
          if (value === undefined) {
            return key; // Return the key if no translation found
          }
        }
        break;
      }
    }
    
    if (typeof value !== 'string') {
      return key;
    }
    
    // Replace parameters
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }
    
    return value;
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat(locale).format(value);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const contextValue: InternationalizationContextType = {
    locale,
    setLocale,
    t,
    formatNumber,
    formatDate,
    supportedLocales,
    isRTL
  };

  return (
    <InternationalizationContext.Provider value={contextValue}>
      {children}
    </InternationalizationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(InternationalizationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an InternationalizationProvider');
  }
  return context;
}

// Language Selector Component
export function LanguageSelector() {
  const { locale, setLocale, supportedLocales } = useTranslation();

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value)}
      className="px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {supportedLocales.map((localeInfo) => (
        <option key={localeInfo.code} value={localeInfo.code}>
          {localeInfo.flag} {localeInfo.nativeName}
        </option>
      ))}
    </select>
  );
}