import { useEffect, useRef, useState } from "preact/hooks";
import { sounds } from "../utils/sounds.ts";

/**
 * 🎨 Magic Dropdown Component - LUSH Edition
 *
 * Reusable dropdown with cosmic styling:
 * - Checkmarks for selected items
 * - Spring animation on open/close
 * - Rotating arrow with bounce
 * - Keyboard accessible (arrow keys, enter, escape)
 * - Color indication when changed
 * - Sound effects
 * - Hover scale and glow effects
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
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (optionValue: string) => {
    sounds.click();
    onChange(optionValue);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const selectedOption = options.find((o) => o.value === value);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % options.length);
          sounds.hover && sounds.hover();
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) =>
            (prev - 1 + options.length) % options.length
          );
          sounds.hover && sounds.hover();
          break;
        case "Enter":
          e.preventDefault();
          if (focusedIndex >= 0) {
            handleSelect(options[focusedIndex].value);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, focusedIndex, options]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      class="relative w-full sm:w-auto"
      style="min-width: 140px;"
    >
      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`${label} selector`}
        class="magic-select border-3 sm:border-4 rounded-xl sm:rounded-2xl font-mono font-bold cursor-pointer transition-all shadow-brutal hover:shadow-brutal-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-4"
        style={`
          height: 40px;
          padding: 0 12px;
          display: flex;
          align-items: center;
          width: 100%;
          @media (min-width: 640px) {
            height: 52px;
            padding: 0 20px;
          }
          ${
          changed
            ? "background-color: var(--color-accent, #a855f7); color: var(--color-text, #faf9f6); border-color: var(--color-border, #a855f7); filter: drop-shadow(0 0 12px var(--color-accent));"
            : "background-color: var(--color-secondary, #1a1a1a); border-color: var(--color-border, #a855f7); color: var(--color-text, #faf9f6);"
        }
          ${isOpen ? "filter: drop-shadow(0 0 16px var(--color-accent));" : ""}
        `}
        onClick={(e) => {
          e.stopPropagation();
          sounds.click();
          setIsOpen(!isOpen);
        }}
      >
        <div class="flex items-center justify-between w-full">
          <span class="text-xs sm:text-sm truncate">
            <span class="opacity-60 mr-1">{label}:</span>
            <span class="font-black">
              {selectedOption?.name || "Select..."}
            </span>
          </span>
          <span
            class="text-base flex-shrink-0 ml-1"
            style={`color: var(--color-accent, #a855f7); transform: rotate(${
              isOpen ? "180" : "0"
            }deg); transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);`}
          >
            ▼
          </span>
        </div>
      </button>
      {isOpen && (
        <div
          role="listbox"
          class="absolute z-20 w-full border-4 rounded-2xl shadow-brutal-lg overflow-hidden dropdown-scrollbar"
          style="background-color: var(--color-secondary, #1a1a1a); border-color: var(--color-border, #a855f7); max-height: 300px; overflow-y: auto; margin-top: 8px; animation: dropdown-spring 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);"
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              role="option"
              aria-selected={value === option.value}
              tabIndex={0}
              class="font-mono font-bold cursor-pointer transition-all"
              style={`
                padding: 12px 20px;
                font-size: 14px;
                background-color: ${
                value === option.value
                  ? "var(--color-accent, #a855f7)"
                  : index === focusedIndex
                  ? "rgba(168, 85, 247, 0.2)"
                  : "transparent"
              };
                color: var(--color-text, #faf9f6);
                transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                ${
                index === focusedIndex || value === option.value
                  ? "filter: drop-shadow(0 0 8px var(--color-accent));"
                  : ""
              }
              `}
              onClick={() => handleSelect(option.value)}
              onMouseEnter={(e) => {
                setFocusedIndex(index);
                if (value !== option.value) {
                  (e.target as HTMLElement).style.paddingLeft = "28px";
                  (e.target as HTMLElement).style.transform = "scale(1.02)";
                }
                sounds.hover && sounds.hover();
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.paddingLeft = "20px";
                (e.target as HTMLElement).style.transform = "scale(1)";
              }}
            >
              <span style="display: inline-flex; align-items: center; gap: 8px;">
                {value === option.value && (
                  <span style="font-size: 16px;">✓</span>
                )}
                {option.name}
              </span>
            </div>
          ))}
        </div>
      )}
      <style>
        {`
        @keyframes dropdown-spring {
          0% {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          60% {
            opacity: 1;
            transform: translateY(2px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        `}
      </style>
    </div>
  );
}
