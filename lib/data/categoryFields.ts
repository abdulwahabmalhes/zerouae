// Dynamic fields per category for both Post Ad form and Filter sidebar

export interface FieldConfig {
  key: string;
  label: string;
  label_ar: string;
  type: "text" | "number" | "select" | "radio";
  options?: string[];
  placeholder?: string;
  filterLabel?: string; // shown in filter sidebar
}

export const CATEGORY_FIELDS: Record<number, FieldConfig[]> = {
  // ── Vehicles ──────────────────────────────────────────────────────────────
  1: [
    { key: "make",      label: "Make",          label_ar: "الصانع",       type: "text",   placeholder: "e.g. Toyota, BMW..." },
    { key: "model",     label: "Model",         label_ar: "الموديل",      type: "text",   placeholder: "e.g. Camry, X5..." },
    { key: "year",      label: "Year",          label_ar: "السنة",        type: "select", options: Array.from({length:25},(_,i)=>(2025-i).toString()) },
    { key: "mileage",   label: "Mileage (km)",  label_ar: "الكيلومترات", type: "number", placeholder: "e.g. 45000" },
    { key: "condition", label: "Condition",     label_ar: "الحالة",       type: "select", options: ["New","Excellent","Good","Fair"] },
    { key: "color",     label: "Color",         label_ar: "اللون",        type: "text",   placeholder: "e.g. White, Black..." },
    { key: "fuel_type", label: "Fuel Type",     label_ar: "نوع الوقود",  type: "select", options: ["Petrol","Diesel","Electric","Hybrid"] },
    { key: "gearbox",   label: "Gearbox",       label_ar: "ناقل الحركة", type: "select", options: ["Automatic","Manual"] },
    { key: "body_type", label: "Body Type",     label_ar: "نوع الهيكل",  type: "select", options: ["Sedan","SUV","Coupe","Pickup","Van","Convertible","Hatchback"] },
    { key: "doors",     label: "Doors",         label_ar: "الأبواب",      type: "select", options: ["2","4","5"] },
  ],

  // ── Property ──────────────────────────────────────────────────────────────
  2: [
    { key: "listing_for",label:"Listing For",  label_ar:"للبيع/للإيجار",type:"radio",  options:["Sale","Rent","Monthly","Daily"] },
    { key: "type",       label: "Property Type",label_ar:"نوع العقار",  type: "select",options: ["Apartment","Villa","Studio","Townhouse","Penthouse","Office","Warehouse","Land","Shop"] },
    { key: "area_sqm",   label: "Area (sqm)",  label_ar:"المساحة م²",  type: "number",placeholder:"e.g. 120" },
    { key: "bedrooms",   label: "Bedrooms",    label_ar:"غرف النوم",   type: "select",options:["Studio","1","2","3","4","5","6+"] },
    { key: "bathrooms",  label: "Bathrooms",   label_ar:"الحمامات",    type: "select",options:["1","2","3","4","5+"] },
    { key: "furnished",  label: "Furnished",   label_ar:"مفروش",       type: "select",options:["Yes","No","Partially"] },
    { key: "floor",      label: "Floor",       label_ar:"الطابق",      type: "number",placeholder:"e.g. 12" },
    { key: "parking",    label: "Parking",     label_ar:"موقف سيارة",  type: "select",options:["Yes","No"] },
    { key: "balcony",    label: "Balcony",     label_ar:"شرفة",        type: "select",options:["Yes","No"] },
    { key: "view",       label: "View",        label_ar:"الإطلالة",    type: "select",options:["Sea View","City View","Garden View","Pool View","No View"] },
  ],

  // ── Electronics ───────────────────────────────────────────────────────────
  3: [
    { key: "brand",     label: "Brand",       label_ar:"العلامة التجارية",type:"text",  placeholder:"e.g. Apple, Samsung..." },
    { key: "model",     label: "Model",       label_ar:"الموديل",          type:"text",  placeholder:"e.g. iPhone 15 Pro..." },
    { key: "condition", label: "Condition",   label_ar:"الحالة",            type:"select",options:["New","Like New","Good","Fair","For Parts"] },
    { key: "storage",   label: "Storage",     label_ar:"التخزين",          type:"select",options:["64GB","128GB","256GB","512GB","1TB","2TB"] },
    { key: "color",     label: "Color",       label_ar:"اللون",             type:"text",  placeholder:"e.g. Space Black..." },
    { key: "warranty",  label: "Warranty",    label_ar:"الضمان",           type:"select",options:["Yes","No","Expired"] },
    { key: "accessories",label:"Accessories", label_ar:"الملحقات",          type:"select",options:["Full Box","Charger Only","No Accessories"] },
  ],

  // ── Jobs ──────────────────────────────────────────────────────────────────
  4: [
    { key: "job_type",    label: "Job Type",    label_ar:"نوع الوظيفة", type:"select",options:["Full-time","Part-time","Freelance","Contract","Internship"] },
    { key: "salary",      label: "Salary (AED)",label_ar:"الراتب",      type:"text",  placeholder:"e.g. 8,000 - 12,000" },
    { key: "experience",  label: "Experience",  label_ar:"الخبرة",      type:"select",options:["No Experience","Less than 1 Year","1-2 Years","3-5 Years","5+ Years"] },
    { key: "education",   label: "Education",   label_ar:"التعليم",     type:"select",options:["High School","Diploma","Bachelor","Master","PhD","Not Required"] },
    { key: "gender",      label: "Gender",      label_ar:"الجنس",       type:"select",options:["Any","Male","Female"] },
    { key: "nationality", label: "Nationality", label_ar:"الجنسية",     type:"text",  placeholder:"e.g. Any, Arab..." },
    { key: "industry",    label: "Industry",    label_ar:"القطاع",      type:"select",options:["IT & Software","Sales","Marketing","Engineering","Finance","Healthcare","Education","Hospitality","Construction","Other"] },
  ],

  // ── Furniture ─────────────────────────────────────────────────────────────
  5: [
    { key: "category_type",label:"Item Type",  label_ar:"نوع القطعة",  type:"select",options:["Sofa","Bed","Wardrobe","Table","Chair","Shelving","Mattress","Desk","Cabinet","Other"] },
    { key: "condition",    label:"Condition",  label_ar:"الحالة",       type:"select",options:["New","Like New","Good","Fair"] },
    { key: "material",     label:"Material",   label_ar:"المادة",       type:"select",options:["Wood","Metal","Glass","Fabric","Leather","Plastic"] },
    { key: "color",        label:"Color",      label_ar:"اللون",         type:"text",  placeholder:"e.g. White, Brown..." },
    { key: "brand",        label:"Brand",      label_ar:"العلامة",      type:"text",  placeholder:"e.g. IKEA, Hawa..." },
  ],

  // ── Fashion ───────────────────────────────────────────────────────────────
  6: [
    { key: "brand",    label:"Brand",    label_ar:"الماركة",   type:"text",  placeholder:"e.g. Gucci, Zara..." },
    { key: "size",     label:"Size",     label_ar:"المقاس",    type:"text",  placeholder:"e.g. M, L, 42..." },
    { key: "gender",   label:"For",      label_ar:"للجنس",     type:"select",options:["Men","Women","Unisex","Kids"] },
    { key: "condition",label:"Condition",label_ar:"الحالة",    type:"select",options:["New with Tags","New without Tags","Used","Vintage"] },
    { key: "color",    label:"Color",    label_ar:"اللون",     type:"text",  placeholder:"e.g. Red, Black..." },
    { key: "type",     label:"Type",     label_ar:"النوع",     type:"select",options:["Clothing","Shoes","Bags","Watches","Jewellery","Accessories"] },
  ],

  // ── Babies & Kids ─────────────────────────────────────────────────────────
  7: [
    { key: "type",     label:"Item Type", label_ar:"النوع",    type:"select",options:["Stroller","Car Seat","Crib","Clothes","Toys","Books","Feeding","Other"] },
    { key: "age_range",label:"Age Range", label_ar:"الفئة العمرية",type:"select",options:["0-3 months","3-6 months","6-12 months","1-2 years","2-4 years","4-8 years","8-12 years"] },
    { key: "condition",label:"Condition", label_ar:"الحالة",   type:"select",options:["New","Like New","Good","Fair"] },
    { key: "brand",    label:"Brand",     label_ar:"الماركة",  type:"text",  placeholder:"e.g. Chicco, Graco..." },
  ],

  // ── Services ──────────────────────────────────────────────────────────────
  8: [
    { key: "service_type",label:"Service Type", label_ar:"نوع الخدمة",type:"select",options:["Cleaning","Moving","Repair","Plumbing","Electrical","Painting","Gardening","IT Support","Tutoring","Design","Other"] },
    { key: "availability",label:"Availability", label_ar:"التوفر",    type:"select",options:["Immediate","Within 24h","Within a Week","Flexible"] },
    { key: "location",    label:"Coverage",     label_ar:"التغطية",   type:"select",options:["All UAE","Dubai Only","Abu Dhabi Only","Sharjah Only","Multiple Emirates"] },
    { key: "experience",  label:"Years of Exp.",label_ar:"سنوات الخبرة",type:"select",options:["Less than 1","1-2","3-5","5-10","10+"] },
  ],
};

