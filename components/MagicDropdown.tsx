import { useState } from "preact/hooks";
import { sounds } from "../utils/sounds.ts";

/**
 * 🎨 Magic Dropdown Component
 *
 * Reusable dropdown with TextToAscii's signature styling:
 * - Checkmarks for selected items
 * - Hover shift animation
 * - Rotating arrow
 * - Color indication when changed
 * - Sound effects
 *
 * Built by Pablo for consistent UX 🎸
 */

interface Option {
  name: string;
  value: string;
}

interface MagicDropdownProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  changed?: boolean;
  width?: string;
}

export function MagicDropdown({
  label,
  options,
  value,
  onChange,
  changed = false,
  width = "w-full",
}: MagicDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionValue: string) => {
    sounds.click();
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div class="relative" style="min-width: 200px;">
      <div
        class="magic-select border-4 rounded-2xl font-mono font-bold cursor-pointer transition-all shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5"
        style={`
          height: 52px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          ${changed
            ? "background-color: var(--color-accent, #FF69B4); color: var(--color-base, #FAF9F6); border-color: var(--color-border, #0A0A0A);"
            : "background-color: var(--color-secondary, #FFE5B4); border-color: var(--color-border, #0A0A0A); color: var(--color-text, #0A0A0A);"}
        `}
        onClick={(e) => {
          e.stopPropagation();
          sounds.click();
          setIsOpen(!isOpen);
        }}
      >
        <div class="flex items-center justify-between w-full">
          <span class="text-sm truncate">
            <span class="opacity-60 mr-1">{label}:</span>
            {selectedOption?.name || "Select..."}
          </span>
          <span
            class="text-base transition-transform flex-shrink-0 ml-1"
            style={`color: var(--color-accent, #FF69B4); transform: rotate(${
              isOpen ? "180" : "0"
            }deg);`}
          >
            ▼
          </span>
        </div>
      </div>
      {isOpen && (
        <div
          class="absolute z-20 w-full border-4 rounded-2xl shadow-brutal-lg overflow-hidden dropdown-scrollbar animate-dropdown-open"
          style="background-color: var(--color-base, #FAF9F6); border-color: var(--color-border, #0A0A0A); max-height: 300px; overflow-y: auto; margin-top: 8px;"
        >
          {options.map((option) => (
            <div
              key={option.value}
              class="font-mono font-bold cursor-pointer transition-all"
              style={`
                padding: 12px 20px;
                font-size: 14px;
                background-color: ${
                  value === option.value
                    ? "var(--color-accent, #FF69B4)"
                    : "transparent"
                };
                color: ${
                  value === option.value
                    ? "var(--color-base, #FAF9F6)"
                    : "var(--color-text, #0A0A0A)"
                };
              `}
              onClick={() => handleSelect(option.value)}
              onMouseEnter={(e) => {
                if (value !== option.value) {
                  (e.target as HTMLElement).style.paddingLeft = "28px";
                }
                sounds.hover && sounds.hover();
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.paddingLeft = "20px";
              }}
            >
              {value === option.value && <span class="mr-2">✓</span>}
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
