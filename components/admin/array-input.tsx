import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface ArrayInputProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  variant?: 'chips' | 'list';
}

export function ArrayInput({
  label,
  value,
  onChange,
  placeholder,
  required,
  hint,
  variant = 'chips',
}: ArrayInputProps) {
  const [input, setInput] = useState('');

  const addItem = () => {
    if (input.trim() && !value.includes(input.trim())) {
      onChange([...value, input.trim()]);
      setInput('');
    }
  };

  const removeItem = (item: string) => {
    onChange(value.filter((v) => v !== item));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="space-y-3">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      {/* Input Area */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button type="button" onClick={addItem} variant="outline" size="icon" className="h-10 w-10 shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}

      {/* Display Items */}
      {variant === 'chips' ? (
        <div className="flex flex-wrap gap-2">
          {value.length === 0 ? (
            <p className="text-sm text-muted-foreground">No items added yet</p>
          ) : (
            value.map((item) => (
              <Badge key={item} variant="secondary" className="gap-1">
                {item}
                <button
                  type="button"
                  onClick={() => removeItem(item)}
                  className="ml-1 hover:bg-destructive/20 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {value.length === 0 ? (
            <p className="text-sm text-muted-foreground">No items added yet</p>
          ) : (
            value.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-md border bg-card"
              >
                <span className="flex-1 text-sm">• {item}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item)}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
