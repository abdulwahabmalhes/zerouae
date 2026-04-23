"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export type Lang = "en" | "ar";

const translations = {
  en: {
    // Nav
    home: "Home", listings: "Browse Ads", postAd: "Post Ad",
    login: "Login", logout: "Logout", dashboard: "Dashboard",
    admin: "Admin", search: "Search",
    // Hero
    heroTitle: "Find, Buy & Sell\nEverything in UAE",
    heroSub: "The UAE's #1 classified marketplace — trusted by thousands of buyers & sellers.",
    searchPlaceholder: "What are you looking for?",
    allEmirates: "All Emirates",
    // Categories
    categories: "Categories", viewAll: "View All",
    vehicles: "Vehicles", property: "Property", electronics: "Electronics",
    jobs: "Jobs", furniture: "Furniture", services: "Services",
    fashion: "Fashion", babies: "Babies & Kids",
    // Listings
    featuredAds: "Featured Ads", latestAds: "Latest Ads",
    noResults: "No results found", applyFilters: "Apply Filters",
    resetFilters: "Reset", sortBy: "Sort By", newest: "Newest",
    priceHighLow: "Price: High to Low", priceLowHigh: "Price: Low to High",
    gridView: "Grid View", listView: "List View",
    // Listing detail
    callSeller: "Call Seller", chatNow: "Chat Now", saveListing: "Save",
    shareAd: "Share", reportAd: "Report Ad", similarAds: "Similar Ads",
    postedBy: "Posted By", views: "Views", posted: "Posted",
    // Auth
    phoneNumber: "Phone Number", enterOtp: "Enter OTP",
    sendOtp: "Send OTP", verifyOtp: "Verify & Login",
    orEmail: "Or continue with email", email: "Email Address",
    password: "Password", signIn: "Sign In", signUp: "Create Account",
    forgotPassword: "Forgot password?",
    // Advertiser
    myAds: "My Ads", newAd: "Post New Ad", messages: "Messages",
    analytics: "Analytics", settings: "Settings",
    adTitle: "Ad Title", adCategory: "Category", adPrice: "Price (AED)",
    adDescription: "Description", adLocation: "Location", adImages: "Photos",
    publish: "Publish Ad", draft: "Save Draft", edit: "Edit", delete: "Delete",
    activeAds: "Active Ads", pendingAds: "Pending Review", totalViews: "Total Views",
    // Admin
    overview: "Overview", manageListings: "Listings", users: "Users",
    catManager: "Categories", analyticsTab: "Analytics",
    approve: "Approve", reject: "Reject", pending: "Pending",
    approved: "Approved", rejected: "Rejected",
    totalListings: "Total Listings", totalUsers: "Total Users",
    // Common
    aed: "AED", loading: "Loading...", save: "Save", cancel: "Cancel",
    confirm: "Confirm", back: "Back", next: "Next", submit: "Submit",
    required: "Required", optional: "Optional", select: "Select...",
    darkMode: "Dark Mode", language: "Language",
  },
  ar: {
    // Nav
    home: "الرئيسية", listings: "تصفح الإعلانات", postAd: "أضف إعلان",
    login: "تسجيل الدخول", logout: "خروج", dashboard: "لوحة التحكم",
    admin: "الإدارة", search: "بحث",
    // Hero
    heroTitle: "اشتري وبع كل شيء\nفي الإمارات",
    heroSub: "السوق الإلكتروني الأول في الإمارات — موثوق من آلاف المستخدمين.",
    searchPlaceholder: "عن ماذا تبحث؟",
    allEmirates: "كل الإمارات",
    // Categories
    categories: "الفئات", viewAll: "عرض الكل",
    vehicles: "مركبات", property: "عقارات", electronics: "إلكترونيات",
    jobs: "وظائف", furniture: "أثاث", services: "خدمات",
    fashion: "أزياء", babies: "أطفال",
    // Listings
    featuredAds: "إعلانات مميزة", latestAds: "أحدث الإعلانات",
    noResults: "لا توجد نتائج", applyFilters: "تطبيق الفلاتر",
    resetFilters: "إعادة ضبط", sortBy: "ترتيب", newest: "الأحدث",
    priceHighLow: "السعر: الأعلى", priceLowHigh: "السعر: الأدنى",
    gridView: "عرض شبكي", listView: "عرض قائمة",
    // Listing detail
    callSeller: "اتصل بالبائع", chatNow: "محادثة", saveListing: "حفظ",
    shareAd: "مشاركة", reportAd: "إبلاغ", similarAds: "إعلانات مشابهة",
    postedBy: "من قِبل", views: "مشاهدة", posted: "نُشر",
    // Auth
    phoneNumber: "رقم الهاتف", enterOtp: "أدخل رمز التحقق",
    sendOtp: "إرسال الرمز", verifyOtp: "تحقق وسجّل الدخول",
    orEmail: "أو تابع بالبريد الإلكتروني", email: "البريد الإلكتروني",
    password: "كلمة المرور", signIn: "تسجيل الدخول", signUp: "إنشاء حساب",
    forgotPassword: "نسيت كلمة المرور؟",
    // Advertiser
    myAds: "إعلاناتي", newAd: "إضافة إعلان", messages: "الرسائل",
    analytics: "الإحصائيات", settings: "الإعدادات",
    adTitle: "عنوان الإعلان", adCategory: "الفئة", adPrice: "السعر (درهم)",
    adDescription: "الوصف", adLocation: "الموقع", adImages: "الصور",
    publish: "نشر الإعلان", draft: "حفظ مسودة", edit: "تعديل", delete: "حذف",
    activeAds: "إعلانات نشطة", pendingAds: "قيد المراجعة", totalViews: "إجمالي المشاهدات",
    // Admin
    overview: "نظرة عامة", manageListings: "الإعلانات", users: "المستخدمون",
    catManager: "الفئات", analyticsTab: "التحليلات",
    approve: "قبول", reject: "رفض", pending: "قيد الانتظار",
    approved: "مقبول", rejected: "مرفوض",
    totalListings: "إجمالي الإعلانات", totalUsers: "إجمالي المستخدمين",
    // Common
    aed: "درهم", loading: "جار التحميل...", save: "حفظ", cancel: "إلغاء",
    confirm: "تأكيد", back: "رجوع", next: "التالي", submit: "إرسال",
    required: "مطلوب", optional: "اختياري", select: "اختر...",
    darkMode: "الوضع المظلم", language: "اللغة",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface LangCtx {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: (key: TranslationKey) => string;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LangCtx>({
  lang: "en", dir: "ltr",
  t: (k) => k, setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("zoro_lang") as Lang | null;
    if (stored) apply(stored);
  }, []);

  const apply = (l: Lang) => {
    setLangState(l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  };

  const setLang = (l: Lang) => {
    apply(l);
    localStorage.setItem("zoro_lang", l);
  };

  const t = (key: TranslationKey): string =>
    (translations[lang] as any)[key] ?? (translations.en as any)[key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, dir: lang === "ar" ? "rtl" : "ltr", t, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
