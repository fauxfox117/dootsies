"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Button from "@/components/Button/Button";
import Copy from "@/components/Copy/Copy";
import { useViewTransition } from "@/hooks/useViewTransition";

import "./Footer.css";

gsap.registerPlugin(ScrollTrigger);

const MOBILE_BREAKPOINT = 1000;

const POSTCARDS = [
  { image: "/footer/footer-img-1.jpg", rotation: -8, x: "-25%" },
  { image: "/footer/footer-img-2.jpg", rotation: 6, x: "20%" },
  { image: "/footer/footer-img-3.jpg", rotation: -4, x: "-15%" },
  { image: "/footer/footer-img-4.jpg", rotation: 10, x: "25%" },
  { image: "/footer/footer-img-5.jpg", rotation: -12, x: "-10%" },
];

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Reservations", href: "/reservation" },
];

const Footer = () => {
  const pathname = usePathname();
  const { navigateWithTransition } = useViewTransition();
  const sectionRef = useRef(null);
  const visitButtonRef = useRef(null);
  const visitButtonContainerRef = useRef(null);

  const handleFooterLinkClick = (event, href) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    navigateWithTransition(href);
  };

  /* button scroll-triggered entrance, re-runs on route change */
  useEffect(() => {
    const heading = sectionRef.current?.querySelector(".footer-heading");
    const buttonContainer = visitButtonContainerRef.current;
    if (!heading || !buttonContainer) return;

    gsap.set(buttonContainer, { autoAlpha: 0, y: 40 });

    const scrollTrigger = ScrollTrigger.create({
      trigger: heading,
      start: "top 50%",
      once: true,
      onEnter: () => {
        gsap.to(buttonContainer, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
        });
      },
    });

    return () => scrollTrigger.kill();
  }, [pathname]);

  /* postcard hover effect (desktop only) */
  useEffect(() => {
    const section = sectionRef.current;
    const button = visitButtonRef.current;
    if (!section || !button) return;

    const cards = gsap.utils.toArray(".footer-postcard");
    const postcardsContainer = section.querySelector(".footer-postcards");
    if (!cards.length || !postcardsContainer) return;

    const postcardTimeline = gsap.timeline({ paused: true });

    cards.forEach((card, index) => {
      const cardData = POSTCARDS[index];
      postcardTimeline.fromTo(
        card,
        { yPercent: 250, xPercent: 0, rotation: 0 },
        {
          yPercent: 55,
          xPercent: parseFloat(cardData.x),
          rotation: cardData.rotation,
          duration: 0.8,
          ease: "power3.out",
        },
        index * 0.07,
      );
    });

    const handleMouseEnter = () => postcardTimeline.play();
    const handleMouseLeave = () => postcardTimeline.reverse();

    let isHoverActive = false;

    const enableHover = () => {
      if (isHoverActive) return;
      button.addEventListener("mouseenter", handleMouseEnter);
      button.addEventListener("mouseleave", handleMouseLeave);
      postcardsContainer.style.display = "";
      isHoverActive = true;
    };

    const disableHover = () => {
      if (!isHoverActive) return;
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
      postcardTimeline.pause(0);
      postcardsContainer.style.display = "none";
      isHoverActive = false;
    };

    const handleResize = () => {
      window.innerWidth < MOBILE_BREAKPOINT ? disableHover() : enableHover();
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      disableHover();
      window.removeEventListener("resize", handleResize);
    };
  }, [pathname]);

  return (
    <footer className="footer" ref={sectionRef}>
      <div className="footer-content">
        <div className="footer-top">
          <section
            className="footer-top-left"
            aria-labelledby="footer-newsletter-title"
          >
            <Copy
              key={`newsletter-${pathname}`}
              type="lines"
              trigger=".footer-heading"
              animateOnScroll
            >
              <h3 id="footer-newsletter-title">Newsletter</h3>
            </Copy>
          </section>

          <nav
            className="footer-top-right"
            aria-labelledby="footer-navigation-title"
          >
            <Copy
              key={`navigation-${pathname}`}
              type="lines"
              trigger=".footer-heading"
              animateOnScroll
            >
              <h3 id="footer-navigation-title">Navigation</h3>
            </Copy>
            <ul>
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={(event) => handleFooterLinkClick(event, link.href)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="footer-heading">
          <p className="footer-eyebrow">Dootsie&apos;s / Greenville, SC</p>
          <Copy key={`heading-${pathname}`} type="lines" animateOnScroll>
            <h2>We Look Forward To Your Visit</h2>
          </Copy>
        </div>

        <div className="footer-button-container" ref={visitButtonContainerRef}>
          <Button href="/reservation" ref={visitButtonRef}>
            Plan Your Visit
          </Button>
        </div>
      </div>

      <div className="footer-postcards">
        {POSTCARDS.map((card, index) => (
          <div className="footer-postcard" key={index}>
            <Image
              src={card.image}
              alt=""
              fill
              sizes="(max-width: 1000px) 360px, 40vw"
            />
          </div>
        ))}
      </div>

      <div className="footer-bar">
        <div className="footer-bar-left">
          <Copy
            key={`left-${pathname}`}
            type="lines"
            trigger=".footer-heading"
            animateOnScroll
          >
            <p className="sm">&copy;2026 All Rights Reserved</p>
          </Copy>
        </div>
        <div className="footer-bar-right">
          <Copy
            key={`right-${pathname}`}
            type="lines"
            trigger=".footer-heading"
            animateOnScroll
          >
            <p className="sm">Built by Steven Bolin</p>
          </Copy>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
