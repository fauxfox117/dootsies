"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import gsap from "gsap";

import { useViewTransition } from "@/hooks/useViewTransition";

import "./Nav.css";

const NAV_LINKS = [
  { label: "Home", href: "/", img: "/menu/menu-home.jpg" },
  { label: "Essence", href: "/about", img: "/menu/menu-essence.jpg" },
  { label: "Carte", href: "/menu", img: "/menu/menu-carte.jpg" },
  { label: "Book", href: "/reservation", img: "/menu/menu-book.jpg" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#" },
  { label: "Google", href: "#" },
  { label: "OpenTable", href: "#" },
];

const LINK_TEXT_SELECTORS = [".nav-link a", ".nav-social a"];
const FOOTER_TEXT_SELECTORS = [".nav-menu-footer p span"];
const ALL_TEXT_SELECTORS = [...LINK_TEXT_SELECTORS, ...FOOTER_TEXT_SELECTORS];

export default function Nav({ pageRef }) {
  const pathname = usePathname();
  const lenis = useLenis();
  const { navigateWithTransition } = useViewTransition();

  const lenisInstanceRef = useRef(null);
  const isMenuOpenRef = useRef(false);
  const isMenuAnimatingRef = useRef(false);
  const previewImageRef = useRef(null);

  useEffect(() => {
    lenisInstanceRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    if (isMenuOpenRef.current) forceCloseMenu();
  }, [pathname]);

  function lockScroll() {
    if (lenisInstanceRef.current) lenisInstanceRef.current.stop();
    document.body.style.overflow = "hidden";
  }

  function unlockScroll() {
    document.body.style.overflow = "";
    if (lenisInstanceRef.current) lenisInstanceRef.current.start();
  }

  function prunePreviewImages() {
    const container = previewImageRef.current;
    if (!container) return;
    const images = container.querySelectorAll("img");
    if (images.length > 3) {
      for (let i = 0; i < images.length - 3; i++) {
        container.removeChild(images[i]);
      }
    }
  }

  function resetPreviewImage() {
    const container = previewImageRef.current;
    if (!container) return;
    container.innerHTML = "";
    const defaultImg = document.createElement("img");
    defaultImg.src = NAV_LINKS[0].img;
    container.appendChild(defaultImg);
  }

  function killMenuTextTweens() {
    gsap.killTweensOf(ALL_TEXT_SELECTORS);
  }

  function resetMenuTextToHidden() {
    gsap.set(LINK_TEXT_SELECTORS, { y: "140%", opacity: 0.25 });
    gsap.set(FOOTER_TEXT_SELECTORS, { y: "120%", opacity: 0.25 });
  }

  function animateToggleLabel(isOpening) {
    const openLabel = document.querySelector("#nav-toggle-open");
    const closeLabel = document.querySelector("#nav-toggle-close");

    gsap.to(isOpening ? openLabel : closeLabel, {
      x: -5,
      y: isOpening ? -10 : 10,
      rotation: isOpening ? -5 : 5,
      opacity: 0,
      delay: 0.25,
      duration: 0.5,
      ease: "power2.out",
    });

    gsap.to(isOpening ? closeLabel : openLabel, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      delay: 0.5,
      duration: 0.5,
      ease: "power2.out",
    });
  }

  function openMenu() {
    if (isMenuAnimatingRef.current || isMenuOpenRef.current) return;
    isMenuAnimatingRef.current = true;

    const page = pageRef?.current;
    const scrollY = window.scrollY;

    lockScroll();

    if (page) {
      page.style.transformOrigin = `right ${scrollY}px`;

      gsap.to(page, {
        rotation: 10,
        x: 300,
        y: 450,
        scale: 1.5,
        duration: 1.25,
        ease: "power4.inOut",
      });
    }

    animateToggleLabel(true);
    killMenuTextTweens();
    resetMenuTextToHidden();

    gsap.to(".nav-menu-content", {
      rotation: 0,
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 1.25,
      ease: "power4.inOut",
    });

    gsap.to(ALL_TEXT_SELECTORS, {
      y: "0%",
      opacity: 1,
      delay: 0.75,
      duration: 1,
      ease: "power3.out",
      stagger: 0.1,
    });

    gsap.to(".nav-menu-overlay", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 175%, 0% 100%)",
      duration: 1.25,
      ease: "power4.inOut",
      onComplete: () => {
        isMenuOpenRef.current = true;
        isMenuAnimatingRef.current = false;
      },
    });
  }

  function closeMenu() {
    if (isMenuAnimatingRef.current || !isMenuOpenRef.current) return;
    isMenuAnimatingRef.current = true;

    const page = pageRef?.current;

    if (page) {
      gsap.to(page, {
        rotation: 0,
        x: 0,
        y: 0,
        scale: 1,
        duration: 1.25,
        ease: "power4.inOut",
        onComplete: () => {
          gsap.set(page, { clearProps: "all" });
          page.style.transformOrigin = "";
        },
      });
    }

    animateToggleLabel(false);
    killMenuTextTweens();

    gsap.to(".nav-menu-content", {
      rotation: -15,
      x: -100,
      y: -100,
      scale: 1.5,
      opacity: 0.25,
      duration: 1.25,
      ease: "power4.inOut",
    });

    gsap.to(".nav-menu-overlay", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1.25,
      ease: "power4.inOut",
      onComplete: () => {
        isMenuOpenRef.current = false;
        isMenuAnimatingRef.current = false;
        resetMenuTextToHidden();
        resetPreviewImage();
        unlockScroll();
      },
    });
  }

  function forceCloseMenu() {
    const page = pageRef?.current;
    if (page) {
      gsap.set(page, { clearProps: "all" });
      page.style.transformOrigin = "";
    }

    killMenuTextTweens();

    gsap.set(".nav-menu-overlay", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    });
    gsap.set(".nav-menu-content", {
      rotation: -15,
      x: -100,
      y: -100,
      scale: 1.5,
      opacity: 0.25,
    });

    resetMenuTextToHidden();

    gsap.set("#nav-toggle-open", { x: 0, y: 0, rotation: 0, opacity: 1 });
    gsap.set("#nav-toggle-close", { x: -5, y: 10, rotation: 5, opacity: 0 });

    isMenuOpenRef.current = false;
    isMenuAnimatingRef.current = false;
    resetPreviewImage();
    unlockScroll();
  }

  function handleToggle() {
    if (!isMenuOpenRef.current) openMenu();
    else closeMenu();
  }

  function handleLinkHover(imageSrc) {
    if (!isMenuOpenRef.current || isMenuAnimatingRef.current) return;
    const container = previewImageRef.current;
    if (!container || !imageSrc) return;

    const currentImages = container.querySelectorAll("img");
    if (
      currentImages.length > 0 &&
      currentImages[currentImages.length - 1].src.endsWith(imageSrc)
    )
      return;

    const newImg = document.createElement("img");
    newImg.src = imageSrc;
    newImg.style.opacity = "0";
    newImg.style.transform = "scale(1.25) rotate(10deg)";
    container.appendChild(newImg);
    prunePreviewImages();

    gsap.to(newImg, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.75,
      ease: "power2.out",
    });
  }

  return (
    <>
      <nav className="nav-bar">
        <div className="nav-logo">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateWithTransition("/");
            }}
          >
            <img src="/Dootsies.PNG" alt="Dootsie's" />
          </a>
        </div>

        <div className="nav-toggle" onClick={handleToggle}>
          <p id="nav-toggle-open">Menu</p>
          <p id="nav-toggle-close">Close</p>
        </div>
      </nav>

      <div className="nav-menu-overlay">
        <div className="nav-menu-content">
          <div className="nav-menu-items">
            <div className="nav-col-lg">
              <div className="nav-preview-img" ref={previewImageRef}>
                <img src={NAV_LINKS[0].img} alt="" />
              </div>
            </div>

            <div className="nav-col-sm">
              <div className="nav-menu-links">
                {NAV_LINKS.map((link) => (
                  <div className="nav-link" key={link.label}>
                    <a
                      href={link.href}
                      data-img={link.img}
                      onMouseOver={() => handleLinkHover(link.img)}
                      onClick={(e) => {
                        e.preventDefault();
                        if (link.label === "Carte" || link.label === "Home")
                          navigateWithTransition(link.href);
                      }}
                    >
                      {link.label}
                    </a>
                  </div>
                ))}
              </div>

              <div className="nav-menu-socials">
                {SOCIAL_LINKS.map((social) => (
                  <div className="nav-social" key={social.label}>
                    <a href={social.href}>{social.label}</a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="nav-menu-footer">
            <p className="sm">
              <span>Since 2026</span>
            </p>
            <p className="sm">
              <span>Greenville, SC</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
