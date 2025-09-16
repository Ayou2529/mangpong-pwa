// src/components/Header/Header.js - Main Header component

import { HeaderUI } from './HeaderUI.js';

/**
 * Main Header component
 * @param {Object} props - Component properties
 * @param {string} props.title - The title to display
 * @param {Function} props.onBack - Function to call when back button is clicked
 * @returns {string} - HTML string for the header
 */
export function Header({ title, onBack }) {
  return HeaderUI({ title, onBack });
}