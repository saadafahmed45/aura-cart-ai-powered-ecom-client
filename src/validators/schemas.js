import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().optional().or(z.literal(''))
});

export const addressSchema = z.object({
  street: z.string().min(5, 'Street address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State/Province is required'),
  zip: z.string().min(3, 'ZIP/Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  isDefault: z.boolean().default(false)
});

export const checkoutSchema = z.object({
  street: z.string().min(5, 'Street address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State/Province is required'),
  zip: z.string().min(3, 'ZIP/Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  couponCode: z.string().optional()
});

export const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  brand: z.string().min(2, 'Brand is required'),
  category: z.string().min(1, 'Category is required'),
  shortDescription: z.string().optional(),
  fullDescription: z.string().min(10, 'Description must be at least 10 characters'),
  status: z.enum(['active', 'inactive', 'draft']).default('active'),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  variants: z.array(z.object({
    size: z.string().min(1, 'Size is required'),
    price: z.preprocess((val) => Number(val), z.number().positive('Price must be positive')),
    salePrice: z.preprocess((val) => {
      if (val === '' || val === undefined || val === null) return 0;
      return Number(val);
    }, z.number().nonnegative().optional()).default(0),
    sku: z.string().min(2, 'SKU is required'),
    stock: z.preprocess((val) => Number(val), z.number().int().nonnegative('Stock cannot be negative')),
    image: z.string().optional(),
    active: z.boolean().default(true)
  })).min(1, 'At least one variant size is required'),
  fragrance: z.object({
    fragranceFamily: z.string().optional().or(z.literal('')),
    topNotes: z.preprocess((val) => {
      if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
      return val;
    }, z.array(z.string())),
    middleNotes: z.preprocess((val) => {
      if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
      return val;
    }, z.array(z.string())),
    baseNotes: z.preprocess((val) => {
      if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
      return val;
    }, z.array(z.string())),
    concentration: z.enum(['EDP', 'EDT', 'Parfum', 'Cologne', 'Eau Fraiche', 'Other']).default('EDP'),
    gender: z.enum(['Men', 'Women', 'Unisex']).default('Unisex'),
    season: z.array(z.string()).optional().default([]),
    occasion: z.array(z.string()).optional().default([])
  }).optional(),
  performance: z.object({
    longevity: z.preprocess((val) => Number(val), z.number().min(0).max(100)).default(80),
    projection: z.preprocess((val) => Number(val), z.number().min(0).max(100)).default(80)
  }).optional()
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional()
});

export const couponSchema = z.object({
  code: z.string().min(3, 'Coupon code must be at least 3 characters').toUpperCase(),
  discountType: z.enum(['percentage', 'fixed']),
  amount: z.preprocess((val) => Number(val), z.number().positive('Amount must be greater than 0')),
  expiryDate: z.string().min(10, 'Expiry date is required'),
  isActive: z.boolean().default(true)
});

export const reviewSchema = z.object({
  rating: z.preprocess((val) => Number(val), z.number().min(1).max(5)),
  comment: z.string().min(5, 'Review must be at least 5 characters')
});

export const heroSlideSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional().or(z.literal('')),
  buttonText: z.string().optional().or(z.literal('')),
  buttonLink: z.string().optional().or(z.literal('')),
  order: z.preprocess((val) => {
    if (val === '' || val === undefined || val === null) return 0;
    return Number(val);
  }, z.number().int().nonnegative().optional()).default(0),
  isActive: z.boolean().default(true)
});

