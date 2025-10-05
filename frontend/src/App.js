import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";

function formatNumber(val, decimals = 2) {
  const n = Number(val);
  return Number.isFinite(n) ? n.toFixed(decimals) : (0).toFixed(decimals);
}

function getColorHex(label) {
  if (!label) return "#ddd";
  if (/yellow/i.test(label)) return "#E6CA97";
  if (/white/i.test(label)) return "#D9D9D9";
  if (/rose|pink/i.test(label)) return "#E1A4A9";
  return "#bbbbbb";
}

function getColorDisplayName(label) {
  if (!label) return "";
  if (/yellow/i.test(label)) return "Yellow Gold";
  if (/white/i.test(label)) return "White Gold";
  if (/rose|pink/i.test(label)) return "Rose Gold";
  return String(label).replace(/_/g, " ");
}

function orderColorKeys(keys) {
  const priority = ["yellow", "white", "rose", "pink"]; // hedef sıra
  const byPriority = [];
  const others = [];
  keys.forEach((k) => {
    const low = String(k).toLowerCase();
    const idx = priority.findIndex((p) => low.includes(p));
    if (idx >= 0) {
      byPriority[idx] = byPriority[idx] || [];
      byPriority[idx].push(k);
    } else {
      others.push(k);
    }
  });
  return [...byPriority.flat().filter(Boolean), ...others];
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColors, setSelectedColors] = useState({});
  const sliderRefs = useRef({});
  const listSliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(4);

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    setLoading(true);
    setError(null);

    axios
      .get(`${API_URL}/products`)
      .then((res) => {
        const sanitized = (res.data || []).map((p, idx) => {
          const id = p.id ?? p._id ?? `p-${idx}`;

          let price = Number(p.price);
          if (!Number.isFinite(price)) {
            const cleaned = String(p.price ?? "").replace(/[^0-9.-]+/g, "");
            price = parseFloat(cleaned);
          }
          if (!Number.isFinite(price)) price = 0;

          let pop = Number(p.popularityOutOf5);
          if (
            !Number.isFinite(pop) &&
            typeof p.popularityScore !== "undefined"
          ) {
            pop = Number(p.popularityScore) * 5;
          }
          if (!Number.isFinite(pop)) pop = 0;

          const images =
            p.images && typeof p.images === "object"
              ? p.images
              : { default: p.images || "" };

          return {
            ...p,
            id,
            price,
            popularityOutOf5: pop,
            images,
          };
        });

        setProducts(sanitized);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Products fetch error:", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      });
  }, []);

  // Ürün içi görsel carousel ayarları (sadece renk butonları ile kontrol)
  const imageSliderSettings = {
    dots: false,
    arrows: false, // oklar kapalı
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: false, // swipe kapalı; sadece renk butonları ile geçiş
    draggable: false,
  };

  // Ürün listesi için yatay carousel ayarları
  const productListSettings = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 450,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipe: true,
    swipeToSlide: true, // kartların üzerine sürükleyerek rahat geçiş
    touchThreshold: 8,
    edgeFriction: 0.18,
    centerMode: false,
    centerPadding: "0px",
    cssEase: "ease-out",
    adaptiveHeight: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 960,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
      {
        breakpoint: 360,
        settings: { slidesToShow: 1 },
      },
    ],
    afterChange: (idx) => setCurrentSlide(idx),
  };

  // Görünür slide sayısını ekrandan tespit et (progress için)
  useEffect(() => {
    const computeVisible = () => {
      const w = window.innerWidth;
      if (w < 360) return 1;
      if (w < 480) return 1;
      if (w < 640) return 1;
      if (w < 960) return 2;
      if (w < 1280) return 3;
      return 4;
    };
    const update = () => setVisibleSlides(computeVisible());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const totalScrollable = Math.max(products.length - visibleSlides, 0);
  const progressPercent = Math.min(
    100,
    Math.max(0, (currentSlide / totalScrollable) * 100)
  );

  // Loading state
  if (loading) {
    return (
      <div className="container">
        <h1 className="page-title">Product List</h1>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container">
        <h1 className="page-title">Product List</h1>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="container">
        <h1 className="page-title">Product List</h1>
        <div className="empty-container">
          <p>No products available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Product List</h1>

      {/* Ürün listesi artık yatay bir carousel içinde */}
      <Slider
        {...productListSettings}
        className="product-list-slider"
        ref={listSliderRef}
      >
        {products.map((p) => {
          const colorKeysRaw = Object.keys(p.images);
          const colorKeys = orderColorKeys(colorKeysRaw);
          const selectedColor = selectedColors[p.id] ?? colorKeys[0];

          return (
            <div key={p.id} className="card">
              {/* Carousel */}
              <Slider
                {...imageSliderSettings}
                ref={(s) => (sliderRefs.current[p.id] = s)}
              >
                {colorKeys.map((ck) => (
                  <div key={ck} className="img-wrap">
                    <img
                      src={p.images[ck]}
                      alt={`${p.name} ${ck}`}
                      className="product-img"
                    />
                  </div>
                ))}
              </Slider>

              <h2 className="product-title">{p.name}</h2>
              <p className="price">${formatNumber(p.price, 2)} USD</p>

              {/* Renk butonları (sıra: Yellow, White, Rose) */}
              <div className="colors">
                {colorKeys.map((ck, idx) => (
                  <button
                    key={ck}
                    title={ck}
                    onClick={() => {
                      setSelectedColors((prev) => ({ ...prev, [p.id]: ck }));
                      const slider = sliderRefs.current[p.id];
                      if (slider && typeof slider.slickGoTo === "function") {
                        slider.slickGoTo(idx); // renge tıklayınca carousel o resme gider
                      }
                    }}
                    className={`color-btn ${
                      selectedColor === ck ? "active" : ""
                    }`}
                    style={{ backgroundColor: getColorHex(ck) }}
                  />
                ))}
              </div>

              {/* Seçili renk adı */}
              <div className="color-label">
                {getColorDisplayName(selectedColor)}
              </div>

              {(() => {
                const ratingPercent = Math.max(
                  0,
                  Math.min(100, (Number(p.popularityOutOf5) / 5) * 100)
                );
                return (
                  <div className="rating">
                    <span className="stars">
                      <span className="stars-base">★★★★★</span>
                      <span
                        className="stars-fill"
                        style={{ width: `${ratingPercent}%` }}
                      >
                        ★★★★★
                      </span>
                    </span>
                    <span className="rating-value">
                      {formatNumber(p.popularityOutOf5, 1)} / 5
                    </span>
                  </div>
                );
              })()}
            </div>
          );
        })}
      </Slider>
      {/* Alt progress bar */}
      <div className="slider-progress">
        <div className="bar" style={{ width: `${progressPercent}%` }} />
      </div>
    </div>
  );
}
