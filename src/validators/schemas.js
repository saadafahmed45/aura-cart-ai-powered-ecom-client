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
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.preprocess((val) => Number(val), z.number().positive('Price must be greater than 0')),
  discountPrice: z.preprocess((val) => {
    if (val === '' || val === undefined || val === null) return 0;
    return Number(val);
  }, z.number().nonnegative().optional()).default(0),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().min(2, 'Brand is required'),
  stock: z.preprocess((val) => Number(val), z.number().int().nonnegative('Stock cannot be negative')),
}).refine((data) => !data.discountPrice || data.discountPrice < data.price, {
  message: 'Discount price must be less than the regular price',
  path: ['discountPrice']
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
