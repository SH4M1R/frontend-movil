import { Ionicons } from '@expo/vector-icons';
import React from 'react';

type IconSymbolProps = {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
};

export const IconSymbol: React.FC<IconSymbolProps> = ({ name, size = 24, color = '#000' }) => {
  return <Ionicons name={name} size={size} color={color} />;
};