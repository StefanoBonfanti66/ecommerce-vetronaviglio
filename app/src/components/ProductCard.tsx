import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LanguageContext';
import notImage from '../assets/not-image.png';

interface Product {
  id: string;
  sku: string;
  title_it: string;
  title_en: string;
  price: number;
  attributes: any;
  image_urls: string[];
}