// Filter-specific fields (subset shown in filter sidebar)
export const CATEGORY_FILTER_FIELDS: Record<number, FieldConfig[]> = {
  1: [
    { key: "make",      label: "Make",      label_ar:"الصانع",      type:"text",   placeholder:"e.g. Toyota..." },
    { key: "model",     label: "Model",     label_ar:"الموديل",     type:"text",   placeholder:"e.g. Camry..." },
    { key: "year",      label: "Year From", label_ar:"السنة من",    type:"select", options:Array.from({length:25},(_,i)=>(2025-i).toString()) },
    { key: "year_to",   label: "Year To",   label_ar:"السنة إلى",   type:"select", options:Array.from({length:25},(_,i)=>(2025-i).toString()) },
    { key: "mileage_max",label:"Max KM",    label_ar:"حد الكيلومتر",type:"select", options:["10,000","30,000","60,000","100,000","150,000","200,000","Any"] },
    { key: "condition", label: "Condition", label_ar:"الحالة",       type:"select", options:["New","Excellent","Good","Fair"] },
    { key: "fuel_type", label: "Fuel Type", label_ar:"نوع الوقود",  type:"select", options:["Petrol","Diesel","Electric","Hybrid"] },
    { key: "gearbox",   label: "Gearbox",   label_ar:"ناقل الحركة", type:"select", options:["Automatic","Manual"] },
  ],
  2: [
    { key: "listing_for",label:"Listing For",label_ar:"للبيع/للإيجار",type:"select",options:["Sale","Rent","Monthly","Daily"] },
    { key: "type",      label:"Property Type",label_ar:"نوع العقار", type:"select", options:["Apartment","Villa","Studio","Townhouse","Office","Warehouse","Land"] },
    { key: "bedrooms",  label:"Bedrooms",   label_ar:"غرف النوم",   type:"select", options:["Studio","1","2","3","4","5+"] },
    { key: "bathrooms", label:"Bathrooms",  label_ar:"الحمامات",    type:"select", options:["1","2","3","4+"] },
    { key: "area_min",  label:"Min Area m²",label_ar:"أدنى مساحة",  type:"number", placeholder:"Min sqm" },
    { key: "area_max",  label:"Max Area m²",label_ar:"أقصى مساحة",  type:"number", placeholder:"Max sqm" },
    { key: "furnished", label:"Furnished",  label_ar:"مفروش",       type:"select", options:["Yes","No","Partially"] },
  ],
  3: [
    { key: "brand",    label:"Brand",    label_ar:"العلامة", type:"text",  placeholder:"e.g. Apple..." },
    { key: "condition",label:"Condition",label_ar:"الحالة",  type:"select",options:["New","Like New","Good","Fair"] },
    { key: "warranty", label:"Warranty", label_ar:"الضمان",  type:"select",options:["Yes","No"] },
  ],
  4: [
    { key: "job_type",  label:"Job Type",  label_ar:"نوع الوظيفة",type:"select",options:["Full-time","Part-time","Freelance","Contract"] },
    { key: "experience",label:"Experience",label_ar:"الخبرة",     type:"select",options:["No Experience","1-2 Years","3-5 Years","5+ Years"] },
    { key: "industry",  label:"Industry",  label_ar:"القطاع",     type:"select",options:["IT & Software","Sales","Marketing","Engineering","Finance","Healthcare","Other"] },
  ],
  5: [
    { key: "condition",label:"Condition",label_ar:"الحالة",type:"select",options:["New","Like New","Good","Fair"] },
  ],
  6: [
    { key: "gender",   label:"For",      label_ar:"للجنس",  type:"select",options:["Men","Women","Unisex","Kids"] },
    { key: "condition",label:"Condition",label_ar:"الحالة", type:"select",options:["New with Tags","New without Tags","Used"] },
    { key: "type",     label:"Type",     label_ar:"النوع",  type:"select",options:["Clothing","Shoes","Bags","Watches","Jewellery"] },
  ],
  7: [
    { key: "age_range",label:"Age Range",label_ar:"الفئة العمرية",type:"select",options:["0-3 months","3-6 months","6-12 months","1-2 years","2-4 years","4-8 years"] },
    { key: "condition",label:"Condition",label_ar:"الحالة",type:"select",options:["New","Like New","Good"] },
  ],
  8: [
    { key: "service_type",label:"Service",    label_ar:"الخدمة",  type:"select",options:["Cleaning","Moving","Repair","Plumbing","Electrical","Painting","IT Support","Other"] },
    { key: "availability",label:"Availability",label_ar:"التوفر",type:"select",options:["Immediate","Within 24h","Within a Week"] },
  ],
};
