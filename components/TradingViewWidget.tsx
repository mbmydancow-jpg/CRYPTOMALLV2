import React, { useEffect, useRef, memo } from 'react';

declare global {
    interface Window {
        TradingView: any;
    }
}

interface TradingViewWidgetProps {
    symbol: string;
    interval?: string;
    allowSymbolChange?: boolean;
    hideTopToolbar?: boolean;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ 
    symbol, 
    interval = "D",
    allowSymbolChange = true,
    hideTopToolbar = false 
}) => {
    const widgetRef = useRef<any>(null);

    useEffect(() => {
        const createWidget = () => {
            const containerId = `tradingview_widget_container_${symbol}`;
            // Ensure the container element exists before trying to create the widget
            if (!document.getElementById(containerId)) {
              const newContainer = document.createElement('div');
              newContainer.id = containerId;
              newContainer.className = "tradingview-widget-container";
              newContainer.style.height = "100%";
              newContainer.style.width = "100%";
              // Assuming this widget is always within a parent that it can append to
              // For GlobalCryptoPage, the parent is the flex-1 div, which is fine
              const parentDiv = document.querySelector(`.flex-1 > .tradingview-widget-container[id^="tradingview_widget_container_"]`)?.parentElement || document.querySelector('.flex-1');
              if (parentDiv) {
                // Remove old widget container if it exists
                const oldContainer = document.getElementById(containerId);
                if (oldContainer) {
                  parentDiv.removeChild(oldContainer);
                }
                parentDiv.appendChild(newContainer);
              } else {
                console.error('Could not find a parent element for TradingViewWidget.');
                return;
              }
            }


            if (window.TradingView) {
                const widgetOptions = {
                    autosize: true,
                    symbol: `BINANCE:${symbol}`,
                    interval: interval,
                    timezone: "Etc/UTC",
                    theme: "dark",
                    style: "1",
                    locale: "en", // Reverted to 'en' for English locale
                    enable_publishing: false,
                    hide_side_toolbar: hideTopToolbar, // Use hideTopToolbar directly
                    allow_symbol_change: allowSymbolChange,
                    container_id: containerId, // Ensure unique ID per symbol
                    // --- Custom Theme Overrides ---
                    overrides: {
                        "paneProperties.background": "#0B0E11", // background
                        "paneProperties.vertGridProperties.color": "#181A20", // panel
                        "paneProperties.horzGridProperties.color": "#181A20", // panel
                        "symbolWatermarkProperties.transparency": 90,
                        "scalesProperties.textColor": "#848E9C", // text-secondary
                        "mainSeriesProperties.candleStyle.upColor": "#0ECB81", // positive
                        "mainSeriesProperties.candleStyle.downColor": "#F6465D", // negative
                        "mainSeriesProperties.candleStyle.wickUpColor": '#0ECB81', // positive
                        "mainSeriesProperties.candleStyle.wickDownColor": '#F6465D', // negative
                        "mainSeriesProperties.candleStyle.borderUpColor": "#0ECB81", // positive
                        "mainSeriesProperties.candleStyle.borderDownColor": "#F6465D", // negative
                    },
                    studies_overrides: {
                        "volume.volume.color.0": "rgba(246, 70, 93, 0.4)", // negative with alpha
                        "volume.volume.color.1": "rgba(14, 203, 129, 0.4)", // positive with alpha
                    },
                    // -----------------------------
                };
                
                // If a widget already exists for this symbol, dispose of it before creating a new one
                if (widgetRef.current) {
                    try {
                        widgetRef.current.remove();
                    } catch (e) {
                        // ignore error
                        console.warn('Error removing old TradingView widget:', e);
                    }
                    widgetRef.current = null;
                }
                
                const widget = new window.TradingView.widget(widgetOptions);
                widgetRef.current = widget;
            }
        };

        if (!window.TradingView) {
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/tv.js';
            script.async = true;
            script.onload = createWidget;
            document.head.appendChild(script);

            return () => {
                if (script.parentNode) {
                   try {
                     document.head.removeChild(script);
                   } catch(e) {
                     // ignore error
                     console.warn('Error removing TradingView script:', e);
                   }
                }
            };
        } else {
            createWidget();
        }

        return () => {
             if (widgetRef.current) {
                try {
                    widgetRef.current.remove();
                } catch (e) {
                    // ignore error
                    console.warn('Error removing TradingView widget on cleanup:', e);
                }
                widgetRef.current = null;
            }
        };

    }, [symbol, interval, allowSymbolChange, hideTopToolbar]);

    return (
        // The actual div for the widget will be dynamically created/managed by useEffect
        // Keeping a placeholder here for the initial render structure.
        <div id={`tradingview_widget_container_${symbol}`} className="tradingview-widget-container" style={{ height: "100%", width: "100%" }} />
    );
};

export default memo(TradingViewWidget);