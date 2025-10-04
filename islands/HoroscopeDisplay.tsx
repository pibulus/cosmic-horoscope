// ===================================================================
// HOROSCOPE DISPLAY ISLAND - Display horoscope with gradient effects
// ===================================================================

import { useSignal, signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { sounds } from "../utils/sounds.ts";
import { analytics } from "../utils/analytics.ts";
import { COLOR_EFFECTS } from "../utils/constants.ts";
import { MagicDropdown } from "../components/MagicDropdown.tsx";
import { applyColorToArt } from "../utils/colorEffects.ts";
import { downloadPNG } from "../utils/exportUtils.ts";
import { getZodiacEmoji, getZodiacSign } from "../utils/zodiac.ts";
import TabSwitcher from "./TabSwitcher.tsx";

interface HoroscopeDisplayProps {
  sign: string;
  onChangeSign?: () => void;
}

type Period = "daily" | "weekly" | "monthly";

export default function HoroscopeDisplay({ sign, onChangeSign }: HoroscopeDisplayProps) {
  const currentPeriod = useSignal<Period>("daily");
  const horoscopeData = useSignal<any>(null);
  const isLoading = useSignal(false);
  const colorEffect = useSignal("none");
  const colorizedHtml = useSignal("");

  // Initialize analytics
  useEffect(() => {
    analytics.init();
  }, []);

  // Fetch horoscope when sign or period changes
  useEffect(() => {
    if (sign) {
      fetchHoroscope(sign, currentPeriod.value);
    }
  }, [sign, currentPeriod.value]);

  // Apply color effect when horoscope or effect changes
  useEffect(() => {
    if (horoscopeData.value?.horoscope_data) {
      const text = horoscopeData.value.horoscope_data;
      if (colorEffect.value !== "none") {
        const colorized = applyColorToArt(text, colorEffect.value);
        colorizedHtml.value = colorized;
      } else {
        colorizedHtml.value = "";
      }
    }
  }, [horoscopeData.value, colorEffect.value]);

  const fetchHoroscope = async (zodiacSign: string, period: Period) => {
    isLoading.value = true;
    try {
      const response = await fetch(`/api/horoscope?sign=${zodiacSign}&period=${period}`);
      const data = await response.json();

      if (data.success) {
        horoscopeData.value = data.data;
        analytics.trackEvent("horoscope_viewed", { sign: zodiacSign, period });
        sounds.success();
      } else {
        console.error("Horoscope fetch failed:", data.error);
        sounds.error();
      }
    } catch (error) {
      console.error("Failed to fetch horoscope:", error);
      sounds.error();
    } finally {
      isLoading.value = false;
    }
  };

  const handlePeriodChange = (period: string) => {
    currentPeriod.value = period as Period;
  };

  const handleExportPNG = async () => {
    analytics.trackExport("png");
    await downloadPNG(".horoscope-display", `${sign}-${currentPeriod.value}-horoscope`);
  };

  const zodiacInfo = getZodiacSign(sign);
  const emoji = getZodiacEmoji(sign);

  return (
    <div class="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div class="text-center mb-8">
        <div class="text-6xl mb-4">{emoji}</div>
        <h1 class="text-4xl md:text-5xl font-bold capitalize bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          {sign}
        </h1>
        {zodiacInfo && (
          <p class="text-gray-400 mt-2">{zodiacInfo.dates}</p>
        )}
        {onChangeSign && (
          <button
            onClick={onChangeSign}
            class="mt-4 px-4 py-2 rounded-lg border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black transition-colors"
          >
            Change Sign
          </button>
        )}
      </div>

      {/* Period Tabs */}
      <div class="mb-6">
        <TabSwitcher
          tabs={[
            { id: "daily", label: "Daily" },
            { id: "weekly", label: "Weekly" },
            { id: "monthly", label: "Monthly" },
          ]}
          activeTab={currentPeriod.value}
          onTabChange={handlePeriodChange}
        />
      </div>

      {/* Color Effect Selector */}
      <div class="mb-6">
        <MagicDropdown
          label="Cosmic Vibes"
          options={COLOR_EFFECTS}
          value={colorEffect.value}
          onChange={(val) => colorEffect.value = val}
        />
      </div>

      {/* Horoscope Display */}
      {isLoading.value ? (
        <div class="text-center py-20">
          <div class="text-4xl mb-4 animate-spin">✨</div>
          <p class="text-gray-400">Consulting the cosmos...</p>
        </div>
      ) : horoscopeData.value ? (
        <div class="mb-8">
          {/* Date */}
          {horoscopeData.value.date && (
            <p class="text-center text-purple-300 mb-4 text-lg">
              {horoscopeData.value.date}
            </p>
          )}

          {/* Horoscope Card */}
          <div
            class="horoscope-display p-8 rounded-2xl border-4 border-black bg-gradient-to-br from-purple-900/60 via-pink-900/60 to-purple-900/60 shadow-2xl"
          >
            {colorizedHtml.value ? (
              <pre
                class="font-mono text-lg leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: colorizedHtml.value }}
              />
            ) : (
              <p class="text-white text-lg leading-relaxed">
                {horoscopeData.value.horoscope_data}
              </p>
            )}
          </div>

          {/* Export Button */}
          <div class="text-center mt-6">
            <button
              onClick={handleExportPNG}
              class="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl border-4 border-black shadow-lg hover:scale-105 transition-transform"
            >
              💾 Export as Image
            </button>
          </div>
        </div>
      ) : (
        <div class="text-center py-20 text-gray-400">
          <p>No horoscope data available</p>
        </div>
      )}
    </div>
  );
}
