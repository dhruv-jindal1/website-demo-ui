import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'timeTrack_categories';

const palette = [
  '#4f7cff',
  '#7c5cff',
  '#33c7ff',
  '#61d98c',
  '#ffb84d',
  '#ff6b7a',
  '#8d84ff',
  '#78a8ff',
  '#7ae3a1',
  '#ff8a65',
  '#f472b6',
  '#22c55e',
];

const defaultCategories = [
  { id: 'cat-1', name: 'Research', color: '#78a8ff' },
  { id: 'cat-2', name: 'Engagement', color: '#7ae3a1' },
  { id: 'cat-3', name: 'Teaching', color: '#8d84ff' },
];

function getRandomColor(existingCategories = []) {
  const usedColors = existingCategories.map((category) => category.color);
  const availableColors = palette.filter((color) => !usedColors.includes(color));

  if (availableColors.length > 0) {
    return availableColors[Math.floor(Math.random() * availableColors.length)];
  }

  return palette[Math.floor(Math.random() * palette.length)];
}

export function useCategories() {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const addCategory = (name) => {
    const trimmed = name.trim();

    if (!trimmed) {
      return { ok: false, message: 'Category name is required.' };
    }

    const exists = categories.some(
      (category) => category.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (exists) {
      return { ok: false, message: 'Category already exists.' };
    }

    const newCategory = {
      id: `cat-${Date.now()}`,
      name: trimmed,
      color: getRandomColor(categories),
    };

    setCategories((prev) => [...prev, newCategory]);
    return { ok: true, category: newCategory };
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
  };

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
    [categories]
  );

  return {
    categories: sortedCategories,
    addCategory,
    deleteCategory,
  };
}