
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface CategoryOption {
  id: string;
  title: string;
  description: string;
}

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const categories: CategoryOption[] = [
  {
    id: 'individual',
    title: 'Individual',
    description: 'For freelancers, consultants, and single-person accounts'
  },
  {
    id: 'proprietorship',
    title: 'Proprietorship',
    description: 'For sole-owner businesses with a GST number'
  },
  {
    id: 'private_limited',
    title: 'Private Limited',
    description: 'For MCA-registered companies with CIN'
  },
  {
    id: 'llp',
    title: 'LLP',
    description: 'For Limited Liability Partnerships with LLPIN'
  },
  {
    id: 'corporation',
    title: 'Corporation',
    description: 'For Public Limited companies, MNCs, and Government organizations'
  }
];

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Your Category</h3>
      <p className="text-sm text-muted-foreground">
        Choose the category that best describes your business entity for verification
      </p>
      
      <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
        {categories.map((category) => (
          <Card 
            key={category.id}
            className={`cursor-pointer transition-all ${
              value === category.id ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}
            onClick={() => onChange(category.id)}
          >
            <CardContent className="p-4 flex items-center">
              <RadioGroupItem value={category.id} id={category.id} className="mr-4" />
              <div className="flex-1">
                <Label 
                  htmlFor={category.id}
                  className="font-medium cursor-pointer"
                >
                  {category.title}
                </Label>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
              {value === category.id && (
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </RadioGroup>
    </div>
  );
}
